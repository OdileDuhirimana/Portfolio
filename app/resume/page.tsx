import { siteConfig } from "@/lib/config/site";
import { pageTitle } from "@/lib/seo";

export const metadata = {
  title: pageTitle("Resume"),
  description: `Download ${siteConfig.ownerName}'s CV as a PDF.`,
};

const CV_PATH = "/cv.pdf";

export default function ResumePage() {
  return (
    <main id="main-content" className="container mx-auto px-6 md:px-8 py-10">
      <h1 className="text-4xl font-semibold">Resume</h1>
      <p className="mt-3 text-(--muted)">Download a PDF copy of my CV.</p>
      <div className="mt-6 flex items-center gap-3">
        <a href={CV_PATH} download className="rounded-xl bg-(--gold) text-black px-5 py-3 font-medium focus-visible:outline-none focus-visible:ring-2 ring-(--focus)">Download CV</a>
        <a href={CV_PATH} target="_blank" rel="noreferrer" className="rounded-xl border px-5 py-3 focus-visible:outline-none focus-visible:ring-2 ring-(--focus)">Open in Browser</a>
      </div>
    </main>
  );
}
