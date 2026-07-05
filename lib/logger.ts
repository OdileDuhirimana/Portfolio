/**
 * Minimal structured logger with per-request correlation IDs.
 *
 * WHY this exists: an audit found every failure path in this codebase
 * (`app/api/contact/route.ts`, `app/api/health/route.ts`) reporting through
 * bare `console.error(string)` calls — free-text, unstructured, and with no
 * way to tie two log lines from the same request together once multiple
 * requests interleave in a shared server process. That's enough for local
 * `npm run dev` debugging but not for reading production logs in Vercel's
 * dashboard or any log aggregator, where structured (JSON) lines are what
 * make filtering/alerting possible at all.
 *
 * This intentionally does NOT pull in a logging library (pino, winston):
 * the whole point of "minimal" here is one JSON.stringify call per log line
 * with a stable shape, not a new dependency and its own configuration
 * surface for a low-traffic personal site. If real request volume ever
 * justifies log aggregation, tracing, or sampling, the createRequestLogger
 * factory is the one seam that would need to change.
 *
 * NEVER log full request bodies, contact form field values, or secrets
 * here — only structural metadata (host/origin headers, error reasons,
 * correlation IDs). See the honeypot/PII-handling notes in
 * lib/email/sendContactEmail.ts for why user-submitted content specifically
 * must stay out of anything that could end up in a shared log stream.
 */

export type LogLevel = "info" | "warn" | "error";

export type LogContext = Record<string, unknown>;

export type RequestLogger = {
  /** Unique per invocation of createRequestLogger; include it in error
   * responses so a user/support ticket can be matched back to a log line. */
  readonly correlationId: string;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
};

function writeLogLine(
  level: LogLevel,
  scope: string,
  correlationId: string,
  message: string,
  context?: LogContext,
): void {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    scope,
    correlationId,
    message,
    ...(context && Object.keys(context).length > 0 ? { context } : {}),
  };

  const line = JSON.stringify(entry);
  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

function generateCorrelationId(): string {
  // `crypto.randomUUID` is available globally in Node.js 20+ and the Edge
  // runtime — no dependency needed. Guarded for older/unusual runtimes
  // rather than assumed, since this logger has no other requirement that
  // would already force a Node-only environment.
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Creates a logger scoped to one request/operation, tagged with a
 * correlation ID so every log line it emits can be grepped together.
 *
 * @param scope A short, stable identifier for the call site, e.g.
 *   `"contact.route"` or `"health.route"` — not the dynamic request path.
 * @param correlationId Optional override (e.g. an inbound
 *   `x-request-id` header) — generates a new UUID by default.
 */
export function createRequestLogger(scope: string, correlationId: string = generateCorrelationId()): RequestLogger {
  return {
    correlationId,
    info: (message, context) => writeLogLine("info", scope, correlationId, message, context),
    warn: (message, context) => writeLogLine("warn", scope, correlationId, message, context),
    error: (message, context) => writeLogLine("error", scope, correlationId, message, context),
  };
}
