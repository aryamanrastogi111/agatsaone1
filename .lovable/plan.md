## Goal

Build a professional, end-to-end support ticket system on the public `/support` page with a 3-step self-service flow, and upgrade the admin Tickets panel into a full conversation console with email replies.

## Customer Flow (`/support`)

**Step 1 — Pick your issue (categorised library)**
Searchable accordion list grouped by product/area. Issues are accurate to what each product actually is:

- **EasyTouch Wellness** *(light-based optical finger sensor — 15s scan, no strips, no needles, no blood, pairs with Agatsa One app)*
  - Device not powering on / not charging.
  - Bluetooth pairing with Agatsa One app fails.
  - Scan doesn't complete in 15s / "finger not detected".
  - Reading seems off or inconsistent.
    &nbsp;
  - Meal-snap not generating.
  - Light/sensor window looks dirty or scratched.
  - How to interpret my daily reading (links to "this is not a glucometer" explainer).
  - 1-year free Nera AI not activated.
- **SanketLife ECG** — device not turning on, ECG not generating, Bluetooth pairing, electrode contact error, app sync failed, report PDF missing, battery drains fast, charging issue, doubts about reading accuracy.
- **EasyTouch Rhythm** — rhythm not detected, irregular rhythm interpretation, app pairing, sensor placement guidance (explicitly *not* ECG).
- **Smart Scale** — weight inconsistent, body-composition reading missing, Wi-Fi/Bluetooth not connecting, multi-user not switching, surface/placement issues.
- **Nera AI / Agatsa One App** — login OTP not received, activation / 1-year-free not applied, data not syncing, report interpretation help, account / data deletion.
- **Orders & Shipping** — order not received, wrong item, tracking not updating, damaged package, invoice / GST query.
- **Returns & Refunds** — return pickup, refund status, replacement.
- **Billing & Payments** — payment failed but deducted, coupon not working, EMI.
- **B2B / Doctors / Corporates** — bulk pricing, demo request, integration query.
- **Other / General**.

Final wording strictly follows project terminology: "sugar reading / sugar response", never "glucose"; EasyTouch Rhythm copy continues to exclude any ECG framing; EasyTouch Wellness copy contains zero strip/lancet/blood references.

**Step 2 — Guided questionnaire (try-this-first)**
Each issue has 2–4 self-help steps as a checklist. Examples for EasyTouch Wellness:

- "Is the sensor window clean and dry? Wipe gently with a soft dry cloth."
- "Is your finger placed flat, fully covering the sensor, and held still for the full 15 seconds?"
- "Is the device charged and powered on?"
- "Is Bluetooth on in the Agatsa One app and is the device unpaired from other phones?"

Ends with *"Did this solve your issue?"* → Yes (thank-you screen) / No (proceed to Step 3).

**Step 3 — Ticket form**
Pre-filled with chosen issue + category. Customer adds: name, email, phone, order number (optional), description, optional file upload (photo/screenshot). Submit triggers:

- Insert into `support_tickets` (status `open`, priority auto from issue config).
- Edge function `submit-ticket` sends:
  - Confirmation email to customer (ticket number, summary, expected SLA).
  - Internal alert email to `info@agatsa.com` with all details + admin deep-link.
- Success screen shows ticket ID and "we'll reply within 24h".

Customer can also look up a ticket by ID + email on the same page to see status/replies.

## Admin Flow (`/admin/tickets`)

Upgrade existing page into a full console:

- **List view**: filters (status, priority, category, assignee, date), search, unread badge, SLA timer.
- **Detail view (drawer / right pane)**:
  - Customer info, order link, original issue + questionnaire answers, attachments.
  - **Conversation thread** (chronological customer ↔ staff messages, Zendesk-style).
  - **Reply composer**: rich text + canned responses; sending posts a message AND emails the customer from `info@agatsa.com` via the same edge function. Logged in `ticket_messages`.
  - Status, priority, assignee, tags, internal notes (not emailed), resolution notes.
  - "Mark resolved" sends a resolution email with outcome summary.
  - Activity log (status changes, assignments).
- Dashboard widgets: open count, overdue, avg response time.

## Data Model

New migration:

- Extend `support_tickets`: add `ticket_number` (text, auto `AGT-TKT-YYYY-#####` via trigger), `category` (text), `sub_issue` (text), `questionnaire_answers` (jsonb), `attachments` (jsonb array), `customer_phone` (text), `last_customer_message_at`, `last_staff_message_at`, `sla_due_at`.
- New table `ticket_messages`: `id`, `ticket_id`, `sender_type` ('customer' | 'staff' | 'system'), `sender_name`, `sender_email`, `body`, `is_internal_note` (bool), `attachments` jsonb, `email_message_id`, `created_at`. RLS: admins manage all; inserts from public flow happen only via service-role edge function.
- Storage bucket `ticket-attachments` (private) with signed URLs.
- GRANTs for both tables; RLS policies; service_role full access.

## Edge Functions

1. `submit-ticket` (public) — validates input (zod), creates ticket + first message, uploads attachments, sends confirmation + internal-alert emails via Resend (existing `RESEND_API_KEY`, domain already verified).
2. `ticket-reply` (admin-auth) — appends staff message, emails customer, updates `last_staff_message_at`.
3. `lookup-ticket` (public) — returns ticket + public messages given ticket# + email.

All emails via Resend (project standard for server-triggered email). Templates: `ticket-created-customer`, `ticket-created-internal`, `ticket-reply-customer`, `ticket-resolved-customer`.

## Issue Catalog

Stored as typed TS constant `src/data/supportIssues.ts` (category → issues[] → { id, title, priority, questionnaire: Step[] }). Easy to edit without DB migrations. Copy strictly avoids "glucose", avoids any strip/lancet/blood/prick references for EasyTouch Wellness, and avoids any ECG framing for Rhythm.

## Files

New:

- `src/pages/Support.tsx` (rewrite) — 3-step flow + ticket lookup.
- `src/components/support/IssuePicker.tsx`, `Questionnaire.tsx`, `TicketForm.tsx`, `TicketLookup.tsx`, `TicketStatusView.tsx`.
- `src/data/supportIssues.ts`.
- `src/pages/admin/TicketDetail.tsx` (or drawer component).
- `src/components/admin/tickets/ReplyComposer.tsx`, `MessageThread.tsx`, `CannedResponses.tsx`.
- `supabase/functions/submit-ticket/index.ts`
- `supabase/functions/ticket-reply/index.ts`
- `supabase/functions/lookup-ticket/index.ts`

Edited:

- `src/pages/admin/Tickets.tsx` — list + open detail.
- Migration for schema + storage bucket.

## Out of scope

- Live chat / websockets.
- Customer login portal (lookup-by-ID + email instead).
- SMS/WhatsApp notifications.