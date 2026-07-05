import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sentryInitMock = vi.hoisted(() => vi.fn());
const sentryCaptureExceptionMock = vi.hoisted(() => vi.fn());

vi.mock("@sentry/nextjs", () => ({
  init: sentryInitMock,
  captureException: sentryCaptureExceptionMock,
}));

describe("captureClientError", () => {
  const originalEnv = { ...process.env };
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    sentryInitMock.mockReset();
    sentryCaptureExceptionMock.mockReset();
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("always logs to the console, even without a DSN configured", async () => {
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
    const { captureClientError } = await import("@/lib/monitoring/errorTracking");

    captureClientError(new Error("boom"));

    expect(errorSpy).toHaveBeenCalled();
    expect(sentryInitMock).not.toHaveBeenCalled();
    expect(sentryCaptureExceptionMock).not.toHaveBeenCalled();
  });

  it("initializes and forwards to Sentry when a DSN is configured", async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = "https://example@o0.ingest.sentry.io/0";
    const { captureClientError } = await import("@/lib/monitoring/errorTracking");

    const error = new Error("boom");
    captureClientError(error, { digest: "abc123" });

    expect(sentryInitMock).toHaveBeenCalledTimes(1);
    expect(sentryInitMock).toHaveBeenCalledWith(
      expect.objectContaining({ dsn: "https://example@o0.ingest.sentry.io/0" }),
    );
    expect(sentryCaptureExceptionMock).toHaveBeenCalledWith(error, { extra: { digest: "abc123" } });
  });

  it("only initializes Sentry once across multiple errors", async () => {
    process.env.NEXT_PUBLIC_SENTRY_DSN = "https://example@o0.ingest.sentry.io/0";
    const { captureClientError } = await import("@/lib/monitoring/errorTracking");

    captureClientError(new Error("first"));
    captureClientError(new Error("second"));

    expect(sentryInitMock).toHaveBeenCalledTimes(1);
    expect(sentryCaptureExceptionMock).toHaveBeenCalledTimes(2);
  });
});
