"use client";
import { useState, useMemo } from "react";
import SectionHeader from "@/components/SectionHeader";
import ProjectGrid from "@/components/ProjectGrid";
import { projects } from "@/data/projects";
import CategoryTabs, { type Category as TabCategory } from "@/components/CategoryTabs";

export default function ProjectsPageClient() {
  const [tab, setTab] = useState<TabCategory>("all");
  const filtered = useMemo(() => (
    tab === "all" ? projects : projects.filter(p => p.category === tab)
  ), [tab]);

  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <div className="flex items-center justify-between">
        <SectionHeader title="Projects" subtitle="Explore work across Backend, AI/ML, Full-Stack, and Frontend." />
        <CategoryTabs value={tab} onChange={setTab} />
      </div>
      <ProjectGrid items={filtered} variant="tech" />
    </main>
  );
}
