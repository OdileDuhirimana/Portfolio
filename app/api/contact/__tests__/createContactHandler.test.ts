import { describe, expect, it, vi } from "vitest";
import { createContactHandler, type ContactHandlerDependencies } from "@/app/api/contact/createContactHandler";
import type { RequestLogger } from "@/lib/logger";

/**
 * Tests createContactHandler with hand-written fake dependencies — no
 * vi.mock("@/lib/...") anywhere in this file. This is the concrete proof
 * of the DI seam's value: the route's actual behavior (CSRF, rate-limit,
 * validation, honeypot, email-config, provider errors) is fully testable
 * from plain objects and functions, with no reaching into the module
 * registry. Contrast with __tests__/route.test.ts, which still tests the
 * real wired-up route.ts via vi.mock — both are valid, but this file is
 * the one that actually exercises the injectable seam.
 */
function makeSilentLogger(): RequestLogger {
  return {
    correlationId: "test-correlation-id",
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  };
}

function makeDeps(overrides: Partial<ContactHandlerDependencies> = {}): ContactHandlerDependencies {
  return {
    checkRateLimit: vi.fn().mockReturnValue({ allowed: true, remaining: 4, retryAfterSeconds: 0 }),
    sendContactEmail: vi.fn().mockResolvedValue({ ok: true }),
    getContactRecipientEmail: vi.fn().mockReturnValue("owner@example.com"),
    createLogger: vi.fn().mockReturnValue(makeSilentLogger()),
    getEmailProviderEnv: vi.fn().mockReturnValue({ resendApiKey: "key", fromEmail: "from@example.com" }),
    ...overrides,
  };
}

const validPayload = { name: "Jane Doe", email: "jane@example.com", message: "Hello there, I'd like to connect." };
const TRUSTED_HEADERS = { "content-type": "application/json", origin: "http://localhost", host: "localhost" };

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { ...TRUSTED_HEADERS, ...headers },
    body: JSON.stringify(body),
  });
}

describe("createContactHandler (DI seam)", () => {
  it("calls sendContactEmail with the injected recipient/env config and returns 200 on success", async () => {
    const deps = makeDeps();
    const handler = createContactHandler(deps);

    const res = await handler(makeRequest(validPayload));

    expect(res.status).toBe(200);
    expect(deps.sendContactEmail).toHaveBeenCalledWith(
      validPayload,
      { apiKey: "key", fromEmail: "from@example.com", toEmail: "owner@example.com" },
    );
  });

  it("never calls sendContactEmail when the injected checkRateLimit denies the request", async () => {
    const deps = makeDeps({
      checkRateLimit: vi.fn().mockReturnValue({ allowed: false, remaining: 0, retryAfterSeconds: 30 }),
    });
    const handler = createContactHandler(deps);

    const res = await handler(makeRequest(validPayload));

    expect(res.status).toBe(429);
    expect(deps.sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns EMAIL_NOT_CONFIGURED and never calls sendContactEmail when the injected env is incomplete", async () => {
    const deps = makeDeps({ getEmailProviderEnv: vi.fn().mockReturnValue({ resendApiKey: undefined, fromEmail: "from@example.com" }) });
    const handler = createContactHandler(deps);

    const res = await handler(makeRequest(validPayload));
    const body = await res.json();

    expect(res.status).toBe(500);
    expect(body.code).toBe("EMAIL_NOT_CONFIGURED");
    expect(deps.sendContactEmail).not.toHaveBeenCalled();
  });

  it("returns EMAIL_NOT_CONFIGURED when the injected getContactRecipientEmail returns undefined", async () => {
    const deps = makeDeps({ getContactRecipientEmail: vi.fn().mockReturnValue(undefined) });
    const handler = createContactHandler(deps);

    const res = await handler(makeRequest(validPayload));
    expect(res.status).toBe(500);
  });

  it("surfaces a provider failure from the injected sendContactEmail as 502", async () => {
    const deps = makeDeps({
      sendContactEmail: vi.fn().mockResolvedValue({ ok: false, reason: "provider_error", details: "rejected" }),
    });
    const handler = createContactHandler(deps);

    const res = await handler(makeRequest(validPayload));
    const body = await res.json();

    expect(res.status).toBe(502);
    expect(body.code).toBe("EMAIL_SEND_FAILED");
  });

  it("rejects requests with a mismatched Origin before calling any injected dependency", async () => {
    const deps = makeDeps();
    const handler = createContactHandler(deps);

    const res = await handler(makeRequest(validPayload, { origin: "https://evil.example.com" }));

    expect(res.status).toBe(403);
    expect(deps.checkRateLimit).not.toHaveBeenCalled();
    expect(deps.sendContactEmail).not.toHaveBeenCalled();
  });

  it("uses a custom injected getClientIp instead of the default header-parsing logic", async () => {
    const getClientIp = vi.fn().mockReturnValue("custom-key");
    const deps = makeDeps({ getClientIp });
    const handler = createContactHandler(deps);

    await handler(makeRequest(validPayload));

    expect(getClientIp).toHaveBeenCalledTimes(1);
    expect(deps.checkRateLimit).toHaveBeenCalledWith("custom-key");
  });
});
