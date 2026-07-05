/**
 * Single source of truth for site-wide identity and contact configuration.
 *
 * WHY this exists: a prior audit found the owner's personal email address and
 * phone number hardcoded as literals across multiple components (Footer,
 * ContactPageClient, AboutPage, and as a fallback inside the /api/contact
 * route). That made the values impossible to change in one place, and worse,
 * committed real personal contact details directly into git history.
 *
 * Rule going forward: no component or route may hardcode a contact literal.
 * Every reference must flow through this module, which itself only reads
 * from environment variables. Nothing here is a secret — email and phone are
 * intentionally public-facing contact info for a portfolio site — but they
 * must still be configurable per-deployment rather than baked into source.
 *
 * `NEXT_PUBLIC_*` variables are safe to expose to the browser (the whole
 * point is that visitors can see how to reach the site owner). Do not add
 * anything sensitive (API keys, tokens) to this file.
 */

export type SocialLinks = {
  github?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  whatsapp?: string;
};

export type SiteConfig = {
  ownerName: string;
  contactEmail: string;
  /** E.164-ish display phone number, or undefined if not configured. */
  contactPhone?: string;
  /** Pre-computed `tel:` href, or undefined if no phone is configured. */
  contactPhoneHref?: string;
  /** Pre-computed `wa.me` link with a friendly default message, or undefined. */
  whatsappHref?: string;
  social: SocialLinks;
  siteUrl: string;
};

/**
 * IMPORTANT: Next.js only inlines `NEXT_PUBLIC_*` variables into the client
 * bundle when they're accessed via static dot notation at the call site
 * (`process.env.NEXT_PUBLIC_X`). A dynamic/bracket lookup like
 * `process.env[name]` cannot be statically analyzed by the compiler, so it
 * silently resolves to `undefined` in the browser even though the same code
 * works correctly on the server (which has a real `process.env`). This
 * previously caused a server/client hydration mismatch: the server rendered
 * the real owner name while the client silently fell back to the default.
 * Each variable is therefore read individually through its own literal
 * `process.env.NEXT_PUBLIC_*` access below — do not refactor this into a
 * generic helper that takes the variable name as a parameter.
 */
function normalize(value: string | undefined): string | undefined {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function buildWhatsAppHref(phone: string | undefined, ownerName: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d]/g, "");
  if (!digits) return undefined;
  const message = `Hi ${ownerName}, I saw your portfolio and would like to connect.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

const ownerName = normalize(process.env.NEXT_PUBLIC_OWNER_NAME) ?? "Portfolio Owner";
const contactEmail = normalize(process.env.NEXT_PUBLIC_CONTACT_EMAIL) ?? "";
const contactPhone = normalize(process.env.NEXT_PUBLIC_CONTACT_PHONE);
const siteUrl = normalize(process.env.NEXT_PUBLIC_SITE_URL) ?? "http://localhost:3000";

export const siteConfig: SiteConfig = {
  ownerName,
  contactEmail,
  contactPhone,
  contactPhoneHref: contactPhone ? `tel:${contactPhone.replace(/[^\d+]/g, "")}` : undefined,
  whatsappHref: buildWhatsAppHref(contactPhone, ownerName),
  social: {
    github: normalize(process.env.NEXT_PUBLIC_GITHUB_URL),
    twitter: normalize(process.env.NEXT_PUBLIC_TWITTER_URL),
    instagram: normalize(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    linkedin: normalize(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  },
  siteUrl,
};

/**
 * Server-only recipient email for the contact form's outbound message.
 * Deliberately NOT prefixed with NEXT_PUBLIC_ — this is the delivery target
 * used by the API route only, never rendered to the client, and must never
 * fall back to a hardcoded personal address.
 */
export function getContactRecipientEmail(): string | undefined {
  return process.env.CONTACT_TO_EMAIL?.trim() || undefined;
}
