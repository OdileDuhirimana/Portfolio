import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryTabs, { type Category } from "@/components/CategoryTabs";

const TAB_LABELS: Record<Category, string> = {
  all: "All",
  backend: "Backend",
  ml: "AI/ML",
  fullstack: "Full-Stack",
  frontend: "Frontend",
};

describe("CategoryTabs", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a tablist with all 5 tabs and marks the active one as selected", () => {
    render(<CategoryTabs value="ml" onChange={vi.fn()} />);

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(5);

    for (const [key, label] of Object.entries(TAB_LABELS) as [Category, string][]) {
      const tab = screen.getByRole("tab", { name: label });
      expect(tab).toHaveAttribute("aria-selected", key === "ml" ? "true" : "false");
    }
  });

  it("calls onChange with the clicked tab's key for every tab", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CategoryTabs value="all" onChange={onChange} />);

    for (const [key, label] of Object.entries(TAB_LABELS) as [Category, string][]) {
      await user.click(screen.getByRole("tab", { name: label }));
      expect(onChange).toHaveBeenCalledWith(key);
    }
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it("is fully controlled: clicking a tab does not change selection without a prop update", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<CategoryTabs value="backend" onChange={onChange} />);

    await user.click(screen.getByRole("tab", { name: "AI/ML" }));

    // onChange was invoked, but since the parent never re-rendered with a
    // new `value`, the component (having no internal state) must still
    // reflect the original `value` prop.
    expect(onChange).toHaveBeenCalledWith("ml");
    expect(screen.getByRole("tab", { name: "Backend" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "AI/ML" })).toHaveAttribute("aria-selected", "false");
  });
});
