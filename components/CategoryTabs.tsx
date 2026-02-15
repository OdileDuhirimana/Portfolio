"use client";
import { useState } from "react";

export type Category = "backend" | "frontend" | "fullstack" | "ml" | "all";

const tabs: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "backend", label: "Backend" },
  { key: "ml", label: "AI/ML" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "frontend", label: "Frontend" },
];

export default function CategoryTabs({ value, onChange }: { value?: Category; onChange?: (c: Category) => void }) {
  const [current, setCurrent] = useState<Category>(value ?? "all");
  const change = (c: Category) => {
    setCurrent(c);
    onChange?.(c);
  };
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--panel) p-1.5">
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => change(t.key)}
          className={`relative rounded-full px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${current === t.key ? "bg-white/5 text-white" : "text-(--muted) hover:text-white"}`}
        >
          {t.label}
          {current === t.key ? <span className="absolute left-1/2 -bottom-[3px] h-[2px] w-6 -translate-x-1/2 rounded-full bg-(--gold)" /> : null}
        </button>
      ))}
    </div>
  );
}
