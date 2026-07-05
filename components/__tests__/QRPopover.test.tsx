import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import QRPopover from "@/components/QRPopover";

describe("QRPopover", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("is closed initially", () => {
    render(<QRPopover url="https://example.com" />);
    const trigger = screen.getByRole("button", { name: /show qr code/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("uses 'QR' as the default trigger label when none is provided", () => {
    render(<QRPopover url="https://example.com" />);
    expect(screen.getByRole("button", { name: /show qr code/i })).toHaveTextContent("QR");
  });

  it("opens the popover when the trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<QRPopover url="https://example.com" label="Scan me" />);

    const trigger = screen.getByRole("button", { name: /show qr code/i });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<QRPopover url="https://example.com" />);

    const trigger = screen.getByRole("button", { name: /show qr code/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.activeElement).toBe(trigger);
  });

  it("closes when clicking outside the popover", async () => {
    const user = userEvent.setup();
    render(<QRPopover url="https://example.com" />);

    const trigger = screen.getByRole("button", { name: /show qr code/i });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(document.body);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
