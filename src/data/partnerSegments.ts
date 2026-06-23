// Customer-segment landing content for the Partner with Us tile flow.
// Each segment renders via /partner/segments/:slug and CTAs deep-link into the
// questionnaire at /partner-with-us?type=<partnerTypeId>.

export interface PartnerSegment {
  slug: string;
  partnerTypeId: string; // maps to PARTNER_TYPES id in partnershipQuestions.ts
  emoji: string;
  title: string;
  shortTitle: string;
  tagline: string;
  heroDescription: string;
  whoItsFor: string[];
  services: { title: string; description: string }[];
  whyAgatsa: { title: string; description: string }[];
  outcomes: string[];
}

export const PARTNER_SEGMENTS: PartnerSegment[] = [
  {
    slug: "corporate-wellness",
    partnerTypeId: "corporate_wellness",
    emoji: "🏃",
    title: "Corporate Wellness & Occupational Health Companies",
    shortTitle: "Corporate Wellness / Occupational Health",
    tagline: "Add cardiac & metabolic screening to the programmes you run for employers.",
    heroDescription:
      "Plug Agatsa's portable medical-grade devices into your screening camps, ongoing monitoring programmes and on-site OHCs. Deliver hospital-grade ECG, vitals and metabolic insights to employees — with zero infrastructure on the client's side.",
    whoItsFor: [
      "Corporate wellness providers running pan-India camps",
      "Occupational health services & OHC operators",
      "Insurance-linked wellness programme operators",
      "Employee benefit and HR-tech platforms",
    ],
    services: [
      { title: "On-site screening camps", description: "12-lead ECG, blood pressure, SpO₂, sugar readings and BMI captured in under 5 minutes per employee — no electrodes, no gel, no technician needed." },
      { title: "Ongoing monitoring programmes", description: "Give high-risk employees an at-home device and route their readings into your existing wellness dashboard via our API." },
      { title: "Executive health packages", description: "Add a take-home Agatsa device to premium executive packages as a year-round preventive cardiology tool." },
      { title: "Anonymised aggregate reports", description: "HR-friendly population-level dashboards: risk distribution, hypertension prevalence, follow-up rates — without exposing individual data." },
    ],
    whyAgatsa: [
      { title: "Medical-grade, not wearable-grade", description: "Clinically validated against hospital ECGs and concordant with reference devices on 1.5Cr+ records." },
      { title: "Camp throughput", description: "One device handles 80–120 employees per day. No setup time between participants." },
      { title: "White-label friendly", description: "Reports, PDFs and the patient app can carry your brand." },
    ],
    outcomes: [
      "Higher screening completion vs. traditional camp setups",
      "Real cardiac data, not just lifestyle questionnaires",
      "A clear next-step pathway for flagged employees",
    ],
  },
  {
    slug: "diagnostic-labs",
    partnerTypeId: "diagnostic_lab",
    emoji: "🧪",
    title: "Diagnostic Labs & Home Sample Collection Companies",
    shortTitle: "Diagnostic Labs / Home Collection",
    tagline: "Turn every home visit into a cardiac + vitals touchpoint.",
    heroDescription:
      "Your phlebotomist is already at the patient's home. With one pocket-sized Agatsa device, the same visit captures a 12-lead ECG, blood pressure, SpO₂, sugar reading and a basic vitals report — opening an entirely new revenue line on top of the blood draw.",
    whoItsFor: [
      "Diagnostic lab chains (national & regional)",
      "Standalone labs adding home services",
      "Home sample collection companies",
      "Lab and at-home test aggregators",
    ],
    services: [
      { title: "Add ECG & vitals to home visits", description: "Equip phlebotomists with a single device that adds a 12-lead ECG + vitals panel to any home blood collection — no extra training day required." },
      { title: "In-lab cardiac screening", description: "Walk-in patients get an ECG and a vitals report in under 3 minutes, reported by your in-house physician or our reviewer network." },
      { title: "White-label devices & reports", description: "Co-branded devices and PDF reports carrying your lab's identity." },
      { title: "Bulk procurement & lease", description: "CapEx or per-test models for fleets of 50+ devices, with replacement SLAs." },
    ],
    whyAgatsa: [
      { title: "One device, many tests", description: "ECG, BP, SpO₂, sugar reading, heart rate — replaces 3–4 separate instruments your collection agent would otherwise carry." },
      { title: "Phlebotomist-friendly", description: "Trained in under 30 minutes. No electrode placement skill required." },
      { title: "API into your LIMS", description: "Reports flow into your existing lab information system as structured data + PDF." },
    ],
    outcomes: [
      "New per-visit revenue with no extra logistics cost",
      "Higher cart value on home test bookings",
      "A stickier patient relationship beyond one-time blood tests",
    ],
  },
  {
    slug: "clinics-nursing-homes",
    partnerTypeId: "clinic_nursing_home",
    emoji: "🏨",
    title: "Clinics, Nursing Homes & Small Hospitals",
    shortTitle: "Clinics / Nursing Homes / Small Hospitals",
    tagline: "Hospital-grade cardiac monitoring without the hospital-grade footprint.",
    heroDescription:
      "Standalone clinics, polyclinics, nursing homes and sub-100-bed hospitals get the same medical-grade ECG and vitals capability that large hospitals use — without the infrastructure, the trolley-sized machine, or the dedicated tech.",
    whoItsFor: [
      "Standalone GP and specialist clinics",
      "Polyclinics and OPD-only setups",
      "Nursing homes and maternity homes",
      "Small hospitals (under 100 beds)",
    ],
    services: [
      { title: "In-clinic devices", description: "A pocket ECG + vitals device at every consultation room. Capture, review and store ECGs alongside the patient's record in seconds." },
      { title: "Remote patient monitoring", description: "Send patients home with a device after consultation. Their readings come back to your clinic dashboard in real time." },
      { title: "Post-discharge monitoring", description: "For nursing-home discharges and post-procedure follow-ups — catch deterioration before it becomes a readmission." },
      { title: "Bulk procurement", description: "Multi-unit pricing, AMC and replacement plans for facility-wide rollouts." },
    ],
    whyAgatsa: [
      { title: "No infrastructure change", description: "Battery powered, smartphone connected. Works in any consult room, any bed, any home." },
      { title: "Built for Indian conditions", description: "Designed for the realities of small hospitals — load shedding, mixed-skill staff, paper-first workflows." },
      { title: "Doctor-reviewable in seconds", description: "Every ECG is reviewable on a phone or laptop, signable and shareable as a clinical PDF." },
    ],
    outcomes: [
      "Cardiac capability at every consult, not just specialist visits",
      "Earlier detection of arrhythmias and post-op events",
      "A new monitoring revenue line beyond OPD fees",
    ],
  },
];

export const PARTNER_SEGMENT_BY_SLUG = Object.fromEntries(
  PARTNER_SEGMENTS.map((s) => [s.slug, s])
);
