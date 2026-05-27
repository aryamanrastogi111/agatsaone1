## Goal

Build a professional partnership / collaboration enquiry system — parallel in quality to the support ticket system — for hospitals, corporates, doctors/clinics, distributors, NGOs, academic partners, and "other / general collaboration". Public-facing multi-step questionnaire on a dedicated page, dual confirmation emails, and a full admin console where the team can qualify, reply, and track outcomes.

## Customer Flow (`/partner-with-us`)

A guided, conversion-optimised multi-step form (not a single long form). Wizard with progress bar, "Back / Next", autosave to localStorage.

**Step 1 — Who you are**
Type chips (single select), each opens a tailored questionnaire:
- Hospital / Clinic Group
- Corporate (employee wellness)
- Doctor / Independent Clinic
- Distributor / Reseller (India + International split)
- NGO / Government / CSR
- Academic / Research
- Investor / Strategic
- Other collaboration

**Step 2 — About your organisation** (common)
Organisation name, website, country, state, city, your name, designation, work email (validated, no free-mail warning for B2B types), phone (+91 default), how you heard about Agatsa.

**Step 3 — Tailored questionnaire** (varies by type)

- **Hospital / Clinic** — number of beds, departments interested (cardiology, diabetology, preventive health, post-discharge, ICU, OPD), monthly OPD volume, current remote monitoring solution, devices of interest (multi-select from SKU catalog), timeline (immediate / 1–3 mo / 3–6 mo / exploring), integration needs (HIS/EMR, none).
- **Corporate** — number of employees, locations, current wellness vendor, interest area (screening camps, ongoing monitoring, executive health, insurance-linked), budget band, target start date.
- **Doctor / Clinic** — speciality, years in practice, monthly patient volume, interest (provider network / device reseller / referral programme / remote patient monitoring), city.
- **Distributor** — territory, current portfolio, years in medical device distribution, order volume capability, GST / import-export licences (yes/no).
- **NGO / Govt / CSR** — programme focus, beneficiary count, funding source, geography, deployment timeline.
- **Academic** — institution, research focus, sample size, ethics approval status, publication intent.
- **Investor** — fund name, stage focus, cheque size band, prior healthtech investments.
- **Other** — free text "tell us what you have in mind".

**Step 4 — Your goals & message**
Short text: "What outcome are you hoping for?" (min 30 chars), optional file upload (deck, RFP, brochure), preferred contact method (email / phone / WhatsApp), preferred contact window.

**Step 5 — Review & submit**
Summary of all answers, consent checkbox ("I agree Agatsa may contact me about this enquiry"), submit.

**Success screen**
Enquiry ID (e.g. `AGT-PRT-2026-00012`), "we typically respond within 2 business days", what to expect next, link to relevant case studies / brochures based on type.

**Lookup**: same page tab "Check my enquiry status" → enquiry ID + email → status + any reply summary.

## Admin Flow (`/admin/partnerships`)

New admin section, modelled on the upgraded Tickets console:

- **List view**: cards/table with org name, type chip, country, submitted date, qualification status (`new` / `qualified` / `nurture` / `disqualified` / `in_conversation` / `won` / `lost`), priority (auto-scored), assignee, SLA timer, search & filters (type, status, country, date, assignee, score).
- **Lead scoring**: simple auto-score (0–100) using org size band, budget/volume, timeline, work-email domain — visible badge + sort key. Editable.
- **Detail view**: full questionnaire answers in a clean read-only summary, attachments, activity log.
- **Qualify panel**: status, priority, assigned BD owner, tags, internal notes (not emailed), qualification reason, next-step date.
- **Conversation thread**: same Zendesk-style thread as tickets — staff replies email the contact from `info@agatsa.com`, customer replies-by-email captured (reply-to threading).
- **Reply composer**: rich text + canned responses tailored per partnership type ("Hospital intro deck", "Distributor terms", "Polite decline", "Schedule a call — Calendly link", "Sending NDA").
- **Outcome buttons**: "Schedule call" (logs activity), "Send proposal" (templated email), "Mark qualified", "Mark not a fit" (sends polite decline email), "Mark won" / "Mark lost".
- **Dashboard widgets**: new this week, by type, by country, conversion funnel, avg response time, overdue SLA.

## Data Model

New migration:

- `partnership_enquiries`: `id`, `enquiry_number` (auto `AGT-PRT-YYYY-#####` via trigger), `partner_type`, `organisation_name`, `website`, `country`, `state`, `city`, `contact_name`, `contact_designation`, `contact_email`, `contact_phone`, `preferred_contact_method`, `preferred_contact_window`, `heard_from`, `goal_summary`, `questionnaire_answers` jsonb, `attachments` jsonb, `consent` bool, `status` ('new'|'qualified'|'nurture'|'in_conversation'|'won'|'lost'|'disqualified'), `priority`, `score` int, `assigned_to` uuid, `tags` text[], `internal_notes`, `qualification_reason`, `next_step_date`, `last_customer_message_at`, `last_staff_message_at`, `sla_due_at`, timestamps.
- `partnership_messages` (mirrors `ticket_messages`): `id`, `enquiry_id`, `sender_type` ('customer'|'staff'|'system'), `sender_name`, `sender_email`, `body`, `is_internal_note`, `attachments` jsonb, `email_message_id`, `created_at`.
- Storage: reuse a new private bucket `partnership-attachments`.
- GRANTs + RLS: admins manage all; public can INSERT only via service-role edge function; service_role full access; trigger for enquiry number generation (mirrors `generate_ticket_number`).

## Edge Functions

1. `submit-partnership` (public) — zod validation, creates enquiry + first message, uploads attachments, auto-scores, sends:
   - Confirmation email to enquirer (enquiry number, summary, what to expect, 2-business-day SLA).
   - Internal alert to `info@agatsa.com` with all answers, score, deep-link to admin.
2. `partnership-reply` (admin-auth) — appends staff message, emails contact, updates `last_staff_message_at`. Supports "decline", "qualified", "proposal" templated bodies.
3. `lookup-partnership` (public) — enquiry# + email → status + public messages.

All emails via Resend (project standard, domain verified), reply-to `info@agatsa.com`. Templates: `partnership-received-customer`, `partnership-received-internal`, `partnership-reply-customer`, `partnership-declined-customer`, `partnership-qualified-customer`.

## Questionnaire Catalog

Typed TS constant `src/data/partnershipQuestions.ts` (partner type → ordered steps → fields with type / options / validation / conditional logic). Easy to edit without DB migrations. Copy strictly follows project terminology (Metabolic Wellness, no "glucose", no ECG framing for Rhythm, exclude CDSCO/BIS in UI).

## Files

New:
- `src/pages/PartnerWithUs.tsx` (5-step wizard + lookup tab).
- `src/components/partnership/TypePicker.tsx`, `OrgStep.tsx`, `TailoredQuestionnaire.tsx`, `GoalsStep.tsx`, `ReviewStep.tsx`, `EnquiryLookup.tsx`, `EnquiryStatusView.tsx`, `ProgressBar.tsx`.
- `src/data/partnershipQuestions.ts`.
- `src/pages/admin/Partnerships.tsx` (list + detail drawer).
- `src/components/admin/partnerships/EnquiryDetail.tsx`, `QualifyPanel.tsx`, `PartnershipReplyComposer.tsx`, `MessageThread.tsx` (or share with tickets), `CannedResponses.tsx`, `ScoreBadge.tsx`.
- `supabase/functions/submit-partnership/index.ts`
- `supabase/functions/partnership-reply/index.ts`
- `supabase/functions/lookup-partnership/index.ts`
- Migration: tables + storage bucket + RLS + trigger.

Edited:
- `src/App.tsx` — route `/partner-with-us` + admin route `/admin/partnerships`.
- `src/components/admin/AdminLayout.tsx` — sidebar entry "Partnerships" with unread badge.
- `src/components/SiteFooter.tsx` — add "Partner with us" link.
- `src/pages/Partner.tsx` — keep as overview; each card CTA now routes to `/partner-with-us?type=hospital|corporate|doctor` to prefill Step 1.

## Out of scope
- Live chat, calendly embedding (link only), CRM sync (HubSpot/Salesforce), WhatsApp/SMS notifications, customer login portal.

## Technical notes
- Honeypot + rate-limit on submit edge function (basic spam protection).
- All form validation via zod, both client and edge.
- Reuse existing `ticket-attachments` patterns for upload UX.
- Score = weighted sum of (org size band, budget band, timeline urgency, work-email domain bonus, type weight).
