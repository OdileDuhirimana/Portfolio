import type { NextConfig } from "next";

/**
 * Content-Security-Policy tuned to what this app actually loads:
 * - next/font/google self-hosts font files at build time, so no runtime
 *   connection to Google's font CDN is needed.
 * - react-qr-code renders an inline SVG, no external requests.
 * - @vercel/analytics sends a beacon to Vercel's collector domain.
 * `unsafe-inline` is required for Next.js's inline hydration/bootstrap
 * script and Tailwind's runtime style injection; there is no user-supplied
 * content ever rendered as a `<script>` tag in this codebase (grep confirms
 * zero `dangerouslySetInnerHTML` usage), so the residual XSS risk from
 * `unsafe-inline` here is low relative to the complexity of wiring up
 * nonces for a fully static site.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // The Playwright E2E suite (playwright.config.ts) drives the dev server
  // via http://127.0.0.1:3000 while Next's dev server itself listens on
  // localhost — without this, Next 16 logs a cross-origin dev warning for
  // every asset request during `npm run test:e2e` (harmless today, but
  // slated to become a hard error in a future Next major version).
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
        ],
      },
    ];
  },
};

export default nextConfig;
