import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import ProjectGrid from "@/components/ProjectGrid";
import type { Project } from "@/data/projects";

// framer-motion's useReducedMotion reads window.matchMedia, and its
// whileInView feature relies on IntersectionObserver — neither is
// implemented by jsdom. Stub minimal, inert versions so ProjectCard/
// ProjectGrid can mount without throwing.
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

function stubIntersectionObserver() {
  vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
}

const fakeProjects: Project[] = [
  {
    title: "Fraud Radar",
    slug: "fraud-radar",
    category: "ml",
    tagline: "Real-time fraud scoring service.",
    tech: ["Python", "FastAPI"],
    highlights: ["Detects anomalies in real time"],
    liveUrl: "https://fraud-radar.example.com",
    repoUrl: "https://github.com/example/fraud-radar",
  },
  {
    title: "Care Connect",
    slug: "care-connect",
    category: "fullstack",
    tagline: "Patient scheduling platform.",
    tech: ["Next.js", "PostgreSQL"],
    highlights: ["Reduces no-shows via reminders"],
  },
  {
    title: "Skill Bridge",
    slug: "skill-bridge",
    category: "frontend",
    tagline: "Mentorship matching UI.",
    tech: ["React", "Tailwind"],
    highlights: ["Accessible matching flow"],
  },
];

describe("ProjectGrid", () => {
  beforeEach(() => {
    stubMatchMedia();
    stubIntersectionObserver();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders one card per item when items is non-empty", () => {
    render(<ProjectGrid items={fakeProjects} variant="simple" />);

    for (const project of fakeProjects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders conditional live/repo links only for items that define them", () => {
    render(<ProjectGrid items={fakeProjects} variant="simple" />);

    expect(screen.getByRole("link", { name: /live demo/i })).toHaveAttribute(
      "href",
      "https://fraud-radar.example.com",
    );
    expect(screen.getByRole("link", { name: /code/i })).toHaveAttribute(
      "href",
      "https://github.com/example/fraud-radar",
    );
  });

  it("renders the empty state and zero cards when items is an empty array", () => {
    render(<ProjectGrid items={[]} variant="simple" />);

    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/no projects found/i);
    for (const project of fakeProjects) {
      expect(screen.queryByText(project.title)).not.toBeInTheDocument();
    }
  });
});
