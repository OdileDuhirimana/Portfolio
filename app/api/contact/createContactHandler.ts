import { createHash } from "node:crypto";
import { contactSchema } from "@/lib/validation/contact";
import { errorResponse, okResponse } from "@/lib/api/response";
import type { RateLimitResult } from "@/lib/rate-limit";
import type { ContactEmailInput, EmailProviderConfig, SendEmailResult } from "@/lib/email/sendContactEmail";
import type { RequestLogger } from "@/lib/logger";

/**
 * Explicit dependency-injection seam for the contact route.
 *
 * WHY this exists: an audit correctly noted that calling `checkRateLimit`,
 * `sendContactEmail`, etc. as directly imported module functions is
 * parameter-passing, not dependency injection in the IoC sense — the route
 * module is still compile-time coupled to concrete implementations, and the
 * ONLY way to substitute a fake for a test is `vi.mock()` reaching into the
 * module registry from outside. That works (see the existing
 * `__tests__/route.test.ts`), but it's mocking-by-module-path, not a real
 * seam: nothing about the route's own code expresses "this is swappable."
 *
 * `createContactHandler(deps)` inverts that: this file has ZERO imports of
 * concrete `lib/rate-limit`, `lib/email/sendContactEmail`, or
 * `lib/config/site` implementations — only their TYPES. `app/api/contact/route.ts`
 * is the one place that wires real implementations in. A test can now
 * construct the handler with hand-written fake functions and assert
 * behavior with no `vi.mock()` at all — see
 * `__tests__/createContactHandler.test.ts` for that in practice.
 *
 * Deliberately NOT a general-purpose DI container (no decorators, no
 * reflection, no service locator): for one route with five dependencies, a
 * typed factory function is the whole pattern that's needed. A container
 * would be the overengineering this project's own conventions warn against
 * (see CLAUDE.md's YAGNI/KISS rules) — this is the smallest change that
 * makes the dependencies actually injectable rather than hardcoded imports.
 */
export type ContactHandlerDependencies = {
  checkRateLimit: (key: string) => RateLimitResult;
  sendContactEmail: (input: ContactEmailInput, config: EmailProviderConfig) => Promise<SendEmailResult>;
  getContactRecipientEmail: () => string | undefined;
  createLogger: (scope: string) => RequestLogger;
  /** Reads the two Resend env vars the route needs. A function (not a
   * plain object) so a test can simulate env vars changing between calls,
   * matching how `process.env` actually behaves. */
  getEmailProviderEnv: () => { resendApiKey?: string; fromEmail?: string };
  /** Extracts the rate-limit bucket key from the request. Defaults to the
   * real `x-forwarded-for`/`x-real-ip` header logic if omitted, but is
   * injectable so a test never needs to fabricate realistic proxy headers. */
  getClientIp?: (req: Request) => string;
};

function defaultGetClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function hashClientIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 12);
}

/**
 * See the CSRF defense rationale in the module doc-comment above and the
 * original inline comment history in `route.ts` — verifies the request's
 * `Origin` (or `Referer`) header matches its own `Host`, which requires no
 * injected dependency since it only reads the request itself.
 */
function isTrustedOrigin(req: Request): boolean {
  const host = req.headers.get("host");
  if (!host) return false;

  const candidate = req.headers.get("origin") ?? req.headers.get("referer");
  if (!candidate) return false;

  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}

export function createContactHandler(deps: ContactHandlerDependencies) {
  const getClientIp = deps.getClientIp ?? defaultGetClientIp;

  return async function POST(req: Request): Promise<Response> {
    const logger = deps.createLogger("contact.route");

    if (!isTrustedOrigin(req)) {
      logger.warn("Rejected contact submission with untrusted or missing Origin/Referer.", {
        host: req.headers.get("host"),
        origin: req.headers.get("origin"),
        referer: req.headers.get("referer"),
      });
      return errorResponse("Request origin could not be verified.", 403, "INVALID_ORIGIN");
    }

    const ip = getClientIp(req);
    const clientHash = hashClientIdentifier(ip);
    const rateLimitResult = deps.checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      logger.warn("Rate limit exceeded for a client.", { clientHash, retryAfterSeconds: rateLimitResult.retryAfterSeconds });
      return errorResponse(
        "Too many requests. Please try again later.",
        429,
        "RATE_LIMITED",
        { retryAfterSeconds: rateLimitResult.retryAfterSeconds },
      );
    }

    const rawBody = await req.json().catch(() => null);
    if (!rawBody || typeof rawBody !== "object") {
      return errorResponse("Request body must be valid JSON.", 400, "INVALID_JSON");
    }

    // Honeypot: act successful to avoid helping bots tune attacks, without
    // running validation or sending any email.
    const honey = typeof (rawBody as Record<string, unknown>).honey === "string"
      ? (rawBody as Record<string, unknown>).honey as string
      : "";
    if (honey.trim()) {
      logger.info("Honeypot field filled; treated as spam and silently accepted.", { clientHash });
      return okResponse({});
    }

    const parsed = contactSchema.safeParse(rawBody);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return errorResponse(
        firstIssue?.message ?? "Invalid contact form submission.",
        400,
        "VALIDATION_ERROR",
        { field: firstIssue?.path.join(".") },
      );
    }

    const { name, email, message } = parsed.data;

    const { resendApiKey, fromEmail } = deps.getEmailProviderEnv();
    const toEmail = deps.getContactRecipientEmail();

    if (!resendApiKey || !fromEmail || !toEmail) {
      logger.error("Contact route misconfigured: missing RESEND_API_KEY, CONTACT_FROM_EMAIL, or CONTACT_TO_EMAIL.");
      return errorResponse(
        "Email service is not configured on the server.",
        500,
        "EMAIL_NOT_CONFIGURED",
        { correlationId: logger.correlationId },
      );
    }

    const result = await deps.sendContactEmail(
      { name, email, message },
      { apiKey: resendApiKey, fromEmail, toEmail },
    );

    if (!result.ok) {
      logger.error(`Contact email send failed (${result.reason}).`, { reason: result.reason, details: result.details });
      return errorResponse(
        "Failed to send message. Please try again later.",
        502,
        "EMAIL_SEND_FAILED",
        { correlationId: logger.correlationId },
      );
    }

    logger.info("Contact submission delivered.", { clientHash });
    return okResponse({});
  };
}
