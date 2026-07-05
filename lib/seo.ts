import type { Metadata } from "next";
import { siteConfig } from "@/lib/config/site";

/**
 * Single source of truth for site-wide SEO metadata.
 *
 * WHY: a prior audit found the site's title/description/OG tags defined
 * independently in `app/layout.tsx` AND in this file, with this file never
 * actually imported anywhere — dead code that could silently drift from the
 * real metadata. `buildPageMetadata` is now the one function every route
 * uses to construct its `Metadata` export, so a title/description change
 * only has to happen in one place (or is driven by `siteConfig`).
 */

const DEFAULT_TITLE = `${siteConfig.ownerName} — Secure Backend & AI Engineer`;
const DEFAULT_DESCRIPTION =
  "Mid-level full-stack engineer specialising in secure backend systems, AI/ML, and cloud-native APIs. 13+ production projects across Java, Python, Node.js, React, and Flutter.";

export function buildPageMetadata(overrides: Partial<Pick<Metadata, "title" | "description">> = {}): Metadata {
  const title = (overrides.title as string) ?? DEFAULT_TITLE;
  const description = (overrides.description as string) ?? DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.siteUrl),
    openGraph: {
      type: "website",
      title,
      description,
      siteName: `${siteConfig.ownerName} Portfolio`,
      url: siteConfig.siteUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.siteUrl).toString();
}

export function pageTitle(segment: string): string {
  return `${segment} — ${siteConfig.ownerName}`;
}
