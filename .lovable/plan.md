Add three new partner segments to the Partner with Us questionnaire so they appear as selectable cards in Step 1 (Type) on `/partner-with-us`.

## What changes

In `src/data/partnershipQuestions.ts`, append three new entries to the `PARTNER_TYPES` array (kept before the existing `other` entry so "Other Collaboration" stays last):

1. **Corporate Wellness / Occupational Health**
   - id: `corporate_wellness`
   - emoji: 🏃
   - tagline: "Wellness providers & occupational health companies serving employers"
   - Fields: company type (Corporate wellness provider / Occupational health services / OHC operator / Insurance-linked wellness), client base size, primary interest area (Screening camps, Ongoing monitoring, Executive health, On-site OHC kits), timeline.

2. **Diagnostic Labs / Home Sample Collection**
   - id: `diagnostic_lab`
   - emoji: 🧪
   - tagline: "Diagnostic chains & home-collection companies adding cardiac & vitals testing"
   - Fields: organisation type (Diagnostic lab chain / Standalone lab / Home sample collection company / Aggregator), coverage (Single city / Multi-city / Pan-India), monthly home-visit volume (number), primary interest (Add ECG & vitals to home visits / In-lab cardiac screening / White-label devices / Bulk procurement), timeline.

3. **Clinics / Nursing Homes / Small Hospitals**
   - id: `clinic_nursing_home`
   - emoji: 🏨
   - tagline: "Standalone clinics, nursing homes & small hospitals (< 100 beds)"
   - Fields: facility type (Standalone clinic / Polyclinic / Nursing home / Small hospital < 100 beds), bed/chair count (number), primary interest (In-clinic devices / Remote patient monitoring / Post-discharge monitoring / Bulk procurement), timeline.

All three follow the existing `PartnerType` shape and reuse the same `Field` types already supported by `PartnerWithUs.tsx`, so no UI/form-rendering code needs to change — the new cards auto-appear in Step 1 and their fields auto-render in Step 3.

## Files

- `src/data/partnershipQuestions.ts` — append 3 entries to `PARTNER_TYPES` before `other`.

No other files affected. No backend schema change (submissions store `partner_type` as free string + `answers` JSON).
