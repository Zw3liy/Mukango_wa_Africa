import React from "react";
import { SEO } from "../components/common/SEO";
import { HeroSection } from "../components/home/HeroSection";
import { FeaturedCollection } from "../components/home/FeaturedCollection";
import { MotifsSection } from "../components/home/MotifsSection";
import { CraftsmanshipSection } from "../components/home/CraftsmanshipSection";
import { TestimonialsSection } from "../components/home/TestimonialsSection";
import { JournalPreview } from "../components/home/JournalPreview";
import { ShowroomSection } from "../components/home/ShowroomSection";
import { generateOrganizationJsonLd } from "../utils/seo";

interface HomePageProps {
  onNavigate?: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <>
      <SEO
        title="Mukango Wa Africa — Heirloom Handcrafted Furniture"
        description="Hand-carved African hardwood furniture bridging Zambian artisanal mastery with contemporary design. Handcrafted from sustainable Zambezi Teak and Mukwa."
        canonicalPath="/"
        jsonLd={generateOrganizationJsonLd()}
      />

      <HeroSection onNavigate={onNavigate} />
      <FeaturedCollection onNavigate={onNavigate} />
      <MotifsSection onNavigate={onNavigate} />
      <CraftsmanshipSection onNavigate={onNavigate} />
      <TestimonialsSection />
      <JournalPreview onNavigate={onNavigate} />
      <ShowroomSection onNavigate={onNavigate} />
    </>
  );
};
