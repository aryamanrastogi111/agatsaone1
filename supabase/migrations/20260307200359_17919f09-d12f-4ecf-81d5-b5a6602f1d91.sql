
-- ============================================================
-- AGATSA ADMIN MODULES: Full schema migration
-- ============================================================

-- 1. SUBSCRIPTION PLANS
CREATE TABLE public.subscription_plans (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  code            text UNIQUE NOT NULL,
  billing_frequency text NOT NULL DEFAULT 'monthly',
  price           numeric(10,2) NOT NULL DEFAULT 0,
  included_services text[],
  trial_days      int NOT NULL DEFAULT 0,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage subscription_plans" ON public.subscription_plans
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. SUBSCRIPTIONS
CREATE TABLE public.subscriptions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid,
  plan_id             uuid REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  customer_name       text,
  customer_email      text,
  customer_phone      text,
  status              text NOT NULL DEFAULT 'active',
  start_date          date,
  end_date            date,
  renewal_date        date,
  payment_status      text NOT NULL DEFAULT 'unpaid',
  linked_product_id   uuid,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT subscriptions_status_check CHECK (status IN ('active','paused','cancelled','expired','trial'))
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage subscriptions" ON public.subscriptions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. INVENTORY LOGS
CREATE TABLE public.inventory_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      uuid,
  variant_id      uuid,
  product_name    text,
  variant_name    text,
  sku             text,
  adjustment      int NOT NULL DEFAULT 0,
  reason          text NOT NULL DEFAULT 'manual_adjustment',
  notes           text,
  before_quantity int NOT NULL DEFAULT 0,
  after_quantity  int NOT NULL DEFAULT 0,
  created_by      uuid,
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage inventory_logs" ON public.inventory_logs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 4. RETURNS
CREATE TABLE public.returns (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              uuid,
  order_number          text,
  user_id               uuid,
  customer_name         text,
  customer_email        text,
  status                text NOT NULL DEFAULT 'requested',
  reason                text,
  inspection_notes      text,
  refund_status         text,
  refund_amount         numeric(10,2),
  replacement_order_id  uuid,
  resolution_notes      text,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT returns_status_check CHECK (status IN ('requested','approved','rejected','inspecting','refunded','replaced'))
);
ALTER TABLE public.returns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage returns" ON public.returns
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER returns_updated_at
  BEFORE UPDATE ON public.returns
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. LEADS
CREATE TABLE public.leads (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  company            text,
  phone              text,
  email              text,
  source             text,
  interest_category  text,
  assigned_to        uuid,
  stage              text NOT NULL DEFAULT 'new',
  notes              text,
  follow_up_date     date,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leads_stage_check CHECK (stage IN ('new','contacted','demo_scheduled','proposal_sent','negotiating','won','lost'))
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage leads" ON public.leads
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. SUPPORT TICKETS
CREATE TABLE public.support_tickets (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id      uuid,
  customer_name    text,
  customer_email   text,
  type             text,
  priority         text NOT NULL DEFAULT 'medium',
  status           text NOT NULL DEFAULT 'open',
  assigned_to      uuid,
  order_id         uuid,
  order_number     text,
  product_id       uuid,
  subject          text NOT NULL,
  issue_summary    text,
  internal_notes   text,
  resolution_notes text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tickets_priority_check CHECK (priority IN ('low','medium','high','urgent')),
  CONSTRAINT tickets_status_check CHECK (status IN ('open','in_progress','resolved','closed'))
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage support_tickets" ON public.support_tickets
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. ACTIVITY LOGS (audit trail)
CREATE TABLE public.activity_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid,
  user_email  text,
  action      text NOT NULL,
  entity_type text NOT NULL,
  entity_id   text,
  old_value   jsonb,
  new_value   jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage activity_logs" ON public.activity_logs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 8. TEAM MEMBERS
CREATE TABLE public.team_members (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid,
  name        text NOT NULL,
  email       text NOT NULL UNIQUE,
  role        text NOT NULL DEFAULT 'operations',
  department  text,
  is_active   boolean NOT NULL DEFAULT true,
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage team_members" ON public.team_members
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_inventory_logs_product_id ON public.inventory_logs(product_id);
CREATE INDEX idx_returns_order_id ON public.returns(order_id);
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_activity_logs_entity ON public.activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);
