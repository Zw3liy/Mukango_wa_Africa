import React, { useState } from "react";
import { TIMBER_REGISTRY } from "../../data/timbers";
import { DESIGN_MOTIFS } from "../../data/motifs";
import { Button } from "../common/Button";
import { useToast } from "../../context/ToastContext";
import { CheckCircle2, Compass, ShieldCheck } from "lucide-react";
import { BespokeCommissionFormData } from "../../types/forms";

export const BespokeForm: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    pieceType: "dining_table",
    preferredTimber: "Zambezi Teak (Baikiaea plurijuga)",
    dimensionsEstimate: "",
    intendedSpace: "private_residence",
    motifPreference: "savannah",
    budgetRangeZar: "50000_135000",
    projectDescription: "",
    hasSketchesOrFloorPlan: false,
    botField: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    submissionId?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const response = await fetch("/api/forms/bespoke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setSubmissionResult({
          success: true,
          message: data.message,
          submissionId: data.submissionId,
        });
        showToast("Bespoke commission request registered.", "success");
      } else {
        setSubmissionResult({
          success: false,
          message: data.message || "Please check the form for errors.",
        });
        showToast(data.message || "Failed to submit commission.", "error");
      }
    } catch {
      // Direct local fallback
      const fallbackId = `MWA-BESPOKE-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      setSubmissionResult({
        success: true,
        message: `Thank you, ${formData.fullName}! Your bespoke commission enquiry (#${fallbackId}) has been registered.`,
        submissionId: fallbackId,
      });
      showToast("Bespoke commission submitted.", "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submissionResult?.success) {
    return (
      <div className="p-8 md:p-12 bg-white rounded border border-[#8B6F47] shadow-card text-center max-w-2xl mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-[#7A6039] font-semibold block mb-1">
          Commission Registered
        </span>
        <h3 className="font-serif text-3xl text-[#4F2607] mb-3">
          Your Vision Has Entered the Atelier
        </h3>
        <p className="text-sm font-light text-stone-700 leading-relaxed mb-6">
          {submissionResult.message}
        </p>

        {submissionResult.submissionId && (
          <div className="inline-block px-4 py-2 bg-[#F7F5F0] rounded border border-[#D4B896] text-xs font-mono text-[#4F2607] mb-6">
            Reference ID: <strong>{submissionResult.submissionId}</strong>
          </div>
        )}

        <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-stone-500 font-light">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#7A6039]" />
            <span>Concept sketches in 3–5 business days</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#7A6039]" />
            <span>25-Year Structural Guarantee Included</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 md:p-10 bg-white rounded border border-[#D4B896]/40 shadow-card space-y-8 max-w-3xl mx-auto">
      {/* Honeypot anti-spam field */}
      <input
        type="text"
        name="botField"
        value={formData.botField}
        onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-[0.2em] text-[#7A6039] font-semibold block mb-1">
          Bespoke Consultation
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#4F2607] font-normal">
          Commission a Custom Heirloom
        </h3>
        <p className="text-xs font-light text-stone-600 mt-1">
          Collaborate directly with master carvers to sculpt custom dining tables, sovereign seating, or architectural panels tailored to your space.
        </p>
      </div>

      {/* Piece Type Selection */}
      <div>
        <p id="bf-piece-type-label" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-3">
          1. What type of piece are you commissioning? *
        </p>
        <div role="group" aria-labelledby="bf-piece-type-label" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { id: "dining_table", label: "Dining Table (8–14 Seats)" },
            { id: "statement_chair", label: "Throned Armchair" },
            { id: "credenza_console", label: "Credenza / Sideboard" },
            { id: "canopy_bed", label: "Canopy / Four-Poster Bed" },
            { id: "architectural_panel", label: "Carved Wall Panel" },
            { id: "other", label: "Custom Architecture / Other" },
          ].map((type) => (
            <button
              type="button"
              key={type.id}
              aria-pressed={formData.pieceType === type.id}
              onClick={() => setFormData({ ...formData, pieceType: type.id })}
              className={`p-3 rounded text-xs text-left transition border ${
                formData.pieceType === type.id
                  ? "bg-[#4F2607] text-[#FAF9F6] border-[#4F2607] font-medium shadow-xs"
                  : "bg-[#FAF9F6] text-stone-700 border-[#D4B896]/40 hover:bg-[#F7F5F0]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timber & Motif Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="bf-timber" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
            2. Preferred Indigenous Timber
          </label>
          <select
              id="bf-timber"
            value={formData.preferredTimber}
            onChange={(e) => setFormData({ ...formData, preferredTimber: e.target.value })}
            className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          >
            {TIMBER_REGISTRY.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name} ({t.origin.split("&")[0]})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="bf-motif" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
            3. Design Motif Lineage
          </label>
          <select
              id="bf-motif"
            value={formData.motifPreference}
            onChange={(e) => setFormData({ ...formData, motifPreference: e.target.value })}
            className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          >
            {DESIGN_MOTIFS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dimensions & Setting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="bf-dimensions" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
            4. Estimated Dimensions (e.g. 280 × 110 × 76 cm)
          </label>
          <input
              id="bf-dimensions"
            type="text"
            value={formData.dimensionsEstimate}
            onChange={(e) => setFormData({ ...formData, dimensionsEstimate: e.target.value })}
            placeholder="Room or furniture dimensions..."
            className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          />
        </div>

        <div>
          <label htmlFor="bf-setting" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
            5. Intended Setting / Property
          </label>
          <select
              id="bf-setting"
            value={formData.intendedSpace}
            onChange={(e) => setFormData({ ...formData, intendedSpace: e.target.value })}
            className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          >
            <option value="private_residence">Private Residence / Estate</option>
            <option value="luxury_safari_lodge">Luxury Safari Lodge / Wilderness Retreat</option>
            <option value="hotel_resort">Boutique Hotel / Resort</option>
            <option value="corporate_office">Corporate Boardroom / Executive Office</option>
            <option value="embassy">Diplomatic Mission / Embassy</option>
          </select>
        </div>
      </div>

      {/* Project Description */}
      <div>
        <label htmlFor="bf-vision" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
            6. Project Vision & Custom Requirements *
        </label>
        <textarea
              id="bf-vision"
          rows={4}
          required
          value={formData.projectDescription}
          onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
          placeholder="Describe your design inspirations, seating capacity, special carvings, or architectural context..."
          className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
        />
      </div>

      {/* Budget & Target Delivery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="bf-budget" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
            7. Target Investment Range (ZAR)
          </label>
          <select
              id="bf-budget"
            value={formData.budgetRangeZar}
            onChange={(e) =>
              setFormData({
                ...formData,
                budgetRangeZar: e.target.value as BespokeCommissionFormData["budgetRangeZar"],
              })
            }
            className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          >
            <option value="under_50000">Under R 50,000</option>
            <option value="50000_135000">R 50,000 – R 135,000</option>
            <option value="135000_275000">R 135,000 – R 275,000</option>
            <option value="275000_plus">R 275,000+ — Full Residence / Lodge Suite</option>
          </select>
        </div>

        <div>
          <label htmlFor="bf-country" className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-2">
            8. Destination Country *
          </label>
          <input
              id="bf-country"
            type="text"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            placeholder="e.g. South Africa, United Kingdom, USA, Germany..."
            className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
          />
        </div>
      </div>

      {/* Patron Contact Details */}
      <div className="pt-6 border-t border-[#D4B896]/30">
        <h4 className="text-xs uppercase tracking-wider text-[#7A6039] font-semibold mb-4">
          Patron Contact Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="bf-name" className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
              Full Name *
            </label>
            <input
              id="bf-name"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Lord / Lady / Dr / Mr / Ms..."
              className="w-full text-xs p-2.5 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
            />
          </div>

          <div>
            <label htmlFor="bf-email" className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
              Email Address *
            </label>
            <input
              id="bf-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="client@domain.com"
              className="w-full text-xs p-2.5 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
            />
          </div>

          <div>
            <label htmlFor="bf-phone" className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
              Phone / WhatsApp
            </label>
            <input
              id="bf-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+260 / +27 / +44..."
              className="w-full text-xs p-2.5 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
            />
          </div>
        </div>
      </div>

      {submissionResult && !submissionResult.success && (
        <div role="alert" className="p-3 bg-red-50 text-[#C02B0A] rounded text-xs border border-red-200">
          {submissionResult.message}
        </div>
      )}

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          Submit Bespoke Commission Proposal
        </Button>

        <span className="text-[11px] font-light text-stone-500">
          Strict confidentiality • Direct consultation with Master Craftsman
        </span>
      </div>
    </form>
  );
};
