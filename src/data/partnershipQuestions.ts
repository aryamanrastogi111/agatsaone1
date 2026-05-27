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
