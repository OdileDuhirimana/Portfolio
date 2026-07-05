#!/usr/bin/env node
/**
 * Generates `resume.md` (gitignored, local-only) from `resume.template.md`
 * plus environment variables, mirroring the env-driven pattern already
 * established in `lib/config/site.ts` for the rest of the site's contact
 * info.
 *
 * WHY this exists: an audit found `resume.md` tracked in git with a real
 * name, phone number, email, and social handles hardcoded as literal text —
 * the exact class of problem `lib/config/site.ts` was built to prevent for
 * the rest of the app, just not yet applied to this file. `resume.md` feeds
 * `public/cv.pdf` (via a manual `pandoc` conversion step; see README), so it
 * counts as content that "informs site output" even though it isn't part of
 * the Next.js build.
 *
 * The fix: `resume.template.md` (tracked, contains only placeholders and
 * non-personal content) is the checked-in source of truth. Running this
 * script reads local environment variables (the same ones `.env`/`.env.local`
 * already define for the rest of the site) and `data/resume-content.json`
 * (the same experience/education data `app/about/page.tsx` renders — see
 * `data/resume-content.ts` for why that's a separate shared module) and
 * writes the real `resume.md` locally. `resume.md` is gitignored: it is a
 * *generated* artifact now, the same way `.next/` or `node_modules` are,
 * and is never committed with real contact details again.
 *
 * Usage:
 *   npm run resume:generate
 *
 * No dependency is added for env-file parsing (`dotenv` etc.) — this file
 * implements the handful of lines needed itself, since Node has no built-in
 * multi-file env loader compatible with Node 20 (the project's stated
 * minimum) without a CLI flag per file.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/**
 * Minimal `.env`-style parser: KEY=VALUE per line, `#` comments, blank lines
 * ignored, optional surrounding quotes stripped. Deliberately not a general
 * purpose dotenv implementation — just enough for this project's flat,
 * unquoted-value `.env` files.
 */
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};
  const values = {};
  for (const rawLine of readFileSync(filePath, "utf-8").split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

/**
 * Precedence: real process/CI environment variables win over `.env.local`,
 * which wins over `.env` — matching Next.js's own env-loading precedence, so
 * this script behaves the way developers already expect from `npm run dev`.
 */
function loadEnv() {
  const fromDotEnv = parseEnvFile(path.join(ROOT, ".env"));
  const fromDotEnvLocal = parseEnvFile(path.join(ROOT, ".env.local"));
  return { ...fromDotEnv, ...fromDotEnvLocal, ...process.env };
}

function normalize(value) {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildSocialLinks(env) {
  const links = [
    { label: "GitHub", href: normalize(env.NEXT_PUBLIC_GITHUB_URL) },
    { label: "GitLab", href: normalize(env.NEXT_PUBLIC_GITLAB_URL) },
    { label: "LinkedIn", href: normalize(env.NEXT_PUBLIC_LINKEDIN_URL) },
    { label: "X", href: normalize(env.NEXT_PUBLIC_TWITTER_URL) },
  ].filter((link) => link.href);

  if (links.length === 0) {
    return '<li><em>No social links configured — set NEXT_PUBLIC_GITHUB_URL / _GITLAB_URL / _LINKEDIN_URL / _TWITTER_URL in .env.local.</em></li>';
  }

  return links
    .map((link) => {
      const display = link.href.replace(/^https?:\/\//, "").replace(/\/$/, "");
      return `<li>${link.label}: <a href="${link.href}">${escapeHtml(display)}</a></li>`;
    })
    .join("\n");
}

function buildExperienceSection(experience) {
  return experience
    .map((role) => {
      const bullets = role.bullets.map((bullet) => `    <li>${escapeHtml(bullet)}</li>`).join("\n");
      return [
        '<div class="item">',
        `  <div class="item__title">${escapeHtml(role.title)} — ${escapeHtml(role.company)}</div>`,
        `  <div class="item__meta">${escapeHtml(role.period)}</div>`,
        "  <ul>",
        bullets,
        "  </ul>",
        "</div>",
      ].join("\n");
    })
    .join("\n");
}

function buildEducationSection(education) {
  return education
    .map(
      (entry) =>
        `  <li>${escapeHtml(entry.institution)} — ${escapeHtml(entry.program)} | ${escapeHtml(entry.period)}</li>`,
    )
    .join("\n");
}

function main() {
  const env = loadEnv();
  const resumeContent = JSON.parse(
    readFileSync(path.join(ROOT, "data", "resume-content.json"), "utf-8"),
  );
  const template = readFileSync(path.join(ROOT, "resume.template.md"), "utf-8");

  const ownerName = normalize(env.NEXT_PUBLIC_OWNER_NAME) ?? "Your Name";
  const ownerRole = normalize(env.NEXT_PUBLIC_OWNER_ROLE) ?? "Software Engineer";
  const location = normalize(env.NEXT_PUBLIC_OWNER_LOCATION);
  const phone = normalize(env.NEXT_PUBLIC_CONTACT_PHONE);
  const email = normalize(env.NEXT_PUBLIC_CONTACT_EMAIL);
  const metaParts = [location, phone, email].filter(Boolean);
  const ownerMeta = metaParts.length > 0
    ? metaParts.join(" · ")
    : "Set NEXT_PUBLIC_OWNER_LOCATION / _CONTACT_PHONE / _CONTACT_EMAIL in .env.local";

  const output = template
    .replaceAll("{{OWNER_NAME}}", escapeHtml(ownerName))
    .replaceAll("{{OWNER_ROLE}}", escapeHtml(ownerRole))
    .replaceAll("{{OWNER_META}}", escapeHtml(ownerMeta))
    .replaceAll("{{SOCIAL_LINKS}}", buildSocialLinks(env))
    .replaceAll("{{EXPERIENCE_SECTION}}", buildExperienceSection(resumeContent.experience))
    .replaceAll("{{EDUCATION_SECTION}}", buildEducationSection(resumeContent.education));

  const outputPath = path.join(ROOT, "resume.md");
  writeFileSync(outputPath, output, "utf-8");

  const missing = [];
  if (!normalize(env.NEXT_PUBLIC_OWNER_NAME)) missing.push("NEXT_PUBLIC_OWNER_NAME");
  if (!phone) missing.push("NEXT_PUBLIC_CONTACT_PHONE");
  if (!email) missing.push("NEXT_PUBLIC_CONTACT_EMAIL");

  console.log(`Generated resume.md from resume.template.md (${outputPath}).`);
  if (missing.length > 0) {
    console.warn(
      `Note: ${missing.join(", ")} not set — resume.md contains placeholder text for those fields. Set them in .env.local and re-run "npm run resume:generate".`,
    );
  }
}

main();
