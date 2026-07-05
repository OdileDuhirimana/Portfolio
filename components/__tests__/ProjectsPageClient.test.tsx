import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectsPageClient from "@/components/ProjectsPageClient";
import { projects } from "@/data/projects";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

// ProjectGrid renders ProjectCard, which uses framer-motion's
// whileInView/useReducedMotion — jsdom implements neither
// IntersectionObserver nor matchMedia, so both need a minimal stub for any
// of these components to mount without throwing. Mirrors the same stubs in
// components/__tests__/ProjectGrid.test.tsx.
function stubMatchMedia() {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })),
  );
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

/**
 * ProjectsPageClient reflects filter/sort/page state in the URL via
 * useSearchParams/useRouter rather than useState — these tests mock the
 * Next.js navigation hooks directly (the standard way to unit-test a
 * component that reads/writes search params without a full router/provider
 * stack) and assert the *intent* the component sends to router.replace()
 * for a given interaction, plus the resulting page contents for a given
 * search-params snapshot.
 */
function setSearchParams(paramString: string) {
  const params = new URLSearchParams(paramString);
  vi.mocked(useSearchParams).mockReturnValue(params as unknown as ReturnType<typeof useSearchParams>);
}

describe("ProjectsPageClient", () => {
  const replaceMock = vi.fn();

  beforeEach(() => {
    stubMatchMedia();
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    replaceMock.mockReset();
  });

  function setup(paramString = "") {
    vi.mocked(useRouter).mockReturnValue({ replace: replaceMock } as unknown as ReturnType<typeof useRouter>);
    setSearchParams(paramString);
    return render(<ProjectsPageClient />);
  }

  it("paginates to at most 6 project cards per page by default", () => {
    setup("");
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.length).toBeLessThanOrEqual(6);
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument();
  });

  it("disables the Previous button on page 1 and enables Next when more pages exist", () => {
    setup("");
    expect(screen.getByRole("button", { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("navigates to page=2 via the URL when Next is clicked", async () => {
    const user = userEvent.setup();
    setup("");
    await user.click(screen.getByRole("button", { name: /next/i }));
    expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("page=2"), { scroll: false });
  });

  it("resets to page 1 (drops the page param) when the search query changes", async () => {
    const user = userEvent.setup();
    setup("page=2");
    await user.type(screen.getByRole("searchbox", { name: /search projects/i }), "a");
    // The search box now debounces its URL push (see ProjectsPageClient's
    // `searchInput` state doc-comment: driving the input directly off the
    // URL raced async navigations and could drop keystrokes entirely), so
    // router.replace fires ~300ms after the last keystroke rather than
    // synchronously on every one.
    await waitFor(() => expect(replaceMock).toHaveBeenCalled());
    const lastCall = replaceMock.mock.calls.at(-1)?.[0] as string;
    expect(lastCall).not.toContain("page=");
  });

  it("hides pagination controls and shows the empty state when a filter matches nothing", () => {
    setup("q=zzz-no-such-project-zzz");
    expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: /projects pagination/i })).not.toBeInTheDocument();
  });

  it("computes enough pages to cover the full project list at 6 per page", () => {
    setup("");
    const expectedPages = Math.max(1, Math.ceil(projects.length / 6));
    expect(screen.getByText(new RegExp(`page 1 of ${expectedPages}`, "i"))).toBeInTheDocument();
  });

  it("changing the sort order updates the URL's sort param", async () => {
    const user = userEvent.setup();
    setup("");
    await user.selectOptions(screen.getByLabelText(/sort projects/i), "title-desc");
    expect(replaceMock).toHaveBeenCalledWith(expect.stringContaining("sort=title-desc"), { scroll: false });
  });
});
