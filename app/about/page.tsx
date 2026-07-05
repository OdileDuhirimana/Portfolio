import { skills } from "@/data/skills";
import { education, experience } from "@/data/resume-content";
import { siteConfig } from "@/lib/config/site";

export const metadata = {
  title: `About — ${siteConfig.ownerName}`,
  description: "Bio, skills, and Queenpin Stats highlighting impact and expertise.",
};

export default function AboutPage() {
  const { contactEmail, contactPhone, contactPhoneHref, social } = siteConfig;

  return (
    <main id="main-content" className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">About</h1>
      <p className="mt-3 text-(--muted) max-w-3xl">
        I build secure backend systems and AI-powered applications. My focus is reliability, security, and measurable impact — from banking backends to ML services.
      </p>
      <p className="mt-1 text-sm text-(--muted)">Based in Rwanda</p>

      <section className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-5">
          <h2 className="text-lg font-semibold">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {contactPhoneHref && contactPhone && (
              <li><span className="text-(--muted)">Phone:</span> <a href={contactPhoneHref} className="underline decoration-dotted">{contactPhone}</a></li>
            )}
            {contactEmail && (
              <li><span className="text-(--muted)">Email:</span> <a href={`mailto:${contactEmail}`} className="underline decoration-dotted">{contactEmail}</a></li>
            )}
            {social.github && (
              <li><span className="text-(--muted)">GitHub:</span> <a href={social.github} target="_blank" rel="noreferrer" className="underline decoration-dotted">{social.github.replace("https://github.com/", "")}</a></li>
            )}
            {social.twitter && (
              <li><span className="text-(--muted)">X:</span> <a href={social.twitter} target="_blank" rel="noreferrer" className="underline decoration-dotted">{social.twitter.replace("https://twitter.com/", "@")}</a></li>
            )}
            {social.instagram && (
              <li><span className="text-(--muted)">Instagram:</span> <a href={social.instagram} target="_blank" rel="noreferrer" className="underline decoration-dotted">{social.instagram.replace(/^https:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "")}</a></li>
            )}
          </ul>
        </div>
        <div className="md:col-span-2 rounded-2xl border border-(--line) bg-(--panel) p-5">
          <h2 className="text-lg font-semibold">Experience</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-(--text)/90">
            {experience.map((role) => (
              <li key={`${role.company}-${role.title}-${role.period}`}>
                <span className="font-medium">{role.title}</span> — {role.company}{" "}
                <span className="text-(--muted)">| {role.period}</span>
                <ul className="mt-1 list-disc pl-5 space-y-1">
                  {role.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="rounded-2xl border border-(--line) bg-(--panel) p-5">
              <h3 className="font-medium capitalize text-(--muted)">{group.replace('_', ' ')}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {items.map((s) => (
                  <span key={s} className="inline-flex items-center rounded-lg border border-(--line) px-2.5 py-1 text-xs text-(--text)/90 bg-(--panel)">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-5">
          <ul className="list-disc pl-5 space-y-2 text-(--text)/90">
            {education.map((entry) => (
              <li key={`${entry.institution}-${entry.period}`}>
                <span className="font-medium">{entry.institution}</span> — {entry.program}{" "}
                <span className="text-(--muted)">| {entry.period}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

    </main>
  );
}
