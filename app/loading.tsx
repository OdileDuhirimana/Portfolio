/**
 * Root loading state, shown by Next.js while a route segment's Server
 * Component tree is still fetching/rendering. All content on this site is
 * static at build time, so this fires only in the narrow window during
 * navigation before the prerendered HTML is swapped in — but the file must
 * still exist and communicate an actual loading state (an aria-live
 * skeleton) rather than a blank screen, per the project's stated rule to
 * handle loading, error, and empty states everywhere.
 */
export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading page content"
      className="container mx-auto px-6 md:px-8 py-10"
    >
      <span className="sr-only">Loading…</span>
      <div className="animate-pulse space-y-6" aria-hidden="true">
        <div className="h-10 w-2/3 rounded-xl bg-(--panel)" />
        <div className="h-4 w-full max-w-xl rounded-lg bg-(--panel)" />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="h-32 rounded-2xl bg-(--panel)" />
          <div className="h-32 rounded-2xl bg-(--panel)" />
          <div className="h-32 rounded-2xl bg-(--panel)" />
        </div>
      </div>
    </main>
  );
}
