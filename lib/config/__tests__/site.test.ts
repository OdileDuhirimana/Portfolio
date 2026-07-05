import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("siteConfig", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("never falls back to a hardcoded personal email or phone number", async () => {
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    delete process.env.NEXT_PUBLIC_CONTACT_PHONE;
    const { siteConfig } = await import("@/lib/config/site");

    expect(siteConfig.contactEmail).toBe("");
    expect(siteConfig.contactPhone).toBeUndefined();
    expect(siteConfig.contactPhoneHref).toBeUndefined();
    expect(siteConfig.whatsappHref).toBeUndefined();
  });

  it("builds a tel: href and WhatsApp link only when a phone number is configured", async () => {
    process.env.NEXT_PUBLIC_CONTACT_PHONE = "+15551234567";
    process.env.NEXT_PUBLIC_OWNER_NAME = "Test Owner";
    const { siteConfig } = await import("@/lib/config/site");

    expect(siteConfig.contactPhoneHref).toBe("tel:+15551234567");
    expect(siteConfig.whatsappHref).toContain("https://wa.me/15551234567");
  });

  it("getContactRecipientEmail reads only from the server-only env var, never a literal fallback", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    const { getContactRecipientEmail } = await import("@/lib/config/site");
    expect(getContactRecipientEmail()).toBeUndefined();
  });
});
