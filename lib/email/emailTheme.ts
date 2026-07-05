/**
 * Named color constants for the outbound contact-form notification email.
 *
 * WHY this exists: an audit found `sendContactEmail.ts`'s inline HTML
 * template hardcoding the site's brand palette as raw hex literals
 * (`#0B0B10`, `#D4AF37`, etc.), duplicating the values already defined once
 * as the frozen CSS custom properties in `app/globals.css`. That's exactly
 * the "magic value" pattern this codebase otherwise avoids everywhere else
 * (CODE-07 in the last audit confirmed zero raw hex literals in components).
 *
 * This file does NOT import from `app/globals.css` or read a CSS custom
 * property at runtime: email clients (Gmail, Outlook, Apple Mail) strip
 * `<style>` blocks and CSS variables from HTML email bodies in most
 * contexts, so every color in an email template must be a literal, inlined
 * value — there is no way around that for email HTML specifically. What
 * this file DOES fix is having exactly one place those literals live,
 * instead of nine scattered inline occurrences that would each need to be
 * found and edited individually if the brand palette ever changes.
 *
 * These values intentionally match `--bg`, `--panel`, `--text`, `--muted`,
 * `--gold`, and `--line` from `app/globals.css` (which is a FROZEN color
 * schema per this project's conventions — see CLAUDE.md). If that schema
 * ever changes, update both files together.
 */
export const EMAIL_THEME = {
  background: "#0B0B10",
  panel: "#111218",
  text: "#EDEDF1",
  muted: "#A7A7B2",
  gold: "#D4AF37",
  goldOnDark: "#0B0B10",
  line: "#1B1C24",
} as const;
