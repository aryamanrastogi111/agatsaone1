// Partnership questionnaire catalog.
// Edit copy here without touching DB. Follows Agatsa terminology rules:
// no "glucose", no ECG framing for Rhythm, exclude CDSCO/BIS in UI.

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "url"
  | "number"
  | "select"
  | "multiselect"
  | "radio";

export interface Field {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  help?: string;
  min?: number;
}

export interface PartnerType {
  id: string;
  label: string;
  tagline: string;
  emoji: string;
  fields: Field[];
}

export const PARTNER_TYPES: PartnerType[] = [
  {
    id: "hospital",
    label: "Hospital / Clinic Group",
    tagline: "Remote patient monitoring, post-discharge, preventive cardiology",
    emoji: "🏥",
    fields: [
      { id: "facility_type", label: "Type of facility", type: "select", required: true, options: ["Single clinic", "Multi-specialty hospital", "Hospital chain", "Diagnostic centre"] },
      { id: "timeline", label: "Timeline", type: "radio", required: true, options: ["Immediate (< 1 month)", "1–3 months", "3–6 months", "Just exploring"] },
    ],
  },
  {
    id: "corporate",
    label: "Corporate / Employee Wellness",
    tagline: "Screening camps, ongoing monitoring, executive health",
    emoji: "🏢",
    fields: [
      { id: "company_size", label: "Company size", type: "select", required: true, options: ["Small (< 100)", "Mid (100–1,000)", "Large (1,000+)"] },
      { id: "interest_area", label: "Primary interest area", type: "multiselect", required: true, options: ["On-site screening camps", "Ongoing monitoring programme", "Executive health packages", "Insurance-linked wellness"] },
      { id: "timeline", label: "Timeline", type: "radio", required: true, options: ["Within 30 days", "1–3 months", "3–6 months", "Just exploring"] },
    ],
  },
  {
    id: "doctor",
    label: "Doctor / Independent Clinic",
    tagline: "Provider network, referral programme, in-clinic devices",
    emoji: "🩺",
    fields: [
      { id: "speciality", label: "Speciality", type: "select", required: true, options: ["Cardiology", "Diabetology / Endocrinology", "General Physician", "Internal Medicine", "Preventive / Wellness", "Other"] },
      { id: "interest", label: "What interests you?", type: "multiselect", required: true, options: ["Join Agatsa Provider Network", "Stock devices in clinic", "Patient referral programme", "Remote patient monitoring"] },
    ],
  },
  {
    id: "distributor",
    label: "Distributor / Reseller",
    tagline: "Territory-wise distribution (India & International)",
    emoji: "📦",
    fields: [
      { id: "territory_type", label: "Territory", type: "radio", required: true, options: ["India — single state", "India — multi-state", "India — pan-India", "International"] },
      { id: "territory", label: "Specific region / country", type: "text", required: true, placeholder: "e.g. Maharashtra, UAE, SE Asia" },
    ],
  },
  {
    id: "ngo",
    label: "NGO / Government / CSR",
    tagline: "Public health programmes, screening initiatives",
    emoji: "🤝",
    fields: [
      { id: "programme_focus", label: "Programme focus", type: "textarea", required: true, placeholder: "e.g. rural cardiac screening in Maharashtra" },
      { id: "geography", label: "Geography", type: "text", placeholder: "States / districts" },
    ],
  },
  {
    id: "academic",
    label: "Academic / Research",
    tagline: "Clinical studies, validation, publications",
    emoji: "🔬",
    fields: [
      { id: "institution", label: "Institution name", type: "text", required: true },
      { id: "research_focus", label: "Research focus", type: "textarea", required: true },
    ],
  },
  {
    id: "investor",
    label: "Investor / Strategic",
    tagline: "Funding, M&A, strategic partnerships",
    emoji: "📈",
    fields: [
      { id: "fund_name", label: "Fund / company name", type: "text", required: true },
      { id: "stage_focus", label: "Stage focus", type: "select", required: true, options: ["Seed", "Series A", "Series B+", "Growth / PE", "Strategic / Corporate"] },
    ],
  },

  {
    id: "corporate_wellness",
    label: "Corporate Wellness / Occupational Health",
    tagline: "Wellness providers & occupational health companies serving employers",
    emoji: "🏃",
    fields: [
      { id: "company_type", label: "Company type", type: "select", required: true, options: ["Corporate wellness provider", "Occupational health services", "OHC operator", "Insurance-linked wellness"] },
      { id: "client_base_size", label: "Client base size", type: "select", required: true, options: ["< 10 employers", "10–50 employers", "50+ employers"] },
      { id: "interest_area", label: "Primary interest area", type: "multiselect", required: true, options: ["On-site screening camps", "Ongoing monitoring programme", "Executive health packages", "On-site OHC kits"] },
      { id: "timeline", label: "Timeline", type: "radio", required: true, options: ["Within 30 days", "1–3 months", "3–6 months", "Just exploring"] },
    ],
  },
  {
    id: "diagnostic_lab",
    label: "Diagnostic Labs / Home Sample Collection",
    tagline: "Diagnostic chains & home-collection companies adding cardiac & vitals testing",
    emoji: "🧪",
    fields: [
      { id: "organisation_type", label: "Organisation type", type: "select", required: true, options: ["Diagnostic lab chain", "Standalone lab", "Home sample collection company", "Aggregator"] },
      { id: "coverage", label: "Coverage", type: "radio", required: true, options: ["Single city", "Multi-city", "Pan-India"] },
      { id: "monthly_home_visits", label: "Monthly home-visit volume", type: "number", placeholder: "e.g. 500", min: 0 },
      { id: "interest_area", label: "Primary interest", type: "multiselect", required: true, options: ["Add ECG & vitals to home visits", "In-lab cardiac screening", "White-label devices", "Bulk procurement"] },
      { id: "timeline", label: "Timeline", type: "radio", required: true, options: ["Within 30 days", "1–3 months", "3–6 months", "Just exploring"] },
    ],
  },
  {
    id: "clinic_nursing_home",
    label: "Clinics / Nursing Homes / Small Hospitals",
    tagline: "Standalone clinics, nursing homes & small hospitals (< 100 beds)",
    emoji: "🏨",
    fields: [
      { id: "facility_type", label: "Facility type", type: "select", required: true, options: ["Standalone clinic", "Polyclinic", "Nursing home", "Small hospital (< 100 beds)"] },
      { id: "bed_count", label: "Bed / chair count", type: "number", placeholder: "e.g. 20", min: 0 },
      { id: "interest_area", label: "Primary interest", type: "multiselect", required: true, options: ["In-clinic devices", "Remote patient monitoring", "Post-discharge monitoring", "Bulk procurement"] },
      { id: "timeline", label: "Timeline", type: "radio", required: true, options: ["Within 30 days", "1–3 months", "3–6 months", "Just exploring"] },
    ],
  },

  {
    id: "other",
    label: "Other Collaboration",
    tagline: "Something else in mind?",
    emoji: "💡",
    fields: [
      { id: "idea", label: "Tell us what you have in mind", type: "textarea", required: true, placeholder: "Describe your collaboration idea" },
    ],
  },

];

export const PARTNER_TYPE_BY_ID = Object.fromEntries(
  PARTNER_TYPES.map((p) => [p.id, p])
);

export const HEARD_FROM_OPTIONS = [
  "Google search",
  "Social media",
  "News article / press",
  "Doctor / hospital reference",
  "Existing customer",
  "Conference / event",
  "Other",
];
