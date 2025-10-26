export const metadata = {
  title: "Imprint — Odile Duhirimana",
  description: "Legal imprint for Odile Duhirimana’s portfolio website.",
};

export default function ImprintPage() {
  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">Imprint</h1>
      <div className="mt-4 space-y-2 text-(--muted)">
        <p><span className="text-foreground">Owner:</span> Odile Duhirimana</p>
        <p><span className="text-foreground">Contact:</span> Use the contact form or LinkedIn/GitHub links</p>
        <p><span className="text-foreground">Purpose:</span> Personal portfolio showcasing software engineering work</p>
      </div>
    </main>
  );
}
