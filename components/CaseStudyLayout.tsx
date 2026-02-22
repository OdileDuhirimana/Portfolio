import Image from "next/image";
import { TechBadge } from "@/components/TechBadge";

export default function CaseStudyLayout({
  project,
}: {
  project: {
    title: string;
    tagline: string;
    tech: string[];
    metrics?: { label: string; value: string }[];
    liveUrl?: string;
    swaggerUrl?: string;
    repoUrl?: string;
    role?: string;
    duration?: string;
    responsibilities?: string[];
    outcomes?: string[];
    architectureDiagram?: string;
    images?: string[];
    highlights?: string[];
  };
}) {
  const impact = project.outcomes?.[0];
  const approach = project.highlights?.slice(0, 2) || [];
  return (
    <main className="container mx-auto px-6 md:px-8 py-10">
      <header className="mb-8 rounded-2xl border border-(--line) bg-(--panel) p-6">
        <h1 className="text-4xl font-semibold">{project.title}</h1>
        <p className="mt-2 text-(--muted)">{project.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-2">{project.tech.map(t => <TechBadge key={t} label={t} />)}</div>
        <div className="mt-4 flex gap-3">
          {project.liveUrl ? <a href={project.liveUrl} className="rounded-lg border px-3 py-2">Live Demo</a> : null}
          {project.swaggerUrl ? <a href={project.swaggerUrl} className="rounded-lg border px-3 py-2">Swagger</a> : null}
          {project.repoUrl ? <a href={project.repoUrl} className="rounded-lg border px-3 py-2">Source Code</a> : null}
        </div>
      </header>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
          <h2 className="text-lg font-semibold mb-2">Problem</h2>
          <p className="text-sm text-(--muted)">{project.tagline}</p>
        </div>
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
          <h2 className="text-lg font-semibold mb-2">Approach</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm text-(--text)/90">
            {approach.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
        <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
          <h2 className="text-lg font-semibold mb-2">Impact</h2>
          <p className="text-sm text-(--muted)">{impact ?? "Delivered with reliability and performance as first-class goals."}</p>
        </div>
      </section>

      {(project.role || project.duration || project.responsibilities?.length) ? (
        <section className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-(--line) bg-(--panel) p-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <ul className="text-sm text-(--muted) space-y-1">
              {project.role ? <li><span className="text-foreground">Role:</span> {project.role}</li> : null}
              {project.duration ? <li><span className="text-foreground">Timeline:</span> {project.duration}</li> : null}
            </ul>
          </div>
          <div className="md:col-span-2 rounded-2xl border border-(--line) bg-(--panel) p-6">
            <h2 className="text-xl font-semibold mb-2">Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-1 text-(--text)/90">
              {project.responsibilities?.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>
        </section>
      ) : null}

      {project.architectureDiagram ? (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Architecture</h2>
          <Image
            src={project.architectureDiagram}
            alt="Architecture diagram"
            width={1600}
            height={900}
            className="h-auto w-full rounded-xl border border-(--line)"
          />
        </section>
      ) : null}

      {project.highlights?.length ? (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
          <ul className="list-disc pl-5 space-y-1 text-(--text)/90">
            {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </section>
      ) : null}

      {project.images?.length ? (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Screens</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.images.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Screenshot ${i+1} of ${project.title}`}
                width={1280}
                height={720}
                className="h-auto w-full rounded-xl border border-(--line)"
              />
            ))}
          </div>
        </section>
      ) : null}

      {project.outcomes?.length ? (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Outcomes & Learnings</h2>
          <ul className="list-disc pl-5 space-y-1 text-(--text)/90">
            {project.outcomes.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </section>
      ) : null}

      <section className="mt-10 flex gap-3">
        <a href="/contact" className="rounded-xl bg-(--gold) text-black px-5 py-3 font-medium">Hire Me</a>
        <a href="/projects" className="rounded-xl border px-5 py-3">Back to Projects</a>
      </section>
    </main>
  );
}
