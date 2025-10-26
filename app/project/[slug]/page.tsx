import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import CaseStudyLayout from "@/components/CaseStudyLayout";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return { title: "Project — Odile Duhirimana" };
  return {
    title: `${project.title} — Odile Duhirimana`,
    description: project.tagline,
    openGraph: {
      title: `${project.title} — Odile Duhirimana`,
      description: project.tagline,
      type: "article",
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find(p => p.slug === params.slug);
  if (!project) return notFound();
  return <CaseStudyLayout project={project} />;
}
