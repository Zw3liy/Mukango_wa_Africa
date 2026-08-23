export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  enquiryType: "general" | "showroom" | "trade_hospitality" | "press";
  preferredContactMethod?: "email" | "phone" | "whatsapp";
  botField?: string; // honeypot
}

export interface BespokeCommissionFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  pieceType: "dining_table" | "statement_chair" | "credenza_console" | "canopy_bed" | "custom_sculpture" | "architectural_panel" | "other";
  preferredTimber: string;
  dimensionsEstimate?: string;
  intendedSpace?: "private_residence" | "luxury_safari_lodge" | "hotel_resort" | "corporate_office" | "embassy";
  motifPreference?: string;
  budgetRangeUsd: "under_3000" | "3000_7500" | "7500_15000" | "15000_plus";
  targetDeliveryDate?: string;
  projectDescription: string;
  hasSketchesOrFloorPlan?: boolean;
  botField?: string; // honeypot
}

export interface NewsletterFormData {
  email: string;
  interests?: string[];
  botField?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  submissionId?: string;
  receivedAt?: string;
  errors?: Record<string, string>;
  isConfigurationFailure?: boolean;
}
