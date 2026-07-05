import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E configuration.
 *
 * WHY this exists: an audit found `vitest.config.ts` excluding an `e2e/**`
 * path that didn't exist — an intended-but-unbuilt test layer. The Vitest
 * suite (component + integration tests with mocked `fetch`) proves the
 * contact form's logic is correct in isolation; it never drives a real
 * browser against a real running Next.js server the way an actual visitor
 * would. This config adds exactly that for the one user journey that
 * matters most on this site: submitting the contact form.
 *
 * Scope: a single project (Chromium) is enough to prove the happy path
 * works end-to-end. This is a personal portfolio site's E2E safety net, not
 * a cross-browser compatibility suite — expanding to Firefox/WebKit is a
 * cheap follow-up if this ever needs it, not a gap in this pass.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SITE_URL: "http://127.0.0.1:3000",
    },
  },
});
