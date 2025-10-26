export const metadata = {
  title: "Privacy Policy — Odile Duhirimana",
  description: "Privacy policy for Odile Duhirimana’s portfolio website.",
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">Privacy Policy</h1>
      <p className="mt-3 text-(--muted) max-w-3xl">
        This portfolio does not collect personal data beyond standard web server logs and privacy-friendly analytics if enabled.
        Contact submissions are used solely to respond to your inquiry.
      </p>
      <section className="mt-8 space-y-3 text-(--muted)">
        <p>• Analytics: Vercel Analytics (privacy-friendly). No personal identifiers are stored.</p>
        <p>• Contact: Messages you send are used only for communication and are not shared.</p>
        <p>• Cookies: Minimal cookies may be used for performance and security.</p>
      </section>
    </main>
  );
}
