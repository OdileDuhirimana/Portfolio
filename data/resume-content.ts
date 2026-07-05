import resumeContent from "./resume-content.json";

/**
 * Single source of truth for work-experience and education content.
 *
 * WHY this exists: an audit found `app/about/page.tsx` hardcoding its own
 * copy of the "Experience" section while `resume.md` (rendered to the
 * downloadable CV) carried an independently-edited copy of the same
 * information. The two had already drifted — different job titles, missing
 * roles, mismatched dates — within a single change. Duplicated prose with
 * no shared source will always eventually disagree; there is no way to
 * enforce consistency by convention alone.
 *
 * The fix: this data lives once, in `resume-content.json` (plain JSON, not
 * TypeScript) so it can be consumed by two completely different runtimes —
 * the Next.js app (via this typed wrapper) and the plain Node.js resume
 * generation script (`scripts/generate-resume.mjs`), which cannot import
 * `.ts`/`.tsx` modules without a build step. `data/__tests__/resume-content.test.ts`
 * enforces that `app/about/page.tsx` never reintroduces a hardcoded copy of
 * this data as a literal string.
 */

export type ExperienceEntry = {
  title: string;
  company: string;
  period: string;
  bullets: string[];
};

export type EducationEntry = {
  institution: string;
  program: string;
  period: string;
};

type ResumeContent = {
  experience: ExperienceEntry[];
  education: EducationEntry[];
};

const content = resumeContent as ResumeContent;

export const experience: ExperienceEntry[] = content.experience;
export const education: EducationEntry[] = content.education;
