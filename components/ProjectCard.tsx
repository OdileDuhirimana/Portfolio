"use client";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, Github, QrCode } from "lucide-react";
import QRCode from "react-qr-code";
import { TechBadge } from "@/components/TechBadge";
import { MetricBadge } from "@/components/MetricBadge";
import { useEffect, useRef, useState } from "react";
import ProjectIcon from "@/components/ProjectIcon";

type Props = {
  variant?: "simple" | "tech";
  title: string;
  tagline: string;
  tech: string[];
  highlights: string[];
  metrics?: { label: string; value: string }[];
  liveUrl?: string;
  repoUrl?: string;
  slug: string;
  category: import("@/data/projects").Category;
};

export default function ProjectCard({
  variant = "simple",
  title, tagline, tech, highlights, metrics, liveUrl, repoUrl, slug, category
}: Props) {
  const [qrOpen, setQrOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!qrOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setQrOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!cardRef.current) return;
      if (!cardRef.current.contains(e.target as Node)) setQrOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [qrOpen]);
  return (
    <motion.article
      ref={cardRef as any}
      layout
      initial={reduce ? undefined : { opacity: 0, y: 12 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={reduce ? undefined : { duration: 0.32, ease: [0.25, 0.8, 0.25, 1] }}
      className="group relative rounded-[20px] border border-(--line) bg-(--panel) p-6 transition will-change-transform hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_8px_30px_rgba(0,0,0,0.35)]"
    >
      <header className="mb-4 text-center">
        <div className="mb-4 grid place-items-center rounded-full p-1 transition shadow-[0_0_0_0_rgba(212,175,55,0)] group-hover:shadow-[0_0_0_8px_rgba(212,175,55,0.08)]">
          <ProjectIcon slug={slug} category={category} />
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

      {variant === "tech" && metrics?.length ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {metrics.map((m, i) => <MetricBadge key={i} {...m} />)}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        {liveUrl && (
          <a className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
             href={liveUrl} target="_blank" rel="noreferrer">
            <ExternalLink className="w-4 h-4" /> Live Demo
          </a>
        )}
        {repoUrl && (
          <a className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
             href={repoUrl} target="_blank" rel="noreferrer">
            <Github className="w-4 h-4" /> Code
          </a>
        )}
        {liveUrl && (
          <button
            type="button"
            onClick={() => setQrOpen(v => !v)}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-white/5"
            aria-expanded={qrOpen}
            aria-label="Toggle QR code"
          >
            <QrCode className="w-4 h-4" /> QR
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {qrOpen && (
          <motion.div
            key="qr-panel"
            layout
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={reduce ? { height: "auto", opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { height: 0, opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduce ? undefined : { duration: 0.25, ease: [0.25, 0.8, 0.25, 1] }}
            className="mt-4 rounded-2xl border border-(--line) bg-(--panel) p-3 grid place-items-center"
          >
            <div className="rounded-xl bg-black p-2">
              <QRCode value={liveUrl!} size={164} style={{ height: "auto", maxWidth: "100%", width: "164px" }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}
