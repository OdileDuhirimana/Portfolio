import { expect, test } from "@playwright/test";

/**
 * Happy-path E2E coverage for the contact form (closes TEST-03 from the
 * last audit — no browser-driven test existed for this site's one real
 * user-facing mutation flow).
 *
 * The outbound `/api/contact` call is intercepted rather than hitting a
 * real Resend account: this test's job is to verify the real page renders,
 * the real client-side validation/submit wiring in `ContactForm.tsx` works
 * end-to-end in an actual browser, and the success state renders correctly
 * — not to re-verify Resend's API, which `lib/email/__tests__/sendContactEmail.test.ts`
 * already covers with a mocked `fetch` at the unit level. Mocking at the
 * network boundary here mirrors that same testing philosophy one layer up.
 */
test.describe("Contact form", () => {
  test("fills out and submits the contact form successfully", async ({ page }) => {
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, data: {} }),
      });
    });

    await page.goto("/contact");

    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane.doe@example.com");
    await page.getByLabel("Message").fill("Hello, I would like to get in touch about a role.");

    await page.getByRole("button", { name: /send/i }).click();

    // ContactForm.tsx renders the same success text twice: once visibly (a
    // <p>) and once in a visually-hidden aria-live region for screen
    // readers. Scope to the visible paragraph to avoid a strict-mode
    // ambiguous-match failure, and separately assert the live region kept
    // pace (real assistive-tech users rely on that announcement firing).
    await expect(page.locator("p.text-\\(--success\\)")).toHaveText(/message sent successfully/i);
    await expect(page.locator('[aria-live="polite"]')).toHaveText(/message sent successfully/i);
    await expect(page.getByLabel("Name")).toHaveValue("");
  });
});
