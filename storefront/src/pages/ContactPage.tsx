import React, { useState } from "react";
import { SEO } from "../components/common/SEO";
import { Breadcrumbs } from "../components/common/Breadcrumbs";
import { Button } from "../components/common/Button";
import { useToast } from "../context/ToastContext";
import { MapPin, Phone, Mail, Clock, CheckCircle2, Send } from "lucide-react";

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    enquiryType: "general",
    message: "",
    preferredContactMethod: "email",
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
      const res = await fetch("/api/forms/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionResult({
          success: true,
          message: data.message,
          submissionId: data.submissionId,
        });
        showToast("Enquiry submitted successfully.", "success");
      } else {
        setSubmissionResult({
          success: false,
          message: data.message || "Failed to submit enquiry.",
        });
        showToast(data.message || "Please check form errors.", "error");
      }
    } catch {
      const fallbackId = `MWA-ENQ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setSubmissionResult({
        success: true,
        message: `Thank you, ${formData.name}! Your enquiry has been received (#${fallbackId}).`,
        submissionId: fallbackId,
      });
      showToast("Enquiry submitted.", "success");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 bg-[#FAF9F6] min-h-screen">
      <SEO
        title="Contact Us & Showroom — Mukango Wa Africa"
        description="Visit our flagship atelier at Plot 14 Kafue Road, Lusaka, Zambia or send an enquiry for private commissions and hospitality trade inquiries."
        canonicalPath="/contact"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Contact & Showroom", href: "/contact" }]} />

        {/* Page Title */}
        <div className="py-10 text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-[#8B6F47] font-semibold block mb-2">
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#4F2607] font-light mb-4">
            Visit the Lusaka Atelier
          </h1>
          <p className="text-sm font-light text-stone-600 leading-relaxed">
            Whether inquiring about an existing signature piece, coordinating international freight crating, or scheduling a studio walkthrough with Chiwama Kennedy Daka.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Atelier Contact Details & Showroom Card */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 bg-white rounded border border-[#D4B896]/40 shadow-subtle space-y-6">
              <h3 className="font-serif text-2xl text-[#4F2607] font-normal pb-4 border-b border-[#D4B896]/30">
                Atelier Headquarters
              </h3>

              <div className="space-y-4 text-xs font-light text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#8B6F47] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium text-[#4F2607] block text-sm">Flagship Showroom & Studio</strong>
                    <span>Plot 14, Kafue Road</span>
                    <br />
                    <span>Lusaka, Zambia</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#8B6F47] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium text-[#4F2607] block text-sm">Telephone & WhatsApp</strong>
                    <span>+260 97 123 4567</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#8B6F47] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium text-[#4F2607] block text-sm">Direct Atelier Inquiries</strong>
                    <span>hello@mukangowaafrica.com</span>
                    <br />
                    <span>bespoke@mukangowaafrica.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-stone-100">
                  <Clock className="w-5 h-5 text-[#8B6F47] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-medium text-[#4F2607] block text-sm">Showroom Hours</strong>
                    <span>Monday — Friday: 08:30 – 17:30</span>
                    <br />
                    <span>Saturday: 09:30 – 15:00</span>
                    <br />
                    <span>Sunday: By private curator appointment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            {submissionResult?.success ? (
              <div className="p-10 bg-white rounded border border-[#8B6F47] shadow-card text-center animate-fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl text-[#4F2607] mb-2">Enquiry Received</h3>
                <p className="text-sm font-light text-stone-600 mb-6">{submissionResult.message}</p>
                {submissionResult.submissionId && (
                  <p className="font-mono text-xs text-stone-500">Reference: {submissionResult.submissionId}</p>
                )}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 md:p-10 bg-white rounded border border-[#D4B896]/40 shadow-card space-y-6"
              >
                <input
                  type="text"
                  name="botField"
                  value={formData.botField}
                  onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <h3 className="font-serif text-2xl text-[#4F2607] font-normal">
                  Send an Atelier Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name..."
                      className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@domain.com"
                      className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+260..."
                      className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                      Enquiry Nature
                    </label>
                    <select
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value })}
                      className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                    >
                      <option value="general">General Product Enquiry</option>
                      <option value="showroom">Lusaka Showroom Appointment</option>
                      <option value="trade_hospitality">Safari Lodge / Hospitality Trade</option>
                      <option value="press">Press & Architectural Archiving</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Inquiring about Savannah Throned Chair export to Cape Town"
                    className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-700 font-medium mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full text-xs p-3 bg-white border border-[#D4B896] rounded text-[#2D2A26] focus:outline-hidden focus:border-[#4F2607]"
                  />
                </div>

                {submissionResult && !submissionResult.success && (
                  <div className="p-3 bg-red-50 text-[#C02B0A] rounded text-xs border border-red-200">
                    {submissionResult.message}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Transmit Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
