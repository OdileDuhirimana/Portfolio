export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-(--line) bg-(--panel) p-8 md:p-12">
      <div className="max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-(--gold)">ODILE DUHIRIMANA</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-semibold">
          Software Engineer specializing in Secure Backend Systems & AI
        </h1>
        <p className="mt-4 text-lg text-(--muted)">
          I architect and build secure, resilient platforms where correctness and performance are non‑negotiable—backed by thoughtful design, rigorous testing, and clear operational standards. My work blends modern backend engineering with pragmatic AI to solve real problems at scale, strengthen trust, and accelerate digital transformation across Africa’s growing tech ecosystem. I care about measurable outcomes, elegant simplicity, and software that quietly does the hard work.
        </p>
        <div className="mt-6 flex gap-3">
          <a
            href="/contact"
            className="rounded-xl bg-(--gold) text-black px-5 py-3 font-medium transition shadow-[0_0_0_0_rgba(212,175,55,0.0)] hover:shadow-[0_0_0_6px_rgba(212,175,55,0.25)] focus-visible:ring-2 focus-visible:ring-(--focus)"
          >
            Hire Me
          </a>
          <a
            href="/resume"
            className="rounded-xl border px-5 py-3 transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-(--focus)"
          >
            Download CV
          </a>
        </div>
      </div>
      <div className="absolute right-6 top-6 h-28 w-28 rounded-full border border-(--line) opacity-60" />
    </section>
  );
}
