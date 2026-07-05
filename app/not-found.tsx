import Link from "next/link";
import { pageTitle } from "@/lib/seo";

export const metadata = { title: pageTitle("Page Not Found") };

export default function NotFound() {
  return (
    <main id="main-content" className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-20 text-center md:px-8">
      <p className="text-sm font-mono tracking-widest uppercase text-(--gold)">404</p>
      <h1 className="text-4xl font-semibold md:text-5xl text-(--text)">
        Page not found
      </h1>
      <p className="max-w-md text-base text-(--muted)">
        This page doesn&apos;t exist or was moved. Head back to explore the portfolio.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-(--gold) px-6 py-3 text-sm font-medium text-black transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
      >
        Back to Home
      </Link>
    </main>
  );
}
