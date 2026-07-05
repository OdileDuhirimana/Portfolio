/**
 * In-process, edge/serverless-friendly rate limiter.
 *
 * WHY this approach: the public `/api/contact` endpoint calls a paid,
 * third-party email API with no abuse protection beyond a honeypot field,
 * which a scripted bot trivially bypasses. Real distributed rate limiting
 * (e.g. Upstash Redis) would require provisioning a new external service —
 * out of scope for a static portfolio site and explicitly not pre-approved.
 *
 * TRADEOFF (documented, not hidden): this in-memory limiter is per-instance.
 * On a serverless/edge platform with multiple concurrent instances, an
 * attacker distributed across instances could exceed the nominal limit
 * because each instance keeps its own counters, and a redeploy or cold
 * start resets state. For this project's real traffic profile (a personal
 * portfolio's contact form, not a high-traffic SaaS product), this is a
 * reasonable, honest tradeoff: it stops the common case (a single script
 * hammering the endpoint from one instance) without adding a paid
 * dependency. If this site ever needs airtight multi-instance rate
 * limiting, the correct next step is a shared store (Upstash Redis /
 * Vercel KV) — see README "Tradeoffs" section.
 */

type Bucket = {
  count: number;
  windowStartMs: number;
};

const WINDOW_MS = 60_000; // 1 minute sliding window
const MAX_REQUESTS_PER_WINDOW = 5;

// Module-level state persists for the lifetime of the serverless instance /
// long-running process. Acceptable for this use case (see tradeoff above).
const buckets = new Map<string, Bucket>();

// Bound memory growth: periodically drop buckets that are well outside the
// window so a long-lived instance doesn't accumulate unbounded IP entries.
const MAX_TRACKED_KEYS = 10_000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(key: string, now: number = Date.now()): RateLimitResult {
  if (buckets.size > MAX_TRACKED_KEYS) {
    pruneExpiredBuckets(now);
  }

  const existing = buckets.get(key);

  if (!existing || now - existing.windowStartMs >= WINDOW_MS) {
    buckets.set(key, { count: 1, windowStartMs: now });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((existing.windowStartMs + WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - existing.count,
    retryAfterSeconds: 0,
  };
}

function pruneExpiredBuckets(now: number): void {
  for (const [key, bucket] of buckets.entries()) {
    if (now - bucket.windowStartMs >= WINDOW_MS) {
      buckets.delete(key);
    }
  }
}

/** Test-only helper to reset state between test cases. */
export function __resetRateLimitForTests(): void {
  buckets.clear();
}
