
## Current State Assessment

The project already has a working admin panel foundation at `/admin` with:
- **Done**: AdminLayout with sidebar, auth guard, Dashboard (stats + recent orders + low stock), ProductsList + ProductForm, OrdersList + OrderDetail (with fulfillment + cancellation), Customers (basic table), Coupons (CRUD), Reviews (moderation)
- **Existing DB tables** (via `db.ts` untyped client): `products`, `product_variants`, `product_images`, `orders`, `order_items`, `fulfillments`, `payments`, `coupons`, `reviews`
- **Auth/Roles**: `profiles`, `user_roles`, `ecg_credits` via Supabase

## What's Missing (the full 18-module vision)

The following modules need to be **built from scratch**:

1. **Inventory & Warehouse module** — no `/admin/inventory` page, no `inventory_logs` table
2. **Subscription Management module** — no pages, no DB tables (`subscription_plans`, `subscriptions`)
3. **Shipping & Fulfillment board** — fulfillment exists on OrderDetail only, no standalone board
4. **Returns / Refunds module** — no pages, no `returns` table
5. **Lead Management module** — no pages, no `leads` table
6. **Support Tickets module** — no pages, no `support_tickets` table
7. **Analytics module** — sidebar link exists but no page
8. **Team / Role-Based Access** — admin exists but no team management page, no granular roles
9. **Settings module** — link in sidebar but no page
10. **External Integrations placeholder** — nothing
11. **Activity Logs & Audit Trail** — no `activity_logs` table, no UI

## Architecture Plan

### Phase 1 — Database Schema (1 migration)
Add all missing tables:
```text
subscription_plans   — plan catalog
subscriptions        — customer subscriptions
inventory_logs       — stock adjustment history  
returns              — return/refund requests
leads                — CRM lead pipeline
support_tickets      — internal support tickets
activity_logs        — audit trail (who changed what)
team_members         — internal staff with roles/permissions
```
Add `app_role` enum values: `operations`, `sales`, `support`, `inventory_manager`, `finance_viewer`, `marketing_viewer`
Add RLS policies with `has_role()` checks on all new tables.

### Phase 2 — New Module Pages (9 new pages)

| Route | File | Status |
|---|---|---|
| `/admin/inventory` | `pages/admin/Inventory.tsx` | New |
| `/admin/subscriptions` | `pages/admin/Subscriptions.tsx` | New |
| `/admin/shipping` | `pages/admin/Shipping.tsx` | New (replaces stub) |
| `/admin/returns` | `pages/admin/Returns.tsx` | New |
| `/admin/leads` | `pages/admin/Leads.tsx` | New |
| `/admin/tickets` | `pages/admin/Tickets.tsx` | New |
| `/admin/analytics` | `pages/admin/Analytics.tsx` | New (replaces stub) |
| `/admin/team` | `pages/admin/Team.tsx` | New |
| `/admin/settings` | `pages/admin/Settings.tsx` | New |
| `/admin/integrations` | `pages/admin/Integrations.tsx` | New (Shopify placeholder) |

### Phase 3 — AdminLayout Upgrade
Expand sidebar nav with all 14 modules, organized into nav groups:

```text
OPERATIONS
  Dashboard
  Orders
  Shipping

CATALOG  
  Products
  Inventory

COMMERCE
  Customers
  Subscriptions
  Coupons

ENGAGEMENT
  Leads
  Tickets
  Reviews

REPORTS
  Analytics
  Activity Logs

SYSTEM
  Team & Access
  Settings
  Integrations
```

### Phase 4 — Dashboard Enhancement
- Add quick action buttons (Create Product, Create Coupon, Add Stock, Export Customers)
- Add chart placeholders using `recharts` (already installed)
- Add pending tickets count, lead pipeline count, active subscriptions

## DB Schema Detail

```sql
-- subscription_plans
CREATE TABLE subscription_plans (
  id uuid PK, name text, code text UNIQUE,
  billing_frequency text, price decimal,
  included_services text[], trial_days int,
  is_active bool DEFAULT true,
  created_at, updated_at
);

-- subscriptions
CREATE TABLE subscriptions (
  id uuid PK, user_id uuid, plan_id uuid FK,
  status text CHECK IN ('active','paused','cancelled','expired','trial'),
  start_date, end_date, renewal_date,
  payment_status text, linked_product_id uuid,
  notes text, created_at, updated_at
);

-- inventory_logs
CREATE TABLE inventory_logs (
  id uuid PK, product_id uuid, variant_id uuid,
  adjustment int, reason text, notes text,
  before_quantity int, after_quantity int,
  created_by uuid, created_at
);

-- returns
CREATE TABLE returns (
  id uuid PK, order_id uuid, user_id uuid,
  status text CHECK IN ('requested','approved','rejected','inspecting','refunded','replaced'),
  reason text, inspection_notes text,
  refund_status text, refund_amount decimal,
  replacement_order_id uuid, resolution_notes text,
  created_at, updated_at
);

-- leads
CREATE TABLE leads (
  id uuid PK, name text, company text,
  phone text, email text, source text,
  interest_category text, assigned_to uuid,
  stage text CHECK IN ('new','contacted','demo_scheduled','proposal_sent','negotiating','won','lost'),
  notes text, follow_up_date date,
  created_at, updated_at
);

-- support_tickets
CREATE TABLE support_tickets (
  id uuid PK, customer_id uuid, type text,
  priority text CHECK IN ('low','medium','high','urgent'),
  status text CHECK IN ('open','in_progress','resolved','closed'),
  assigned_to uuid, order_id uuid, product_id uuid,
  subject text, issue_summary text,
  internal_notes text, resolution_notes text,
  created_at, updated_at
);

-- activity_logs
CREATE TABLE activity_logs (
  id uuid PK, user_id uuid,
  action text, entity_type text, entity_id text,
  old_value jsonb, new_value jsonb,
  ip_address text, created_at
);

-- team_members
CREATE TABLE team_members (
  id uuid PK, user_id uuid FK auth.users,
  name text, email text, role text,
  department text, is_active bool DEFAULT true,
  created_at, updated_at
);
```

## UI Design Language
Consistent throughout:
- Dark theme: `bg-gray-950` body, `bg-gray-900` cards, `border-gray-800` borders
- Blue `#3b82f6` as primary action color
- Colored status badges (existing `STATUS_COLORS` pattern)
- Clean tables with hover states, pagination
- Empty states with icon + message
- recharts for analytics (AreaChart, BarChart, PieChart)

## Files to Create/Edit

**New pages (10):**
- `src/pages/admin/Inventory.tsx`
- `src/pages/admin/Subscriptions.tsx`  
- `src/pages/admin/Shipping.tsx`
- `src/pages/admin/Returns.tsx`
- `src/pages/admin/Leads.tsx`
- `src/pages/admin/Tickets.tsx`
- `src/pages/admin/Analytics.tsx`
- `src/pages/admin/Team.tsx`
- `src/pages/admin/Settings.tsx`
- `src/pages/admin/Integrations.tsx`

**Modified files (2):**
- `src/components/admin/AdminLayout.tsx` — expanded grouped sidebar nav
- `src/App.tsx` — add all new routes

**New migration (1):**
- `supabase/migrations/[timestamp]_admin_modules.sql`

## What Will NOT Be Changed
- Shopify integration (`src/lib/shopify.ts`, CartDrawer, product pages)
- SDK portal (`/sdk/*`)
- Public website pages
- Existing working admin pages (Dashboard, Products, Orders, Customers, Coupons, Reviews)
