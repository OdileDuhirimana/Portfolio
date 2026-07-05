export type Category = "backend" | "frontend" | "fullstack" | "ml" | "all";

const tabs: { key: Category; label: string }[] = [
  { key: "all", label: "All" },
  { key: "backend", label: "Backend" },
  { key: "ml", label: "AI/ML" },
  { key: "fullstack", label: "Full-Stack" },
  { key: "frontend", label: "Frontend" },
];

type CategoryTabsProps = {
  value: Category;
  onChange: (category: Category) => void;
};

/**
 * Fully controlled tab list — the parent owns `value` and is the single
 * source of truth. A prior version kept a mirrored `useState` internally,
 * which meant `value` and internal `current` could silently desync if the
 * parent ever changed `value` for a reason other than a tab click (e.g.
 * resetting filters). Dropping internal state removes that failure mode.
 */
export default function CategoryTabs({ value, onChange }: CategoryTabsProps) {
  return (
    <div role="tablist" aria-label="Filter projects by category" className="inline-flex items-center gap-2 rounded-full border border-(--line) bg-(--panel) p-1.5">
      {tabs.map(t => (
        <button
          key={t.key}
          role="tab"
          aria-selected={value === t.key}
          onClick={() => onChange(t.key)}
          className={`relative rounded-full px-3 py-1.5 text-xs uppercase tracking-wider transition-colors ${value === t.key ? "bg-white/5 text-white" : "text-(--muted) hover:text-white"}`}
        >
          {t.label}
          {value === t.key ? <span className="absolute left-1/2 -bottom-[3px] h-[2px] w-6 -translate-x-1/2 rounded-full bg-(--gold)" /> : null}
        </button>
      ))}
    </div>
  );
}
