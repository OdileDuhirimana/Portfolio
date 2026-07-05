import { beforeEach, describe, expect, it } from "vitest";
import { checkRateLimit, __resetRateLimitForTests } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    __resetRateLimitForTests();
  });

  it("allows the first request from a new key", () => {
    const result = checkRateLimit("1.2.3.4", 0);
    expect(result.allowed).toBe(true);
  });

  it("allows up to the configured limit within the window", () => {
    const now = 0;
    for (let i = 0; i < 5; i += 1) {
      const result = checkRateLimit("1.2.3.4", now + i);
      expect(result.allowed).toBe(true);
    }
  });

  it("blocks the request after the limit is exceeded within the window", () => {
    const now = 0;
    for (let i = 0; i < 5; i += 1) {
      checkRateLimit("1.2.3.4", now + i);
    }
    const sixth = checkRateLimit("1.2.3.4", now + 5);
    expect(sixth.allowed).toBe(false);
    expect(sixth.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("resets the count once the window elapses", () => {
    const now = 0;
    for (let i = 0; i < 5; i += 1) {
      checkRateLimit("1.2.3.4", now + i);
    }
    const afterWindow = checkRateLimit("1.2.3.4", now + 61_000);
    expect(afterWindow.allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    for (let i = 0; i < 5; i += 1) {
      checkRateLimit("1.2.3.4", i);
    }
    const otherKey = checkRateLimit("5.6.7.8", 0);
    expect(otherKey.allowed).toBe(true);
  });
});
