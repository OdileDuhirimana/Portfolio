import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { education, experience } from "@/data/resume-content";

/**
 * Guardrail against the exact drift bug a prior audit found: `app/about/page.tsx`
 * hardcoding its own copy of experience/education content that then silently
 * diverged from `resume.md`. Mirrors `lib/config/__tests__/site.test.ts`'s
 * pattern of asserting "no hardcoded literal" rather than only testing the
 * data module in isolation — the risk isn't in `resume-content.ts`, it's in
 * whether some other file re-hardcodes a copy of what it exports.
 *
 * This reads `app/about/page.tsx` as raw source text (not its rendered
 * output) so it catches the literal-string case even if the hardcoded copy
 * happened to render identical text on the page.
 */
describe("resume/experience content single-source-of-truth guardrail", () => {
  const aboutPageSource = readFileSync(
    path.join(process.cwd(), "app/about/page.tsx"),
    "utf-8",
  );

  it("imports experience and education from the shared data module", () => {
    expect(aboutPageSource).toMatch(/from ["']@\/data\/resume-content["']/);
  });

  it("does not hardcode any experience entry's title, company, period, or bullets as a literal string", () => {
    for (const role of experience) {
      expect(aboutPageSource).not.toContain(role.period);
      for (const bullet of role.bullets) {
        expect(aboutPageSource).not.toContain(bullet);
      }
    }
  });

  it("does not hardcode any education entry's institution/program/period as a literal string", () => {
    for (const entry of education) {
      expect(aboutPageSource).not.toContain(entry.institution);
      expect(aboutPageSource).not.toContain(entry.period);
    }
  });

  it("has at least one experience entry and one education entry to guard against an accidentally emptied data file", () => {
    expect(experience.length).toBeGreaterThan(0);
    expect(education.length).toBeGreaterThan(0);
  });
});
