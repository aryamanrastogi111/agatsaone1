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
      { id: "beds", label: "Number of beds", type: "select", required: true, options: ["< 50", "50–200", "200–500", "500+"] },
      { id: "departments", label: "Departments interested", type: "multiselect", required: true, options: ["Cardiology", "Diabetology / Endocrinology", "Preventive Health", "Post-discharge / Home care", "ICU / CCU", "OPD / General Medicine"] },
      { id: "opd_volume", label: "Monthly OPD volume", type: "select", options: ["< 1,000", "1,000–5,000", "5,000–20,000", "20,000+"] },
      { id: "current_solution", label: "Current remote monitoring solution (if any)", type: "text", placeholder: "None / In-house / Vendor name" },
      { id: "devices", label: "Devices of interest", type: "multiselect", options: ["SanketLife ECG", "EasyTouch Wellness", "EasyTouch Rhythm", "Smart Scale", "Nera AI platform"] },
      { id: "timeline", label: "Timeline", type: "radio", required: true, options: ["Immediate (< 1 month)", "1–3 months", "3–6 months", "Just exploring"] },
      { id: "integration", label: "Integration needs", type: "select", options: ["HIS / EMR integration required", "No integration needed", "Not sure yet"] },
    ],
  },
  {
    id: "corporate",
    label: "Corporate / Employee Wellness",
    tagline: "Screening camps, ongoing monitoring, executive health",
    emoji: "🏢",
    fields: [
      { id: "employees", label: "Number of employees", type: "select", required: true, options: ["< 100", "100–500", "500–2,000", "2,000–10,000", "10,000+"] },
      { id: "locations", label: "Number of office locations", type: "text", placeholder: "e.g. 3 cities, 5 offices" },
      { id: "current_vendor", label: "Current wellness vendor (if any)", type: "text" },
      { id: "interest_area", label: "Primary interest area", type: "multiselect", required: true, options: ["On-site screening camps", "Ongoing monitoring programme", "Executive health packages", "Insurance-linked wellness"] },
      { id: "budget", label: "Indicative annual budget", type: "select", options: ["< ₹5 L", "₹5–25 L", "₹25 L–1 Cr", "₹1 Cr+", "Not decided"] },
      { id: "start_date", label: "Target start date", type: "select", options: ["Within 30 days", "1–3 months", "3–6 months", "Just exploring"] },
    ],
  },
  {
    id: "doctor",
    label: "Doctor / Independent Clinic",
    tagline: "Provider network, referral programme, in-clinic devices",
    emoji: "🩺",
    fields: [
      { id: "speciality", label: "Speciality", type: "select", required: true, options: ["Cardiology", "Diabetology / Endocrinology", "General Physician", "Internal Medicine", "Preventive / Wellness", "Other"] },
      { id: "experience", label: "Years in practice", type: "select", options: ["< 5", "5–15", "15–25", "25+"] },
      { id: "patient_volume", label: "Monthly patient volume", type: "select", options: ["< 100", "100–500", "500–1,500", "1,500+"] },
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
      { id: "current_portfolio", label: "Current product portfolio", type: "textarea", placeholder: "Brands & categories you currently distribute" },
      { id: "years_in_distribution", label: "Years distributing medical devices", type: "select", options: ["< 2", "2–5", "5–10", "10+"] },
      { id: "volume_capability", label: "Indicative monthly order volume", type: "select", options: ["< 50 units", "50–200 units", "200–1,000 units", "1,000+ units"] },
      { id: "gst", label: "Do you have GST registration?", type: "radio", required: true, options: ["Yes", "No / Not applicable (international)"] },
      { id: "import_license", label: "Import / export licences (for international)", type: "text", placeholder: "Optional" },
    ],
  },
  {
    id: "ngo",
    label: "NGO / Government / CSR",
    tagline: "Public health programmes, screening initiatives",
    emoji: "🤝",
    fields: [
      { id: "programme_focus", label: "Programme focus", type: "textarea", required: true, placeholder: "e.g. rural cardiac screening in Maharashtra" },
      { id: "beneficiaries", label: "Expected beneficiaries", type: "select", options: ["< 1,000", "1,000–10,000", "10,000–100,000", "100,000+"] },
      { id: "funding_source", label: "Funding source", type: "select", options: ["CSR", "Government grant", "Donor funded", "Self-funded", "Mixed"] },
      { id: "geography", label: "Geography", type: "text", placeholder: "States / districts" },
      { id: "timeline", label: "Deployment timeline", type: "select", options: ["< 1 month", "1–3 months", "3–6 months", "6+ months"] },
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
      { id: "sample_size", label: "Expected sample size", type: "select", options: ["< 50", "50–200", "200–1,000", "1,000+"] },
      { id: "ethics", label: "Ethics committee approval", type: "radio", options: ["Already approved", "Submitted, awaiting approval", "Not yet submitted"] },
      { id: "publication", label: "Publication intent", type: "select", options: ["Peer-reviewed journal", "Conference presentation", "Internal use only", "Not decided"] },
    ],
  },
  {
    id: "investor",
    label: "Investor / Strategic",
    tagline: "Funding, M&A, strategic partnerships",
    emoji: "📈",
    fields: [
      { id: "fund_name", label: "Fund / company name", type: "text", required: true },
      { id: "stage_focus", label: "Stage focus", type: "select", options: ["Seed", "Series A", "Series B+", "Growth / PE", "Strategic / Corporate"] },
      { id: "cheque_size", label: "Typical cheque size", type: "select", options: ["< $500K", "$500K–$2M", "$2M–$10M", "$10M+"] },
      { id: "prior_healthtech", label: "Prior healthtech investments", type: "textarea", placeholder: "Notable portfolio companies (optional)" },
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
