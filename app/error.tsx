"use client";

import { useEffect } from "react";
import Link from "next/link";
import { captureClientError } from "@/lib/monitoring/errorTracking";

/**
 * Root error boundary. Next.js renders this in place of the failing segment
 * for any uncaught render/render-phase error below the root layout.
 *
 * WHY this matters here: without this file, any unhandled exception (a bad
 * project entry, a failed client component render) falls through to Next's
 * generic framework error screen, which doesn't match the site's design and
 * gives the visitor no way back into the app — directly contradicting this
 * project's own "handle loading, error, and empty states" rule.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Reports to Sentry when NEXT_PUBLIC_SENTRY_DSN is configured, and
    // always logs to the console — see lib/monitoring/errorTracking.ts for
    // why this isn't the full @sentry/nextjs build-time integration.
    captureClientError(error, { digest: error.digest });
  }, [error]);

  return (
    <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center md:px-8">
      <p className="text-sm font-mono tracking-widest uppercase text-(--danger)">Error</p>
      <h1 className="text-4xl font-semibold md:text-5xl text-(--text)">
        Something went wrong
      </h1>
      <p className="max-w-md text-base text-(--muted)">
        An unexpected error occurred while rendering this page. You can try again, or head back home.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-(--gold) px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-(--line) px-6 py-3 text-sm font-medium text-(--text) transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
