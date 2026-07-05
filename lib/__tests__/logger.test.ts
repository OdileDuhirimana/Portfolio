import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRequestLogger } from "@/lib/logger";

describe("createRequestLogger", () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("generates a unique correlation ID per logger instance", () => {
    const a = createRequestLogger("test.scope");
    const b = createRequestLogger("test.scope");
    expect(a.correlationId).not.toBe(b.correlationId);
  });

  it("accepts an explicit correlation ID override", () => {
    const logger = createRequestLogger("test.scope", "fixed-id-123");
    expect(logger.correlationId).toBe("fixed-id-123");
  });

  it("writes structured JSON with level, scope, correlationId, and message for .error", () => {
    const logger = createRequestLogger("contact.route", "corr-1");
    logger.error("send failed", { reason: "network_error" });

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const parsed = JSON.parse(errorSpy.mock.calls[0][0] as string);
    expect(parsed).toMatchObject({
      level: "error",
      scope: "contact.route",
      correlationId: "corr-1",
      message: "send failed",
      context: { reason: "network_error" },
    });
    expect(typeof parsed.timestamp).toBe("string");
  });

  it("routes .warn to console.warn and .info to console.log", () => {
    const logger = createRequestLogger("health.route", "corr-2");
    logger.warn("degraded");
    logger.info("ok");

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  it("omits the context field entirely when no context is passed", () => {
    const logger = createRequestLogger("scope", "corr-3");
    logger.info("no context here");

    const parsed = JSON.parse(logSpy.mock.calls[0][0] as string);
    expect(parsed).not.toHaveProperty("context");
  });
});
