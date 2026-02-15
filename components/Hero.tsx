export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-(--line) bg-(--panel) p-8 md:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_55%)]" />
      <div className="relative max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-black/30 px-3 py-1 text-xs uppercase tracking-widest text-(--muted)">
          Open to roles • 2026
        </div>
        <p className="mt-4 text-sm uppercase tracking-widest text-(--gold)">ODILE DUHIRIMANA</p>
        <h1 className="mt-2 text-4xl md:text-5xl font-semibold">
          Secure Backend & AI Engineer
        </h1>
        <p className="mt-4 text-lg text-(--muted)">
          I build high‑trust backend systems and pragmatic AI services with measurable impact. Reliability, security, and performance come first.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-widest text-(--muted)">
          <span className="rounded-full border border-(--line) bg-black/30 px-3 py-1">Banking Backends</span>
          <span className="rounded-full border border-(--line) bg-black/30 px-3 py-1">AI/ML Services</span>
          <span className="rounded-full border border-(--line) bg-black/30 px-3 py-1">API Reliability</span>
        </div>
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
      <div className="absolute right-6 top-6 h-28 w-28">
        <div className="hero-mark">
          <div className="hero-mark__core">OD</div>
          <span className="hero-mark__orbit hero-mark__orbit--one">
            <span className="hero-mark__dot" />
          </span>
          <span className="hero-mark__orbit hero-mark__orbit--two">
            <span className="hero-mark__dot" />
          </span>
        </div>
      </div>
    </section>
  );
}
