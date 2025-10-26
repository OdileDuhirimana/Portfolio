export const metadata = {
  title: "Resume — Odile Duhirimana",
  description: "Download Odile Duhirimana’s CV as a PDF.",
};

export default function ResumePage() {
  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">Resume</h1>
      <p className="mt-3 text-(--muted)">Download a PDF copy of my CV.</p>
      <div className="mt-6 flex items-center gap-3">
        <a href="/Odile_Duhirimana_CV.pdf" className="rounded-xl bg-(--gold) text-black px-5 py-3 font-medium">Download CV</a>
        <a href="/Odile_Duhirimana_CV.pdf" target="_blank" rel="noreferrer" className="rounded-xl border px-5 py-3">Open in Browser</a>
      </div>
    </main>
  );
}
