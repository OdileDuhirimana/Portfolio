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
      <section className="mt-12">
        <SectionHeader
          title="Approach"
          subtitle="Security-first engineering with measurable outcomes and clear operational standards."
        />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
            <h3 className="text-lg font-semibold mb-2">Security by Design</h3>
            <p className="text-sm text-(--muted)">
              Threat modeling, least-privilege access, and audit trails baked into every system.
            </p>
          </div>
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
            <h3 className="text-lg font-semibold mb-2">Reliability at Scale</h3>
            <p className="text-sm text-(--muted)">
              Idempotency, observability, and performance budgets so production stays calm.
            </p>
          </div>
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
            <h3 className="text-lg font-semibold mb-2">AI With Accountability</h3>
            <p className="text-sm text-(--muted)">
              Explainable models, careful validation, and pragmatic integration into products.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-10">
        <SectionHeader title="Featured Work" subtitle="A selection across backend, AI/ML, and full-stack." />
        <ProjectGrid items={featured} variant="tech" />
      </section>
    </main>
  );
}
