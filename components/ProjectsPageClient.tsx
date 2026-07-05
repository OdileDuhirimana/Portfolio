"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SectionHeader from "@/components/SectionHeader";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectSearchInput from "@/components/ProjectSearchInput";
import { projects } from "@/data/projects";
import CategoryTabs, { type Category as TabCategory } from "@/components/CategoryTabs";

type SortOrder = "title-asc" | "title-desc";

const PAGE_SIZE = 6;
const DEFAULT_SORT: SortOrder = "title-asc";

/**
 * URL-driven filter/sort/pagination state (?tab=, ?q=, ?sort=, ?page=).
 *
 * WHY pagination at all for a ~14-item array: an audit flagged that
 * `/projects` ships its entire dataset to the client and paginates nowhere,
 * which is a reasonable shortcut at today's size but not a pattern that
 * scales — and not one that demonstrates any judgment about scale if this
 * project list (or a future one with a real backend) grows. Slicing
 * client-side over the same in-memory array is intentionally the SIMPLEST
 * version of this pattern that's still real: the moment `projects` is
 * fetched from an API instead of imported as a static array, this same
 * `page`/`pageSize` contract (and the URL shape) is what a server-side
 * `?page=&limit=` endpoint would already match, so this isn't throwaway
 * code to delete later — it's the client-side half of a pattern that
 * survives the eventual move off a static array. See README's Tradeoffs
 * section for why a real backend isn't in scope for this project itself.
 *
 * WHY the URL (not just useState): reflecting filters/sort/page in the URL
 * means a shared link reproduces the exact view (a real, if small,
 * usability property a plain useState version doesn't have), and matches
 * how a production listing page would be built.
 */
export default function ProjectsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = (searchParams.get("tab") as TabCategory | null) ?? "all";
  const urlQuery = searchParams.get("q") ?? "";
  const sort: SortOrder = searchParams.get("sort") === "title-desc" ? "title-desc" : DEFAULT_SORT;
  const requestedPage = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  /**
   * Local, synchronous source of truth for the search box's displayed text.
   *
   * WHY: this box used to be a fully controlled input driven straight from
   * `searchParams.get("q")`, with every keystroke immediately calling
   * `router.replace()`. That round-trips through an async client-side
   * navigation before `useSearchParams()` reflects the new value — so a
   * second keystroke fired before the first navigation committed read a
   * stale `searchParams` snapshot (captured in `updateParams`'s closure)
   * and clobbered it. Verified in practice: typing "fraud" at a normal
   * pace reproducibly left the box completely empty with no `?q=` in the
   * URL at all — a silent, total loss of user input on the site's one
   * search feature. Local state removes the async round-trip from the
   * box's hot path entirely; the URL is now a debounced *projection* of
   * this state, not its source.
   */
  const [searchInput, setSearchInput] = useState(urlQuery);

  // Tracks the last `urlQuery` this component has already reconciled
  // `searchInput` against, so the block below can tell "the URL changed
  // from outside" apart from "we're mid-render after our own debounced
  // push landed."
  const [syncedUrlQuery, setSyncedUrlQuery] = useState(urlQuery);

  // Re-sync when the URL's `q` changes from outside this component (back/
  // forward navigation, a shared `?q=...` link) without fighting in-
  // progress typing. Deliberately done during render rather than in a
  // `useEffect` — this is React's documented "adjusting state when a prop
  // changes" pattern: calling setState in an effect here would pass a
  // stale `searchInput` to the browser for one extra frame and trips
  // `react-hooks/set-state-in-effect` (cascading-render risk) for no
  // benefit, since this component is the only writer of both variables.
  if (urlQuery !== syncedUrlQuery) {
    setSyncedUrlQuery(urlQuery);
    setSearchInput(urlQuery);
  }

  const updateParams = useCallback(
    (updates: Record<string, string | null>, resetPage: boolean) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") next.delete(key);
        else next.set(key, value);
      }
      if (resetPage) next.delete("page");
      const qs = next.toString();
      router.replace(qs ? `/projects?${qs}` : "/projects", { scroll: false });
    },
    [router, searchParams],
  );

  // Debounce the URL push so a burst of keystrokes produces one navigation
  // instead of one per character — both a performance/history-spam fix and
  // what actually prevents the race described above (there is no longer a
  // navigation in flight for every single keystroke to race against).
  useEffect(() => {
    if (searchInput === urlQuery) return;
    const timeout = setTimeout(() => {
      updateParams({ q: searchInput }, true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput, urlQuery, updateParams]);

  const filteredAndSorted = useMemo(() => {
    // Filters off the local value directly, so results update instantly
    // as the user types rather than waiting on the debounced URL push.
    const q = searchInput.trim().toLowerCase();
    const byCategory = tab === "all" ? projects : projects.filter((p) => p.category === tab);
    const matched = !q
      ? byCategory
      : byCategory.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.tagline.toLowerCase().includes(q) ||
            p.tech.some((t) => t.toLowerCase().includes(q)),
        );

    const sorted = [...matched].sort((a, b) =>
      sort === "title-desc" ? b.title.localeCompare(a.title) : a.title.localeCompare(b.title),
    );
    return sorted;
  }, [tab, searchInput, sort]);

  const pageCount = Math.max(1, Math.ceil(filteredAndSorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filteredAndSorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <main id="main-content" className="container mx-auto px-6 md:px-8 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SectionHeader title="Projects" subtitle="Explore work across Backend, AI/ML, Full-Stack, and Frontend." />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <ProjectSearchInput value={searchInput} onChange={setSearchInput} />
          <CategoryTabs value={tab} onChange={(value) => updateParams({ tab: value === "all" ? null : value }, true)} />
          <div>
            <label htmlFor="project-sort" className="sr-only">Sort projects</label>
            <select
              id="project-sort"
              value={sort}
              onChange={(e) => updateParams({ sort: e.target.value === "title-desc" ? "title-desc" : null }, true)}
              className="rounded-full border border-(--line) bg-(--panel) px-3 py-2 text-xs uppercase tracking-wider text-(--text) focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
            >
              <option value="title-asc">Title A–Z</option>
              <option value="title-desc">Title Z–A</option>
            </select>
          </div>
        </div>
      </div>

      <ProjectGrid items={pageItems} variant="tech" />

      {filteredAndSorted.length > 0 && (
        <nav aria-label="Projects pagination" className="mt-8 flex items-center justify-center gap-4 text-sm">
          <button
            type="button"
            onClick={() => updateParams({ page: String(currentPage - 1) }, false)}
            disabled={currentPage <= 1}
            className="rounded-lg border border-(--line) px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
          >
            Previous
          </button>
          <span aria-live="polite" className="text-(--muted)">
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => updateParams({ page: String(currentPage + 1) }, false)}
            disabled={currentPage >= pageCount}
            className="rounded-lg border border-(--line) px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 ring-(--focus)"
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
