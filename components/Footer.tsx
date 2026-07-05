import { siteConfig } from "@/lib/config/site";

export default function Footer() {
  const { ownerName, contactEmail, contactPhoneHref, whatsappHref, social } = siteConfig;

  return (
    <footer className="mt-14 border-t border-(--line)">
      <div className="container mx-auto px-6 md:px-8 py-8 text-sm text-(--muted) flex flex-wrap items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {ownerName}</p>
        <div className="flex flex-wrap items-center gap-4">
          {social.github && (
            <a href={social.github} target="_blank" rel="noreferrer">GitHub</a>
          )}
          {social.twitter && (
            <a href={social.twitter} target="_blank" rel="noreferrer">X</a>
          )}
          {contactEmail && <a href={`mailto:${contactEmail}`}>Email</a>}
          {whatsappHref && (
            <a href={whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
          )}
          {social.instagram && (
            <a href={social.instagram} target="_blank" rel="noreferrer">Instagram</a>
          )}
          {contactPhoneHref && <a href={contactPhoneHref}>Call</a>}
          <a href="/privacy">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
