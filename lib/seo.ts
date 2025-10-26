const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const defaultSEO = {
  title: "Odile Duhirimana — Secure Backend & AI Engineer",
  description: "Portfolio showcasing backend, AI/ML, and full-stack projects.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Odile Duhirimana",
  },
  twitter: {
    cardType: "summary_large_image",
  },
};

export const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();
