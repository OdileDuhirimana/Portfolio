import { afterEach, describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "@/lib/email/sendContactEmail";

const config = {
  apiKey: "test-api-key",
  fromEmail: "from@example.com",
  toEmail: "to@example.com",
};

const validInput = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "Hello, I would like to get in touch about a role.",
};

describe("sendContactEmail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns { ok: true } and calls the provider with the correct request shape on success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendContactEmail(validInput, config);

    expect(result).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      Authorization: `Bearer ${config.apiKey}`,
      "Content-Type": "application/json",
    });

    const body = JSON.parse(init.body as string);
    expect(body.from).toBe(config.fromEmail);
    expect(body.to).toEqual([config.toEmail]);
    expect(body.reply_to).toBe(validInput.email);
  });

  it("returns a provider_error result with the response body when the provider responds with a non-ok status", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      text: async () => "Invalid `from` address",
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendContactEmail(validInput, config);

    expect(result).toEqual({
      ok: false,
      reason: "provider_error",
      details: "Invalid `from` address",
    });
  });

  it("returns a network_error result when fetch itself rejects", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("fetch failed"));
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendContactEmail(validInput, config);

    expect(result).toEqual({
      ok: false,
      reason: "network_error",
      details: "fetch failed",
    });
  });

  it("HTML-escapes user-supplied fields in the html body but leaves the plain-text body raw", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    const maliciousInput = {
      name: `<script>alert(1)</script>`,
      email: `attacker@example.com`,
      message: `Hi & welcome, "friend" <script>alert(1)</script> it's me`,
    };

    await sendContactEmail(maliciousInput, config);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);

    // The HTML body must never contain the raw, unescaped markup.
    expect(body.html).not.toContain("<script>alert(1)</script>");
    expect(body.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(body.html).toContain("&amp;");
    expect(body.html).toContain("&quot;");
    expect(body.html).toContain("&#039;");

    // The plain-text body is not an HTML rendering context, so the source
    // deliberately leaves it unescaped.
    expect(body.text).toContain(maliciousInput.message);
    expect(body.text).toContain(maliciousInput.name);
  });

  it("includes the submitter's name in the subject line", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal("fetch", fetchMock);

    await sendContactEmail(validInput, config);

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.subject).toContain(validInput.name);
  });

  it("falls back to a generic message when reading the error response body itself fails", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => {
        throw new Error("stream already consumed");
      },
    });
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendContactEmail(validInput, config);

    expect(result).toEqual({
      ok: false,
      reason: "provider_error",
      details: "Unknown provider error",
    });
  });
});
