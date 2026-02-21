import { NextResponse } from "next/server";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  honey?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || "odileduhirimana@gmail.com";

function parsePayload(input: unknown): ContactPayload {
  if (!input || typeof input !== "object") return {};
  return input as ContactPayload;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  const payload = parsePayload(await req.json().catch(() => ({})));
  const name = (payload.name || "").trim();
  const email = (payload.email || "").trim();
  const message = (payload.message || "").trim();
  const honey = (payload.honey || "").trim();

  // Honeypot: act successful to avoid helping bots tune attacks.
  if (honey) {
    return NextResponse.json({ ok: true });
  }

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Name is too short." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ ok: false, error: "Message must be at least 10 characters." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!resendApiKey || !fromEmail) {
    return NextResponse.json(
      { ok: false, error: "Email service is not configured on the server." },
      { status: 500 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message);
  const replyHref = `mailto:${encodeURIComponent(email)}`;
  const submittedAt = new Date().toISOString();

  const subject = `Portfolio Contact: ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
  const html = `
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      New portfolio inquiry from ${safeName}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0B0B10;margin:0;padding:24px 12px;font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;color:#EDEDF1;">
      <tr>
        <td align="center">
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#111218;border:1px solid #1B1C24;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:24px 28px;background:radial-gradient(circle at top left, rgba(212,175,55,0.15), rgba(17,18,24,1) 55%);border-bottom:1px solid #1B1C24;">
                <div style="font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#D4AF37;font-weight:700;">ODILE PORTFOLIO</div>
                <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;font-weight:700;color:#EDEDF1;">New Contact Inquiry</h1>
                <p style="margin:8px 0 0;color:#A7A7B2;font-size:14px;line-height:1.6;">A new message was submitted through your portfolio contact form.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0 10px;">
                  <tr>
                    <td style="width:120px;color:#A7A7B2;font-size:13px;">Name</td>
                    <td style="color:#EDEDF1;font-size:14px;font-weight:600;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="color:#A7A7B2;font-size:13px;">Email</td>
                    <td style="color:#EDEDF1;font-size:14px;"><a href="${replyHref}" style="color:#D4AF37;text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="color:#A7A7B2;font-size:13px;">Submitted</td>
                    <td style="color:#EDEDF1;font-size:14px;">${submittedAt}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 24px;">
                <div style="border:1px solid #1B1C24;background:#0B0B10;border-radius:14px;padding:18px;">
                  <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#A7A7B2;margin-bottom:10px;">Message</div>
                  <p style="margin:0;color:#EDEDF1;font-size:14px;line-height:1.7;white-space:normal;">${safeMessage.replace(/\n/g, "<br/>")}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 26px;">
                <a href="${replyHref}" style="display:inline-block;background:#D4AF37;color:#0B0B10;text-decoration:none;font-weight:700;font-size:13px;padding:11px 16px;border-radius:10px;">
                  Reply to ${safeName}
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [TO_EMAIL],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Contact email send failed:", details);
    return NextResponse.json(
      { ok: false, error: "Failed to send message. Please try again later." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
