import { describe, it, expect } from "vitest";
import {
  handleContactFormSubmission,
  handleBespokeFormSubmission,
  handleNewsletterSubmission,
} from "../src/server/formHandler";

describe("Forms & Delivery Provider Boundary", () => {
  it("rejects contact submissions with honeypot botField populated", async () => {
    const res = await handleContactFormSubmission({
      name: "Spam Bot",
      email: "bot@spam.com",
      message: "Buy cheap backlinks now!",
      botField: "I am a bot",
    });

    expect(res.success).toBe(false);
    expect(res.message).toContain("rejected");
  });

  it("validates contact form required fields", async () => {
    const res = await handleContactFormSubmission({
      name: "",
      email: "invalid-email",
      message: "short",
    });

    expect(res.success).toBe(false);
    expect(res.errors?.name).toBeDefined();
    expect(res.errors?.email).toBeDefined();
    expect(res.errors?.message).toBeDefined();
  });

  it("processes valid contact form and reports environment configuration status honestly", async () => {
    delete process.env.RESEND_API_KEY;

    const res = await handleContactFormSubmission({
      name: "Amelia Duarte",
      email: "amelia@example.com",
      subject: "Savannah Chair Inquiry",
      message: "I would like to inquire about shipping crated furniture to Lisbon.",
    });

    expect(res.success).toBe(true);
    expect(res.submissionId).toBeDefined();
    expect(res.isConfigurationFailure).toBe(true); // Honest reporting when email transport is unconfigured
  });

  it("validates bespoke commission submission", async () => {
    const res = await handleBespokeFormSubmission({
      fullName: "James Whitfield",
      email: "james@safari.co.za",
      country: "South Africa",
      pieceType: "dining_table",
      projectDescription: "We need a 12-seater dining table for our wilderness lodge on the Luangwa river.",
    });

    expect(res.success).toBe(true);
    expect(res.submissionId).toMatch(/^MWA-BESPOKE-/);
  });

  it("validates newsletter submissions", async () => {
    const badRes = await handleNewsletterSubmission({ email: "notanemail" });
    expect(badRes.success).toBe(false);

    const goodRes = await handleNewsletterSubmission({ email: "collector@example.com" });
    expect(goodRes.success).toBe(true);
    expect(goodRes.message).toContain("Collectors Circle");
  });
});
