import React from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Privacy Policy — Mukango Wa Africa"
        description="Our commitment to safeguarding patron data, order specifications, and private commission communications."
        canonicalPath="/privacy"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Privacy Policy", href: "/privacy" }]} />

        <div className="py-12">
          <h1 className="font-serif text-4xl text-[#4F2607] font-light mb-4">Privacy Policy</h1>
          <p className="text-xs text-stone-500 font-mono mb-8">Effective Date: January 1, 2026</p>

          <div className="prose prose-stone space-y-6 text-sm font-light text-stone-700 leading-relaxed bg-white p-8 md:p-10 rounded border border-[#D4B896]/30">
            <h3 className="font-serif text-lg text-[#4F2607]">1. Introduction</h3>
            <p>
              Mukango Wa Africa ("we", "us", or "our") respects the privacy of our patrons and collectors. This Privacy Policy explains how we collect, utilize, and safeguard your personal information when visiting our website or engaging with our atelier for bespoke commissions.
            </p>

            <h3 className="font-serif text-lg text-[#4F2607]">2. Information We Collect</h3>
            <p>
              We collect information you explicitly provide when submitting bespoke commission requests, placing orders, subscribing to our Collectors Circle journal, or contacting our Lusaka showroom. This includes name, delivery address, email, phone number, and architectural project notes.
            </p>

            <h3 className="font-serif text-lg text-[#4F2607]">3. Payment Processing & Security</h3>
            <p>
              Payment transactions are processed securely through certified PCI-DSS compliant gateways (such as Stripe or PayFast) or direct SWIFT bank wire. We never store or retain raw credit card numbers or banking secrets on our servers.
            </p>

            <h3 className="font-serif text-lg text-[#4F2607]">4. Contact & Inquiries</h3>
            <p>
              If you have any questions regarding your data, please contact our data controller at <code>privacy@mukangoafrica.co.za</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
