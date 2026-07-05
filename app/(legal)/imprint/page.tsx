import { siteConfig } from "@/lib/config/site";
import { pageTitle } from "@/lib/seo";

export const metadata = {
  title: pageTitle("Imprint"),
  description: `Legal imprint for ${siteConfig.ownerName}'s portfolio website.`,
};

export default function ImprintPage() {
  return (
    <main id="main-content" className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">Imprint</h1>
      <div className="mt-4 space-y-2 text-(--muted)">
        <p><span className="text-foreground">Owner:</span> {siteConfig.ownerName}</p>
        <p><span className="text-foreground">Contact:</span> Use the contact form or LinkedIn/GitHub links</p>
        <p><span className="text-foreground">Purpose:</span> Personal portfolio showcasing software engineering work</p>
      </div>
    </main>
  );
}
