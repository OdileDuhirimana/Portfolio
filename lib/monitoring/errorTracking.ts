import * as Sentry from "@sentry/nextjs";

/**
 * Thin, deliberately minimal error-tracking seam for client-side error
 * boundaries (currently just `app/error.tsx`).
 *
 * WHY this exists: an audit found `app/error.tsx` doing only
 * `console.error(...)`, with its own comment admitting a real
 * error-tracking SDK was "future work... no such SDK is in scope for this
 * pass." Browser console output is invisible once a visitor closes the
 * tab — there is no way to know a production error happened at all unless
 * someone reports it.
 *
 * WHY this is intentionally NOT the full `@sentry/nextjs` setup (no
 * `instrumentation.ts`, no `sentry.server.config.ts`/`sentry.edge.config.ts`,
 * no `withSentryConfig` wrapping `next.config.ts` for source-map upload):
 * that full wiring requires a real Sentry project (org/project slugs, an
 * auth token for the build-time source-map plugin) that doesn't exist in
 * this environment, and a broken build-time plugin would violate this
 * project's "build must succeed with 0 errors" rule. This file implements
 * exactly what's needed for `app/error.tsx`'s client-side capture: call
 * `Sentry.init` lazily (once, only if a DSN is configured) and forward the
 * error. Server-side stack traces won't be source-mapped without the build
 * plugin — documented as a follow-up in README's Tradeoffs section, not
 * silently glossed over.
 *
 * No-op behavior: `NEXT_PUBLIC_SENTRY_DSN` unset (the default — see
 * `.env.example`) means `Sentry.init` is never called, so
 * `Sentry.captureException` is a documented no-op per the SDK's own
 * behavior when uninitialized. `console.error` still runs unconditionally
 * so local development never loses the existing diagnostic.
 */

let sentryInitialized = false;

function ensureSentryInitialized(): boolean {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
  if (!dsn) return false;

  if (!sentryInitialized) {
    Sentry.init({
      dsn,
      // Low, fixed sample rate rather than 1.0: this is a low-traffic
      // personal site, not a product with an SLA to trace — tracing is a
      // "nice to have" here, not the point of adding Sentry at all (error
      // capture is). Keeps quota usage predictable on Sentry's free tier.
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
    });
    sentryInitialized = true;
  }

  return true;
}

export function captureClientError(error: Error & { digest?: string }, context?: Record<string, unknown>): void {
  // Intentionally unconditional: this is the one supported browser-side
  // error-reporting hook Next.js gives error boundaries, and it captures
  // error.digest for correlating with server logs even when Sentry isn't
  // configured at all.
  console.error("Unhandled application error:", error, context);

  if (ensureSentryInitialized()) {
    Sentry.captureException(error, context ? { extra: context } : undefined);
  }
}
