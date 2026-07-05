import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("seo", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("buildPageMetadata", () => {
    it("returns default title and description derived from siteConfig.ownerName when no overrides are given", async () => {
      process.env.NEXT_PUBLIC_OWNER_NAME = "Test Owner";
      const { siteConfig } = await import("@/lib/config/site");
      const { buildPageMetadata } = await import("@/lib/seo");

      const metadata = buildPageMetadata();

      expect(typeof metadata.title).toBe("string");
      expect(metadata.title as string).toContain(siteConfig.ownerName);
      expect(typeof metadata.description).toBe("string");
      expect((metadata.description as string).length).toBeGreaterThan(0);
    });

    it("uses the overridden title and description everywhere they are propagated instead of the defaults", async () => {
      process.env.NEXT_PUBLIC_OWNER_NAME = "Test Owner";
      const { buildPageMetadata } = await import("@/lib/seo");

      const metadata = buildPageMetadata({
        title: "Custom Title",
        description: "Custom description",
      });

      expect(metadata.title).toBe("Custom Title");
      expect(metadata.description).toBe("Custom description");
      expect(metadata.openGraph?.title).toBe("Custom Title");
      expect(metadata.openGraph?.description).toBe("Custom description");
      expect(metadata.twitter?.title).toBe("Custom Title");
      expect(metadata.twitter?.description).toBe("Custom description");
    });

    it("sets metadataBase to a URL instance matching siteConfig.siteUrl", async () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.dev";
      const { siteConfig } = await import("@/lib/config/site");
      const { buildPageMetadata } = await import("@/lib/seo");

      const metadata = buildPageMetadata();

      expect(metadata.metadataBase).toBeInstanceOf(URL);
      expect((metadata.metadataBase as URL).toString()).toBe(new URL(siteConfig.siteUrl).toString());
    });
  });

  describe("absoluteUrl", () => {
    it("joins a leading-slash path onto the site URL", async () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.dev";
      const { siteConfig } = await import("@/lib/config/site");
      const { absoluteUrl } = await import("@/lib/seo");

      expect(absoluteUrl("/projects")).toBe(`${siteConfig.siteUrl}/projects`);
    });

    it("joins a path without a leading slash the same way, per URL resolution semantics", async () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.dev";
      const { siteConfig } = await import("@/lib/config/site");
      const { absoluteUrl } = await import("@/lib/seo");

      expect(absoluteUrl("projects")).toBe(`${siteConfig.siteUrl}/projects`);
    });

    it("resolves to the site root when called with no argument", async () => {
      process.env.NEXT_PUBLIC_SITE_URL = "https://example.dev";
      const { siteConfig } = await import("@/lib/config/site");
      const { absoluteUrl } = await import("@/lib/seo");

      expect(absoluteUrl()).toBe(`${siteConfig.siteUrl}/`);
    });
  });

  describe("pageTitle", () => {
    it("returns the segment combined with siteConfig.ownerName in an em-dash template", async () => {
      process.env.NEXT_PUBLIC_OWNER_NAME = "Test Owner";
      const { siteConfig } = await import("@/lib/config/site");
      const { pageTitle } = await import("@/lib/seo");

      expect(pageTitle("Resume")).toBe(`Resume — ${siteConfig.ownerName}`);
    });
  });
});
