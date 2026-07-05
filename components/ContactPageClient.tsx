"use client";
import ContactForm from "@/components/ContactForm";
import { siteConfig } from "@/lib/config/site";
import { Github, Instagram, MessageCircle, Twitter, Mail, Phone } from "lucide-react";

const linkClass =
  "inline-flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 ring-(--focus)";

export default function ContactPageClient() {
  const { contactEmail, contactPhone, contactPhoneHref, whatsappHref, social } = siteConfig;
  const hasAnyConnectLink = Boolean(
    social.github || whatsappHref || social.twitter || contactEmail || social.instagram || contactPhoneHref,
  );

  return (
    <main id="main-content" className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">Contact</h1>
      <p className="mt-2 text-(--muted)">Send me a message and I will get back to you.</p>

      <div className="mt-6 grid gap-8 md:grid-cols-2 items-start">
        <div>
          <ContactForm />
        </div>
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-6 overflow-hidden max-w-full">
          <h2 className="font-semibold mb-3">Connect</h2>
          {hasAnyConnectLink ? (
            <div className="flex flex-wrap gap-3">
              {social.github && (
                <a href={social.github} target="_blank" rel="noreferrer" className={linkClass}>
                  <Github className="w-4 h-4" aria-hidden="true" /> GitHub
                </a>
              )}
              {whatsappHref && (
                <a href={whatsappHref} target="_blank" rel="noreferrer" className={linkClass}>
                  <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp
                </a>
              )}
              {social.twitter && (
                <a href={social.twitter} target="_blank" rel="noreferrer" className={linkClass}>
                  <Twitter className="w-4 h-4" aria-hidden="true" /> X
                </a>
              )}
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className={linkClass}>
                  <Mail className="w-4 h-4" aria-hidden="true" /> Email
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} target="_blank" rel="noreferrer" className={linkClass}>
                  <Instagram className="w-4 h-4" aria-hidden="true" /> Instagram
                </a>
              )}
              {contactPhoneHref && contactPhone && (
                <a href={contactPhoneHref} className={linkClass}>
                  <Phone className="w-4 h-4" aria-hidden="true" /> {contactPhone}
                </a>
              )}
            </div>
          ) : (
            <p className="text-sm text-(--muted)">Use the form to get in touch.</p>
          )}
        </div>
      </div>
    </main>
  );
}
