import { errorResponse, okResponse } from "@/lib/api/response";
import { createRequestLogger } from "@/lib/logger";

/**
 * Real health check: verifies the environment variables the contact route
 * depends on are actually present, instead of returning a hardcoded
 * constant that provides zero signal to a monitoring system or Docker
 * healthcheck. This intentionally does NOT verify connectivity to Resend
 * itself (that would consume quota / send test emails on every health
 * check poll) — it verifies the server is configured correctly, which is
 * the failure mode that matters for "will the contact form work right now."
 *
 * WHY it now uses lib/api/response.ts: an audit found this route hand-
 * rolling its own `{ status, timestamp, checks }` shape while `/api/contact`
 * used the shared `{ ok, data }` / `{ ok, error, code }` envelope — two live
 * endpoints, two different response shapes, defeating the point of having
 * a shared envelope module at all. Both routes now return the same
 * top-level `{ ok, ... }` contract, so any client-side fetch wrapper can
 * parse every endpoint's response the same way.
 */

type DependencyCheck = {
  name: string;
  ok: boolean;
};

function checkRequiredEnvVars(): DependencyCheck[] {
  const requiredVars = ["RESEND_API_KEY", "CONTACT_FROM_EMAIL", "CONTACT_TO_EMAIL"] as const;
  return requiredVars.map((name) => ({
    name,
    ok: Boolean(process.env[name]?.trim()),
  }));
}

export function GET() {
  const logger = createRequestLogger("health.route");
  const checks = checkRequiredEnvVars();
  const allHealthy = checks.every((check) => check.ok);
  const checksSummary = Object.fromEntries(
    checks.map((check) => [check.name, check.ok ? "configured" : "missing"]),
  );
  const timestamp = new Date().toISOString();

  if (allHealthy) {
    return okResponse({ status: "ok" as const, timestamp, checks: checksSummary });
  }

  const missing = checks.filter((check) => !check.ok).map((check) => check.name);
  logger.warn("Health check degraded: one or more contact-form env vars are missing.", { missing });

  // Deliberately still a 200: the site itself is up and serving pages even
  // when the contact-form email dependency is misconfigured. A hard 5xx
  // here would make deployment platforms think the whole app is down over
  // a missing email API key, which is a much smaller blast radius — `ok`/
  // `code` in the body is what a monitor should actually alert on, not the
  // HTTP status.
  return errorResponse(
    "One or more contact-form dependencies are not configured.",
    200,
    "DEGRADED",
    { timestamp, checks: checksSummary },
  );
}
