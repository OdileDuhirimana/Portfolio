export const metadata = {
  title: "About — Odile Duhirimana",
  description: "Bio, skills, and Queenpin Stats highlighting impact and expertise.",
};

import { skills } from "@/data/skills";

export default function AboutPage() {
  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">About</h1>
      <p className="mt-3 text-(--muted) max-w-3xl">
        I build secure backend systems and AI-powered applications. My focus is reliability, security, and measurable impact — from banking backends to ML services.
      </p>
      <p className="mt-1 text-sm text-(--muted)">Based in Rwanda</p>

      <section className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-5">
          <h2 className="text-lg font-semibold">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li><span className="text-(--muted)">Phone:</span> <a href="tel:+250798980237" className="underline decoration-dotted">+250 798 980 237</a></li>
            <li><span className="text-(--muted)">Email:</span> <a href="mailto:odileduhirimana@gmail.com" className="underline decoration-dotted">odileduhirimana@gmail.com</a></li>
            <li><span className="text-(--muted)">GitHub:</span> <a href="https://github.com/OdileDuhirimana" target="_blank" rel="noreferrer" className="underline decoration-dotted">OdileDuhirimana</a></li>
            <li><span className="text-(--muted)">X:</span> <a href="https://twitter.com/duhirimanaOdile" target="_blank" rel="noreferrer" className="underline decoration-dotted">@duhirimanaOdile</a></li>
            <li><span className="text-(--muted)">Instagram:</span> <a href="https://www.instagram.com/sky_lla320/" target="_blank" rel="noreferrer" className="underline decoration-dotted">sky_lla320</a></li>
          </ul>
        </div>
        <div className="md:col-span-2 rounded-2xl border border-(--line) bg-(--panel) p-5">
          <h2 className="text-lg font-semibold">Experience</h2>
          <ul className="mt-3 list-disc pl-5 space-y-2 text-(--text)/90">
            <li>
              <span className="font-medium">Mobile Developer & Data Analytics Intern</span> — eFiche Company <span className="text-(--muted)">| Current</span>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                <li>Developed and optimized mobile features, improving app performance and user experience.</li>
                <li>Analyzed user and system data to support strategic and operational decisions.</li>
                <li>Contributed to sprint planning and Agile workflows.</li>
                <li>Strengthened collaboration skills in a professional engineering environment.</li>
              </ul>
            </li>
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
            <li>
              <span className="font-medium">Rwanda Coding Academy</span> — Software Programming & Embedded Systems <span className="text-(--muted)">| 2022 – 2025</span>
            </li>
            <li>
              <span className="font-medium">Lycée Notre Dame de Citéaux</span> — O’Level <span className="text-(--muted)">| 2019 – 2021</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Queenpin Stats</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6 text-center">
            <div className="text-3xl font-semibold text-(--gold)">99.9%</div>
            <div className="text-(--muted)">Uptime on core systems</div>
          </div>
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6 text-center">
            <div className="text-3xl font-semibold text-(--gold)">120ms</div>
            <div className="text-(--muted)">Avg API latency</div>
          </div>
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6 text-center">
            <div className="text-3xl font-semibold text-(--gold)">10+ </div>
            <div className="text-(--muted)">Production projects</div>
          </div>
        </div>
      </section>
    </main>
  );
}
