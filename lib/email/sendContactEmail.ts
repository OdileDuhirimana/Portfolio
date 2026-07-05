import { siteConfig } from "@/lib/config/site";
import { EMAIL_THEME } from "@/lib/email/emailTheme";

/**
 * Thin abstraction over the outbound email provider.
 *
 * WHY: the contact route handler previously inlined the Resend HTTP call,
 * HTML templating, and escaping directly in the route function — meaning the
 * route was tightly coupled to one specific provider's API shape and could
 * not be unit-tested without mocking global `fetch` inline in a test file
 * that also had to know about HTTP status parsing. Extracting this function
 * gives the route a narrow seam: call `sendContactEmail(...)`, get back a
 * discriminated result. Swapping providers, or injecting a fake for tests,
 * only requires changing/mocking this one function.
 */

export type ContactEmailInput = {
  name: string;
  email: string;
  message: string;
};

export type SendEmailResult =
  | { ok: true }
  | { ok: false; reason: "provider_error" | "network_error"; details: string };

export type EmailProviderConfig = {
  apiKey: string;
  fromEmail: string;
  toEmail: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildEmailHtml(input: ContactEmailInput, submittedAt: string): string {
  const safeName = escapeHtml(input.name);
  const safeEmail = escapeHtml(input.email);
  const safeMessage = escapeHtml(input.message).replace(/\n/g, "<br/>");
  const replyHref = `mailto:${encodeURIComponent(input.email)}`;
  const brandLabel = escapeHtml(`${siteConfig.ownerName.toUpperCase()} PORTFOLIO`);

  return `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      New portfolio inquiry from ${safeName}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${EMAIL_THEME.background};margin:0;padding:24px 12px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:${EMAIL_THEME.text};">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:${EMAIL_THEME.panel};border:1px solid ${EMAIL_THEME.line};border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;background:radial-gradient(circle at top left, rgba(212,175,55,0.15), rgba(17,18,24,1) 55%);border-bottom:1px solid ${EMAIL_THEME.line};">
                <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:${EMAIL_THEME.gold};font-weight:700;">${brandLabel}</div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;font-weight:700;color:${EMAIL_THEME.text};">New Contact Inquiry</h1>
                <p style="margin:8px 0 0;color:${EMAIL_THEME.muted};font-size:14px;line-height:1.6;">A new message was submitted through your portfolio contact form.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="width:120px;color:${EMAIL_THEME.muted};font-size:13px;">Name</td>
                    <td style="color:${EMAIL_THEME.text};font-size:14px;font-weight:600;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="color:${EMAIL_THEME.muted};font-size:13px;">Email</td>
                    <td style="color:${EMAIL_THEME.text};font-size:14px;"><a href="${replyHref}" style="color:${EMAIL_THEME.gold};text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="color:${EMAIL_THEME.muted};font-size:13px;">Submitted</td>
                    <td style="color:${EMAIL_THEME.text};font-size:14px;">${submittedAt}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;">
                <div style="border:1px solid ${EMAIL_THEME.line};background:${EMAIL_THEME.background};border-radius:14px;padding:18px;">
                  <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${EMAIL_THEME.muted};margin-bottom:10px;">Message</div>
                  <p style="margin:0;color:${EMAIL_THEME.text};font-size:14px;line-height:1.7;white-space:normal;">${safeMessage}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 26px;">
                <a href="${replyHref}" style="display:inline-block;background:${EMAIL_THEME.gold};color:${EMAIL_THEME.goldOnDark};text-decoration:none;font-weight:700;font-size:13px;padding:11px 16px;border-radius:10px;">
                  Reply to ${safeName}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}

export async function sendContactEmail(
  input: ContactEmailInput,
  config: EmailProviderConfig,
): Promise<SendEmailResult> {
  const submittedAt = new Date().toISOString();
  const subject = `Portfolio Contact: ${input.name}`;
  const text = `Name: ${input.name}\nEmail: ${input.email}\n\nMessage:\n${input.message}`;
  const html = buildEmailHtml(input, submittedAt);

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.fromEmail,
        to: [config.toEmail],
        reply_to: input.email,
        subject,
        text,
        html,
      }),
    });
  } catch (networkError) {
    const details = networkError instanceof Error ? networkError.message : "Unknown network error";
    return { ok: false, reason: "network_error", details };
  }

  if (!response.ok) {
    const details = await response.text().catch(() => "Unknown provider error");
    return { ok: false, reason: "provider_error", details };
  }

  return { ok: true };
}
