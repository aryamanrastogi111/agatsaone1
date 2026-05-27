## Simplify partnership enquiry questionnaires

Trim the per-partner-type questionnaire in `src/data/partnershipQuestions.ts` so people aren't asked operational/sensitive numbers upfront. Keep only essentials needed to triage the lead — the rest can be asked on the first call.

The shared fields on the form (organisation name, contact, email, phone, goal description, consent) stay as-is. Only the **type-specific questionnaire** below each partner type changes.

### New (simplified) field sets

**Hospital / Clinic Group**

- Type of facility (Single clinic / Multi-specialty hospital / Hospital chain / Diagnostic centre) — required
- Timeline (Immediate / 1–3 months / 3–6 months / Just exploring) — required
- *Removed: number of beds, monthly OPD volume, current solution, devices of interest, integration needs,* Departments interested (multiselect: Cardiology, Diabetology, Preventive Health, Post-discharge, ICU/CCU, OPD) 

**Corporate / Employee Wellness**

- Company size (Small <100 / Mid 100–1,000 / Large 1,000+) — required
- Primary interest (multiselect: Screening camps, Ongoing monitoring, Executive health, Insurance-linked) — required
- Timeline (Within 30 days / 1–3 months / 3–6 months / Just exploring) — required
- *Removed: number of locations, current vendor, indicative budget*

**Doctor / Independent Clinic**

- Speciality — required
- What interests you (multiselect: Join Provider Network, Stock devices, Referral programme, Remote monitoring) — required
- *Removed: years in practice, monthly patient volume*

**Distributor / Reseller**

- Territory (India single state / India multi-state / India pan-India / International) — required
- Specific region / country — required
- *Removed: current portfolio, years distributing, indicative volume, GST, import licence*

**NGO / Government / CSR**

- Programme focus (short textarea) — required
- Geography (states/districts) — optional
- *Removed: beneficiaries, funding source, timeline*

**Academic / Research**

- Institution name — required
- Research focus (textarea) — required
- *Removed: sample size, ethics approval, publication intent*

**Investor / Strategic**

- Fund / company name — required
- Stage focus (Seed / Series A / Series B+ / Growth-PE / Strategic) — required
- *Removed: cheque size, prior healthtech investments*

**Other Collaboration** — unchanged (single "tell us what you have in mind" textarea).

### Implementation

Single file change: `src/data/partnershipQuestions.ts` — rewrite the `fields` arrays for each `PartnerType` per the above. No DB changes, no edge-function changes (the function already accepts whatever `questionnaire_answers` array is sent). The admin Partnerships page renders answers dynamically, so it adapts automatically.

### Result

Hospital form drops from 7 questions to 3, corporate from 6 to 3, distributor from 7 to 2, etc. — should feel ~60% lighter while still giving the team enough signal to score and prioritise.