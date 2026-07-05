import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it("returns 200 with ok:true and all checks configured when every env var is set", async () => {
    process.env.RESEND_API_KEY = "key";
    process.env.CONTACT_FROM_EMAIL = "from@example.com";
    process.env.CONTACT_TO_EMAIL = "to@example.com";

    const res = GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.status).toBe("ok");
    expect(body.data.checks).toEqual({
      RESEND_API_KEY: "configured",
      CONTACT_FROM_EMAIL: "configured",
      CONTACT_TO_EMAIL: "configured",
    });
    expect(typeof body.data.timestamp).toBe("string");
  });

  it("still returns HTTP 200 but ok:false with code DEGRADED when a required env var is missing", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.CONTACT_FROM_EMAIL = "from@example.com";
    process.env.CONTACT_TO_EMAIL = "to@example.com";

    const res = GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.code).toBe("DEGRADED");
    expect(body.details.checks.RESEND_API_KEY).toBe("missing");
  });

  it("uses the shared response envelope shape (ok + data|error) consistent with /api/contact", async () => {
    process.env.RESEND_API_KEY = "key";
    process.env.CONTACT_FROM_EMAIL = "from@example.com";
    process.env.CONTACT_TO_EMAIL = "to@example.com";

    const res = GET();
    const body = await res.json();
    expect(body).toHaveProperty("ok");
    expect(body).not.toHaveProperty("status");
    expect(body).not.toHaveProperty("checks");
  });
});
