import React from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { BespokeForm } from "../components/bespoke/BespokeForm";
import { Compass, CheckCircle2, MessageSquare, Hammer, Eye } from "lucide-react";

export const BespokePage: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: <MessageSquare className="w-6 h-6 text-[#7A6039]" />,
      title: "Vision & Architectural Consultation",
      description:
        "Share your room dimensions, aesthetic preferences, timber choices, and functional needs with our design team.",
    },
    {
      number: "02",
      icon: <Compass className="w-6 h-6 text-[#7A6039]" />,
      title: "Concept Sketches & Wood Selection",
      description:
        "We draft 3D technical schematics and present physical cured hardwood grain samples from our Barotse concession stores.",
    },
    {
      number: "03",
      icon: <Hammer className="w-6 h-6 text-[#7A6039]" />,
      title: "Hand Carving & Studio Updates",
      description:
        "Our master carvers shape every curve using traditional gouges and mortise-tenon joinery, sharing weekly progress photography.",
    },
    {
      number: "04",
      icon: <Eye className="w-6 h-6 text-[#7A6039]" />,
      title: "ISPM-15 Crating & White-Glove Delivery",
      description:
        "Each commission is crated in certified protective timber crates and freighted worldwide with full transit insurance.",
    },
  ];

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Bespoke Commissions — Custom Hardwood Furniture"
        description="Commission bespoke solid hardwood dining tables, throned armchairs, and architectural panels tailored to your private residence or luxury lodge."
        canonicalPath="/bespoke"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Bespoke Commissions", href: "/bespoke" }]} />

        {/* Hero Section */}
        <div className="py-12 text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold block mb-2">
            Private Commissions
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#4F2607] font-light mb-6">
            Create Something Uniquely Yours
          </h1>
          <p className="text-base font-light text-stone-700 leading-relaxed">
            From 14-seater Zambezi Teak banquet tables to sculptural royal court thrones and lodge libraries, our atelier collaborates directly with discerning collectors, architects, and interior designers worldwide.
          </p>
        </div>

        {/* Process Steps */}
        <div className="mb-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-widest text-[#7A6039] font-medium block mb-1">
              Atelier Protocol
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#4F2607] font-light">
              The 4-Stage Commission Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="p-6 bg-white rounded border border-[#D4B896]/30 shadow-subtle flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-3xl font-light text-[#D4B896]">{step.number}</span>
                    <div className="p-2 rounded bg-[#F7F5F0]">{step.icon}</div>
                  </div>
                  <h3 className="font-serif text-lg text-[#4F2607] font-normal mb-2">{step.title}</h3>
                  <p className="text-xs font-light text-stone-600 leading-relaxed">{step.description}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-1 text-[11px] text-[#7A6039] font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Curator Approved</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bespoke Interactive Form */}
        <div className="mb-20">
          <BespokeForm />
        </div>
      </div>
    </div>
  );
};
