import { Suspense } from "react";
import ProjectsPageClient from "@/components/ProjectsPageClient";
import { pageTitle } from "@/lib/seo";

export const metadata = {
  title: pageTitle("Projects"),
  description: "Browse projects across Backend, AI/ML, Full-Stack, and Frontend.",
};

export default function ProjectsPage() {
  // ProjectsPageClient reads/writes ?tab=&q=&sort=&page= via useSearchParams,
  // which Next.js requires to be wrapped in a Suspense boundary for routes
  // that are otherwise statically prerendered (see Next's docs on
  // useSearchParams + static rendering) — without this, `next build` fails
  // with a "should be wrapped in a suspense boundary" build error.
  return (
    <Suspense fallback={null}>
      <ProjectsPageClient />
    </Suspense>
  );
}
