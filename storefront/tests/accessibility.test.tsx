import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../src/App";

describe("Accessibility & Keyboard Interaction", () => {
  it("includes a functional skip to content accessibility link", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    const skipLink = screen.getByText(/Skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
  });

  it("ensures all navigation landmarks and semantic roles are present", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("handles mobile menu keyboard accessibility", async () => {
    const user = userEvent.setup();
    window.history.pushState({}, "", "/");
    render(<App />);

    const menuBtn = screen.getByLabelText(/Open Navigation Menu/i);
    expect(menuBtn).toBeInTheDocument();
    expect(menuBtn).toHaveAttribute("aria-expanded", "false");

    await user.click(menuBtn);
    expect(screen.getByRole("dialog", { name: /Mobile Navigation/i })).toBeInTheDocument();
  });
});
