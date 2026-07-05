"use client";
import { Search, X } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
};

export default function ProjectSearchInput({ value, onChange }: Props) {
  return (
    <div className="relative w-full md:w-72">
      <label htmlFor="project-search" className="sr-only">Search projects</label>
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--muted)"
        size={16}
        aria-hidden="true"
      />
      <input
        id="project-search"
        type="search"
        placeholder="Search projects…"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-full border border-(--line) bg-(--panel) text-(--text) py-2 pl-9 pr-8 text-sm outline-none transition-colors"
      />
      {value.length > 0 && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 grid h-6 w-6 place-items-center rounded-full text-(--muted) transition-colors hover:text-(--text)"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
