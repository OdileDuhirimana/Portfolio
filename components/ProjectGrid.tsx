"use client";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/data/projects";

export default function ProjectGrid({ items, variant = "simple" as const }: { items: Project[]; variant?: "simple" | "tech" }) {
  const reduce = useReducedMotion();
  const item: Variants | undefined = reduce ? undefined : {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.25, 0.8, 0.25, 1] } },
  };
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-6">
      {items.map(p => (
        <motion.div
          key={p.slug}
          className="mb-6 break-inside-avoid inline-block w-full align-top"
          initial={reduce ? undefined : "hidden"}
          whileInView={reduce ? undefined : "show"}
          viewport={{ once: true, margin: "-50px" }}
          variants={item}
        >
          <ProjectCard
            variant={variant}
            slug={p.slug}
            category={p.category}
            title={p.title}
            tagline={p.tagline}
            tech={p.tech}
            highlights={p.highlights}
            metrics={p.metrics}
            liveUrl={p.liveUrl}
            repoUrl={p.repoUrl}
          />
        </motion.div>
      ))}
    </div>
  );
}
