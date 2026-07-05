import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { __resetRateLimitForTests } from "@/lib/rate-limit";

const sendContactEmailMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/email/sendContactEmail", () => ({
  sendContactEmail: sendContactEmailMock,
}));

// Imported after the mock so the route picks up the mocked module.
const { POST } = await import("@/app/api/contact/route");

const TRUSTED_HEADERS = { origin: "http://localhost", host: "localhost" };

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...TRUSTED_HEADERS, ...headers },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello, I would like to get in touch about a role.",
};

describe("POST /api/contact", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    __resetRateLimitForTests();
    sendContactEmailMock.mockReset();
    process.env.RESEND_API_KEY = "test-key";
    process.env.CONTACT_FROM_EMAIL = "from@example.com";
    process.env.CONTACT_TO_EMAIL = "to@example.com";
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns 400 for a malformed JSON body", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...TRUSTED_HEADERS },
      body: "{not-json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("INVALID_JSON");
  });

  it("returns 403 when the request has no Origin or Referer header", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", host: "localhost" },
      body: JSON.stringify(validPayload),
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("INVALID_ORIGIN");
    expect(sendContactEmailMock).not.toHaveBeenCalled();
  });

  it("returns 403 when the Origin header does not match the request Host", async () => {
    const req = makeRequest(validPayload, { origin: "https://evil.example.com" });
    const res = await POST(req);
    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.code).toBe("INVALID_ORIGIN");
    expect(sendContactEmailMock).not.toHaveBeenCalled();
  });

  it("accepts a request with no Origin header as long as Referer matches the Host", async () => {
    sendContactEmailMock.mockResolvedValue({ ok: true });
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", host: "localhost", referer: "http://localhost/contact" },
      body: JSON.stringify(validPayload),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("returns 200 without calling the email service when the honeypot is filled", async () => {
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const req = makeRequest({ ...validPayload, honey: "im-a-bot" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(sendContactEmailMock).not.toHaveBeenCalled();

    // Audit-trail assertion (SEC-08): a honeypot catch should still produce
    // a structured log line, even though the HTTP response looks identical
    // to a real success (so bots can't distinguish "caught" from "sent").
    expect(logSpy).toHaveBeenCalled();
    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(parsed.message).toMatch(/honeypot/i);
    expect(parsed).not.toHaveProperty("context.honey");
  });

  it("returns 400 when the name is too short", async () => {
    const req = makeRequest({ ...validPayload, name: "J" });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.code).toBe("VALIDATION_ERROR");
  });

  it("returns 400 when the email is invalid", async () => {
    const req = makeRequest({ ...validPayload, email: "not-an-email" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 when the message is too short", async () => {
    const req = makeRequest({ ...validPayload, message: "short" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when required server env vars are missing", async () => {
    delete process.env.RESEND_API_KEY;
    const req = makeRequest(validPayload);
    const res = await POST(req);
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.code).toBe("EMAIL_NOT_CONFIGURED");
  });

  it("returns 200 and calls the email service for a valid submission", async () => {
    sendContactEmailMock.mockResolvedValue({ ok: true });
    const req = makeRequest(validPayload);
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(sendContactEmailMock).toHaveBeenCalledWith(
      { name: validPayload.name, email: validPayload.email, message: validPayload.message },
      { apiKey: "test-key", fromEmail: "from@example.com", toEmail: "to@example.com" },
    );
  });

  it("returns 502 when the email provider fails", async () => {
    sendContactEmailMock.mockResolvedValue({ ok: false, reason: "provider_error", details: "boom" });
    const req = makeRequest(validPayload);
    const res = await POST(req);
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.code).toBe("EMAIL_SEND_FAILED");
  });

  it("returns 502 when the email provider is unreachable (network error)", async () => {
    sendContactEmailMock.mockResolvedValue({ ok: false, reason: "network_error", details: "fetch failed" });
    const req = makeRequest(validPayload);
    const res = await POST(req);
    expect(res.status).toBe(502);
  });

  it("returns 429 after exceeding the rate limit for one client", async () => {
    sendContactEmailMock.mockResolvedValue({ ok: true });
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const headers = { "x-forwarded-for": "9.9.9.9" };

    for (let i = 0; i < 5; i += 1) {
      const res = await POST(makeRequest(validPayload, headers));
      expect(res.status).toBe(200);
    }

    const res = await POST(makeRequest(validPayload, headers));
    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body.code).toBe("RATE_LIMITED");

    // Audit-trail assertion (SEC-08): the trip itself is logged with a
    // non-reversible client hash, never the raw IP (this project's org-level
    // rule is "never include PII", and an IP address is personal data).
    expect(warnSpy).toHaveBeenCalled();
    const parsed = JSON.parse(warnSpy.mock.calls[0][0] as string);
    expect(parsed.message).toMatch(/rate limit exceeded/i);
    expect(parsed.context).toHaveProperty("clientHash");
    expect(parsed.context.clientHash).not.toContain("9.9.9.9");
  });
});
