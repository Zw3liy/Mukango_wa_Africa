import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "../src/App";

describe("Routing & Page Render Suite", () => {
  it("renders homepage with brand title and primary navigation", () => {
    window.history.pushState({}, "", "/");
    render(<App />);

    expect(screen.getAllByText(/Mukango Wa Africa/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Where Heritage Meets Modern Living/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore Catalogue/i)).toBeInTheDocument();
  });

  it("renders shop catalogue page with products", () => {
    window.history.pushState({}, "", "/shop");
    render(<App />);

    expect(screen.getByRole("heading", { name: /Curated Furniture Works/i })).toBeInTheDocument();
    expect(screen.getAllByText(/The Savannah Throned Chair/i).length).toBeGreaterThan(0);
  });

  it("renders product detail page for valid slug", () => {
    window.history.pushState({}, "", "/products/savannah-throned-chair");
    render(<App />);

    expect(screen.getAllByText(/The Savannah Throned Chair/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Zambezi Teak/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /Add to Basket/i })).toBeInTheDocument();
  });

  it("renders collections index and collection detail", () => {
    window.history.pushState({}, "", "/collections");
    render(<App />);
    expect(screen.getByRole("heading", { name: /Curated Design Motifs/i })).toBeInTheDocument();

    window.history.pushState({}, "", "/collections/the-savannah-collection");
    render(<App />);
    expect(screen.getAllByText(/The Savannah Collection/i).length).toBeGreaterThan(0);
  });

  it("renders bespoke commissions page", () => {
    window.history.pushState({}, "", "/bespoke");
    render(<App />);

    expect(screen.getByRole("heading", { name: /Create Something Uniquely Yours/i })).toBeInTheDocument();
    expect(screen.getByText(/The 4-Stage Commission Journey/i)).toBeInTheDocument();
  });

  it("renders craftsmanship & timber registry", () => {
    window.history.pushState({}, "", "/craftsmanship");
    render(<App />);

    expect(screen.getByRole("heading", { name: /Mastery in Every Grain/i })).toBeInTheDocument();
    expect(screen.getByText(/Our Certified Indigenous Hardwoods/i)).toBeInTheDocument();
  });

  it("renders our story / about page", () => {
    window.history.pushState({}, "", "/about");
    render(<App />);

    expect(screen.getByRole("heading", { name: /A Legacy Rooted in Zambian Soil/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Chiwama Kennedy Daka/i).length).toBeGreaterThan(0);
  });

  it("renders journal list and journal detail", () => {
    window.history.pushState({}, "", "/journal");
    render(<App />);
    expect(screen.getByRole("heading", { name: /Stories & Craft/i })).toBeInTheDocument();

    window.history.pushState({}, "", "/journal/quiet-language-of-mukwa-wood");
    render(<App />);
    expect(screen.getAllByText(/The Quiet Language of Mukwa Wood/i).length).toBeGreaterThan(0);
  });

  it("renders FAQ, shipping, returns, privacy, terms pages", () => {
    window.history.pushState({}, "", "/faq");
    render(<App />);
    expect(screen.getAllByText(/Frequently Asked Questions/i).length).toBeGreaterThan(0);

    window.history.pushState({}, "", "/shipping");
    render(<App />);
    expect(screen.getByRole("heading", { name: /Global Crated Shipping/i })).toBeInTheDocument();

    window.history.pushState({}, "", "/returns");
    render(<App />);
    expect(screen.getByRole("heading", { name: /25-Year Heirloom Guarantee/i })).toBeInTheDocument();

    window.history.pushState({}, "", "/privacy");
    render(<App />);
    expect(screen.getByRole("heading", { name: /Privacy Policy/i })).toBeInTheDocument();

    window.history.pushState({}, "", "/terms");
    render(<App />);
    expect(screen.getByRole("heading", { name: /Terms of Service/i })).toBeInTheDocument();
  });

  it("renders 404 page for unknown routes", () => {
    window.history.pushState({}, "", "/nonexistent-page-url");
    render(<App />);

    expect(screen.getByText(/Woodland Path Not Found/i)).toBeInTheDocument();
  });
});
