import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders the brand link with non-empty text derived from the owner name", () => {
    render(<Navbar />);
    // The brand link is the first link rendered (href="/") — assert it has
    // some non-empty, uppercased text without hardcoding a specific name,
    // since ownerName is resolved from env vars at module-import time.
    const brand = screen.getAllByRole("link")[0];
    expect(brand.getAttribute("href")).toBe("/");
    expect(brand.textContent).toBeTruthy();
    expect(brand.textContent).toBe(brand.textContent?.toUpperCase());
  });

  it("always renders the Projects/About/Contact desktop links", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("starts with the mobile menu closed", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    const menuId = toggle.getAttribute("aria-controls");
    expect(menuId).toBeTruthy();
    expect(document.getElementById(menuId as string)).not.toBeInTheDocument();

    // Only the desktop "Hire Me" link should exist while the menu is closed.
    expect(screen.getAllByRole("link", { name: "Hire Me" })).toHaveLength(1);
  });

  it("opens the mobile menu when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const toggle = screen.getByRole("button", { name: "Open menu" });
    await user.click(toggle);

    const opened = screen.getByRole("button", { name: "Close menu" });
    expect(opened).toHaveAttribute("aria-expanded", "true");

    const menuId = opened.getAttribute("aria-controls");
    expect(document.getElementById(menuId as string)).toBeInTheDocument();

    // The mobile menu duplicates "Hire Me" and "Resume" links, so there
    // should now be two of each in the document.
    expect(screen.getAllByRole("link", { name: "Hire Me" })).toHaveLength(2);
    expect(screen.getAllByRole("link", { name: "Resume" })).toHaveLength(2);
  });

  it("closes the mobile menu when a link inside it is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const closeToggle = screen.getByRole("button", { name: "Close menu" });
    expect(closeToggle).toHaveAttribute("aria-expanded", "true");

    const menuId = closeToggle.getAttribute("aria-controls") as string;
    const mobileMenu = document.getElementById(menuId) as HTMLElement;
    const mobileProjectsLink = screen.getAllByRole("link", { name: "Projects" }).find(
      (link) => mobileMenu.contains(link),
    );
    expect(mobileProjectsLink).toBeDefined();

    await user.click(mobileProjectsLink as HTMLElement);

    const toggleAfterClose = screen.getByRole("button", { name: "Open menu" });
    expect(toggleAfterClose).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(menuId)).not.toBeInTheDocument();
  });

  it("derives the brand link text from NEXT_PUBLIC_OWNER_NAME (first word, uppercased)", async () => {
    const originalEnv = { ...process.env };
    process.env.NEXT_PUBLIC_OWNER_NAME = "Jane Doe";
    vi.resetModules();

    const { default: DynamicNavbar } = await import("@/components/Navbar");
    render(<DynamicNavbar />);

    const links = screen.getAllByRole("link");
    expect(links[0].textContent).toBe("JANE");

    process.env = originalEnv;
    vi.resetModules();
  });
});
