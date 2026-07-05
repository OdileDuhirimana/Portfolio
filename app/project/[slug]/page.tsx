import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import CaseStudyLayout from "@/components/CaseStudyLayout";
import { pageTitle } from "@/lib/seo";

type ProjectPageParams = { slug: string };

export function generateStaticParams(): ProjectPageParams[] {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * The project list is a small, fixed, curated dataset — there is no
 * legitimate case where a slug outside `generateStaticParams()` should ever
 * render. Without this, Next's default `dynamicParams: true` renders
 * unknown slugs on demand and calls `notFound()` inside the component, but
 * that render still gets cached and served as a *200* with a year-long
 * `s-maxage` (verified against a production build, not just `next dev`) —
 * a "soft 404" that's bad for SEO and means a typo'd or scraped URL gets
 * cached as a real page indefinitely. Declaring `dynamicParams = false`
 * makes Next 404 unknown slugs at the routing layer itself, before this
 * component (or its own `notFound()` call below) ever runs, which is the
 * behavior actually being tested for.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<ProjectPageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: pageTitle("Project") };

  const title = pageTitle(project.title);
  return {
    title,
    description: project.tagline,
    openGraph: {
      title,
      description: project.tagline,
      type: "article",
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<ProjectPageParams>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return notFound();
  return <CaseStudyLayout project={project} />;
}
