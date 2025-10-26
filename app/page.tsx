export const metadata = {
  title: "Odile Duhirimana — Secure Backend & AI Engineer",
  description: "Premium portfolio showcasing backend, AI/ML, and full-stack projects.",
};

import Hero from "@/components/Hero";
import SectionHeader from "@/components/SectionHeader";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/data/projects";

export default function HomePage() {
  const featured = projects.filter(p => ["backend","ml"].includes(p.category)).slice(0,6);
  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <Hero />
      <section className="mt-10">
        <SectionHeader title="Featured Work" subtitle="A selection across backend, AI/ML, and full-stack." />
        <ProjectGrid items={featured} variant="tech" />
      </section>
    </main>
  );
}
