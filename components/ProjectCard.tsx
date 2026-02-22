"use client";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { TechBadge } from "@/components/TechBadge";
import ProjectIcon from "@/components/ProjectIcon";

type Props = {
  variant?: "simple" | "tech";
  title: string;
  tagline: string;
  tech: string[];
  highlights: string[];
  metrics?: { label: string; value: string }[];
  liveUrl?: string;
  swaggerUrl?: string;
  repoUrl?: string;
  slug: string;
  category: import("@/data/projects").Category;
};

export default function ProjectCard(props: Props) {
  const { title, tagline, tech, highlights, liveUrl, swaggerUrl, repoUrl, slug, category } = props;
  const coverMap: Record<Props["category"], { label: string }> = {
    backend: { label: "Backend Systems" },
    frontend: { label: "Frontend Experience" },
    fullstack: { label: "Full-Stack Product" },
    ml: { label: "AI/ML Systems" },
  };
  const cover = coverMap[category];
  const reduce = useReducedMotion();
  return (
    <motion.article
      layout
      initial={reduce ? undefined : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={reduce ? undefined : { duration: 0.32, ease: [0.25, 0.8, 0.25, 1] }}
      className="group relative rounded-[20px] border border-(--line) bg-(--panel) p-6 transition will-change-transform hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_8px_30px_rgba(0,0,0,0.35)]"
    >
      <header className="mb-4">
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-(--line) bg-black/20 p-4">
          <div className="relative flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-(--muted)">{cover.label}</span>
            <span className="grid h-11 w-11 place-items-center">
              <ProjectIcon slug={slug} category={category} />
            </span>
          </div>
        </div>
        <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-(--muted)">{tagline}</p>
      </header>

      <div className="mb-4 flex flex-wrap gap-2">
        {tech.map(t => <TechBadge key={t} label={t} />)}
      </div>

      <ul className="mb-4 list-disc pl-5 space-y-1 text-sm text-(--text)/90">
        {highlights.slice(0, 3).map((h, i) => <li key={i}>{h}</li>)}
      </ul>

      <div className="flex items-center gap-3">
        {liveUrl && (
          <a className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
             href={liveUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4" /> Live Demo
          </a>
        )}
        {swaggerUrl && (
          <a className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
             href={swaggerUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4" /> Swagger
          </a>
        )}
        {repoUrl && (
          <a className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
             href={repoUrl} target="_blank" rel="noreferrer">
            <Github className="w-4 h-4" /> Code
          </a>
        )}
      </div>
    </motion.article>
  );
}
