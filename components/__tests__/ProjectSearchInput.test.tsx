import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectSearchInput from "@/components/ProjectSearchInput";

describe("ProjectSearchInput", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders a search input with the accessible name 'Search projects'", () => {
    render(<ProjectSearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole("searchbox", { name: /search projects/i })).toBeInTheDocument();
  });

  it("calls onChange with the new value for each keystroke", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ProjectSearchInput value="" onChange={onChange} />);

    const input = screen.getByRole("searchbox", { name: /search projects/i });
    await user.type(input, "abc");

    expect(onChange).toHaveBeenNthCalledWith(1, "a");
    expect(onChange).toHaveBeenNthCalledWith(2, "b");
    expect(onChange).toHaveBeenNthCalledWith(3, "c");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("does not render the clear button when value is empty", () => {
    render(<ProjectSearchInput value="" onChange={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /clear search/i })).not.toBeInTheDocument();
  });

  it("renders the clear button when value is non-empty and clears on click", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ProjectSearchInput value="fraud" onChange={onChange} />);

    const clearButton = screen.getByRole("button", { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(onChange).toHaveBeenCalledWith("");
  });
});
