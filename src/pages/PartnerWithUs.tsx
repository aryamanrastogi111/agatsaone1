import { useState, useEffect, useMemo } from "react";
import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowRight, ArrowLeft, CheckCircle2, Loader2, Search, FileText, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/integrations/supabase/db";
import { supabase } from "@/integrations/supabase/client";
import {
  PARTNER_TYPES,
  PARTNER_TYPE_BY_ID,
  HEARD_FROM_OPTIONS,
  type Field,
} from "@/data/partnershipQuestions";
import { useSearchParams } from "react-router-dom";

type AnswerMap = Record<string, string | string[]>;

interface OrgData {
  organisation_name: string;
  website: string;
  country: string;
  state: string;
  city: string;
  contact_name: string;
  contact_designation: string;
  contact_email: string;
  contact_phone: string;
  heard_from: string;
}

const STEP_LABELS = ["Type", "Organisation", "Details", "Goals", "Review"];

export default function PartnerWithUs() {
  useSEO({
    title: "Partner with Agatsa — Hospitals, Corporates, Doctors, Distributors",
    description:
      "Explore partnership opportunities with Agatsa. Hospitals, corporates, doctors, distributors, NGOs and more. Fill the questionnaire and our team will respond within 2 business days.",
  });

  const [params] = useSearchParams();
  const initialType = params.get("type") || "";

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const [partnerType, setPartnerType] = useState<string>(initialType);
  const [org, setOrg] = useState<OrgData>({
    organisation_name: "",
    website: "",
    country: "India",
    state: "",
    city: "",
    contact_name: "",
    contact_designation: "",
    contact_email: "",
    contact_phone: "",
    heard_from: "",
  });
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [goal, setGoal] = useState("");
  const [contactMethod, setContactMethod] = useState("Email");
  const [contactWindow, setContactWindow] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  // Autosave to localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("agatsa-partnership-draft");
      if (raw) {
        const d = JSON.parse(raw);
        if (d.partnerType) setPartnerType(d.partnerType);
        if (d.org) setOrg((prev) => ({ ...prev, ...d.org }));
        if (d.answers) setAnswers(d.answers);
        if (d.goal) setGoal(d.goal);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const draft = { partnerType, org, answers, goal };
    try {
      localStorage.setItem("agatsa-partnership-draft", JSON.stringify(draft));
    } catch {}
  }, [partnerType, org, answers, goal]);

  const typeDef = PARTNER_TYPE_BY_ID[partnerType];

  const canNext = useMemo(() => {
    if (step === 0) return !!partnerType;
    if (step === 1)
      return (
        org.organisation_name.trim().length >= 2 &&
        org.contact_name.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(org.contact_email)
      );
    if (step === 2 && typeDef) {
      return typeDef.fields
        .filter((f) => f.required)
        .every((f) => {
          const v = answers[f.id];
          if (Array.isArray(v)) return v.length > 0;
          return typeof v === "string" && v.trim().length > 0;
        });
    }
    if (step === 3) return goal.trim().length >= 30;
    if (step === 4) return consent;
    return true;
  }, [step, partnerType, org, answers, goal, consent, typeDef]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fieldLabel = (id: string) => typeDef?.fields.find((f) => f.id === id)?.label || id;
      const questionnaire_answers = Object.entries(answers).map(([k, v]) => ({
        question: fieldLabel(k),
        answer: Array.isArray(v) ? v.join(", ") : String(v),
      }));

      const { data, error } = await supabase.functions.invoke("submit-partnership", {
        body: {
          partner_type: partnerType,
          ...org,
          preferred_contact_method: contactMethod,
          preferred_contact_window: contactWindow,
          goal_summary: goal,
          questionnaire_answers,
          consent,
          honeypot,
        },
      });
      if (error || (data as any)?.error) {
        throw new Error((data as any)?.error || error?.message || "Submission failed");
      }
      const num = (data as any)?.enquiry_number;
      setSuccessId(num);
      localStorage.removeItem("agatsa-partnership-draft");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      toast.error(err.message || "Could not submit. Please try again or email info@agatsa.com");
    } finally {
      setSubmitting(false);
    }
  };

  if (successId) {
    return (
      <SiteLayout>
        <section className="min-h-[70vh] flex items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl w-full bg-card border border-border rounded-2xl p-8 md:p-10 text-center shadow-sm"
          >
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Enquiry received</h1>
            <p className="text-muted-foreground mt-2">
              Thank you for your interest in partnering with Agatsa.
            </p>
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Your enquiry number</div>
              <div className="text-2xl font-bold text-primary mt-1 tracking-tight">{successId}</div>
            </div>
            <p className="text-sm text-muted-foreground mt-5">
              Our team typically responds within <strong>2 business days</strong>. We've also sent a confirmation to <strong>{org.contact_email}</strong>.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => window.location.assign("/")} variant="outline" className="rounded-full">
                Back to home
              </Button>
              <a href="mailto:info@agatsa.com">
                <Button className="rounded-full bg-primary text-primary-foreground w-full sm:w-auto">
                  <Mail className="h-4 w-4 mr-2" /> Contact us directly
                </Button>
              </a>
            </div>
          </motion.div>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-10 pb-6 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-3xl mx-auto px-4">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            Partnerships
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">
            Partner with Agatsa
          </h1>
          <p className="text-lg text-muted-foreground mt-4">
            Hospitals, corporates, doctors, distributors, NGOs, researchers — tell us what you have in mind and we'll get back within 2 business days.
          </p>
        </div>
      </section>

      {/* Customer segment tiles */}
      <section className="py-10 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Explore by customer segment</h2>
            <p className="text-sm text-muted-foreground mt-2">Pick the one closest to you to see what we offer — or scroll down to fill the open enquiry form.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {PARTNER_SEGMENTS.map((s, i) => (
              <motion.div
                key={s.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  to={`/partner/segments/${s.slug}`}
                  className="group block h-full bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-purple transition-all"
                >
                  <div className="text-3xl mb-3" aria-hidden>{s.emoji}</div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {s.shortTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {s.tagline}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary mt-4">
                    Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-10">
        <div className="max-w-3xl mx-auto px-4">
          <Tabs defaultValue="apply" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-sm mx-auto mb-8">
              <TabsTrigger value="apply">New enquiry</TabsTrigger>
              <TabsTrigger value="lookup">Track enquiry</TabsTrigger>
            </TabsList>

            <TabsContent value="apply">
              {/* Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                  {STEP_LABELS.map((label, i) => (
                    <div key={label} className="flex-1 flex items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                      </div>
                      {i < STEP_LABELS.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground text-center mt-2">
                  Step {step + 1} of {STEP_LABELS.length} · {STEP_LABELS[step]}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 0 && <StepType value={partnerType} onChange={setPartnerType} />}
                    {step === 1 && <StepOrg value={org} onChange={setOrg} partnerType={partnerType} />}
                    {step === 2 && typeDef && (
                      <StepQuestionnaire
                        fields={typeDef.fields}
                        answers={answers}
                        onChange={setAnswers}
                        typeName={typeDef.label}
                      />
                    )}
                    {step === 3 && (
                      <StepGoals
                        goal={goal}
                        onGoal={setGoal}
                        contactMethod={contactMethod}
                        onMethod={setContactMethod}
                        contactWindow={contactWindow}
                        onWindow={setContactWindow}
                      />
                    )}
                    {step === 4 && (
                      <StepReview
                        partnerType={partnerType}
                        org={org}
                        answers={answers}
                        goal={goal}
                        contactMethod={contactMethod}
                        contactWindow={contactWindow}
                        consent={consent}
                        setConsent={setConsent}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Honeypot */}
                <input
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  name="website-url-trap"
                  tabIndex={-1}
                  autoComplete="off"
                  className="absolute opacity-0 pointer-events-none h-0 w-0 -z-10"
                  aria-hidden="true"
                />

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={back}
                    disabled={step === 0 || submitting}
                    className="rounded-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={next}
                      disabled={!canNext}
                      className="rounded-full bg-primary text-primary-foreground"
                    >
                      Next <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canNext || submitting}
                      className="rounded-full bg-primary text-primary-foreground"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting…
                        </>
                      ) : (
                        <>
                          Submit enquiry <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-6">
                Prefer email? Write to{" "}
                <a href="mailto:info@agatsa.com" className="text-primary underline">
                  info@agatsa.com
                </a>
                . We typically reply within 2 business days.
              </p>
            </TabsContent>

            <TabsContent value="lookup">
              <LookupTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </SiteLayout>
  );
}

/* -------------------- Steps -------------------- */

function StepType({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Who are you?</h2>
      <p className="text-sm text-muted-foreground mt-1">Pick the option that best describes you. We'll tailor the next questions to your context.</p>
      <div className="grid sm:grid-cols-2 gap-3 mt-6">
        {PARTNER_TYPES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            className={`text-left p-4 rounded-xl border-2 transition-all ${
              value === p.id
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div className="text-2xl">{p.emoji}</div>
            <div className="font-semibold text-foreground mt-2">{p.label}</div>
            <div className="text-xs text-muted-foreground mt-1">{p.tagline}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepOrg({
  value,
  onChange,
  partnerType,
}: {
  value: OrgData;
  onChange: (v: OrgData) => void;
  partnerType: string;
}) {
  const set = (k: keyof OrgData, v: string) => onChange({ ...value, [k]: v });
  const b2bTypes = ["hospital", "corporate", "distributor", "investor"];
  const isB2B = b2bTypes.includes(partnerType);
  const domain = value.contact_email.split("@")[1]?.toLowerCase() || "";
  const freeMail = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "rediffmail.com"].includes(domain);
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">About your organisation</h2>
      <p className="text-sm text-muted-foreground mt-1">A few quick details so we know who to talk to.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Field label="Organisation name *">
          <Input value={value.organisation_name} onChange={(e) => set("organisation_name", e.target.value)} placeholder="e.g. Apollo Hospitals" />
        </Field>
        <Field label="Website">
          <Input value={value.website} onChange={(e) => set("website", e.target.value)} placeholder="https://…" />
        </Field>
        <Field label="Your name *">
          <Input value={value.contact_name} onChange={(e) => set("contact_name", e.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Designation">
          <Input value={value.contact_designation} onChange={(e) => set("contact_designation", e.target.value)} placeholder="e.g. Director, Procurement" />
        </Field>
        <Field label="Work email *">
          <Input type="email" value={value.contact_email} onChange={(e) => set("contact_email", e.target.value)} placeholder="you@organisation.com" />
          {isB2B && freeMail && (
            <p className="text-[11px] text-amber-600 mt-1">A work email helps us route your enquiry faster.</p>
          )}
        </Field>
        <Field label="Phone (with country code)">
          <Input value={value.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} placeholder="+91 98xxxxxxxx" />
        </Field>
        <Field label="Country">
          <Input value={value.country} onChange={(e) => set("country", e.target.value)} />
        </Field>
        <Field label="State / Region">
          <Input value={value.state} onChange={(e) => set("state", e.target.value)} />
        </Field>
        <Field label="City">
          <Input value={value.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="How did you hear about Agatsa?">
          <select
            value={value.heard_from}
            onChange={(e) => set("heard_from", e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Select…</option>
            {HEARD_FROM_OPTIONS.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
}

function StepQuestionnaire({
  fields,
  answers,
  onChange,
  typeName,
}: {
  fields: Field[];
  answers: AnswerMap;
  onChange: (v: AnswerMap) => void;
  typeName: string;
}) {
  const set = (id: string, v: string | string[]) => onChange({ ...answers, [id]: v });
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Tell us more — {typeName}</h2>
      <p className="text-sm text-muted-foreground mt-1">Helps us route your enquiry to the right team.</p>
      <div className="grid gap-4 mt-6">
        {fields.map((f) => (
          <FieldRow key={f.id} field={f} value={answers[f.id]} onChange={(v) => set(f.id, v)} />
        ))}
      </div>
    </div>
  );
}

function StepGoals({
  goal, onGoal,
  contactMethod, onMethod,
  contactWindow, onWindow,
}: {
  goal: string; onGoal: (s: string) => void;
  contactMethod: string; onMethod: (s: string) => void;
  contactWindow: string; onWindow: (s: string) => void;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Your goals</h2>
      <p className="text-sm text-muted-foreground mt-1">In your own words — what outcome are you hoping for?</p>
      <div className="grid gap-4 mt-6">
        <Field label="What do you hope to achieve? *" hint={`${goal.trim().length}/30 minimum`}>
          <Textarea
            rows={5}
            value={goal}
            onChange={(e) => onGoal(e.target.value)}
            placeholder="e.g. We want to roll out cardiac screening across 8 hospitals in Q3, focusing on post-discharge monitoring…"
          />
        </Field>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Preferred contact method">
            <select
              value={contactMethod}
              onChange={(e) => onMethod(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option>Email</option>
              <option>Phone call</option>
              <option>WhatsApp</option>
            </select>
          </Field>
          <Field label="Preferred contact window">
            <Input value={contactWindow} onChange={(e) => onWindow(e.target.value)} placeholder="e.g. Weekdays 10am–6pm IST" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function StepReview({
  partnerType, org, answers, goal, contactMethod, contactWindow, consent, setConsent,
}: any) {
  const t = PARTNER_TYPE_BY_ID[partnerType];
  const labelOf = (id: string) => t?.fields.find((f: Field) => f.id === id)?.label || id;
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">Review & submit</h2>
      <p className="text-sm text-muted-foreground mt-1">Quick check before you send it across.</p>
      <div className="mt-6 space-y-3 text-sm">
        <ReviewRow label="Type" value={`${t?.emoji} ${t?.label}`} />
        <ReviewRow label="Organisation" value={org.organisation_name} />
        <ReviewRow label="Contact" value={`${org.contact_name}${org.contact_designation ? ", " + org.contact_designation : ""}`} />
        <ReviewRow label="Email" value={org.contact_email} />
        {org.contact_phone && <ReviewRow label="Phone" value={org.contact_phone} />}
        {(org.city || org.state || org.country) && (
          <ReviewRow label="Location" value={[org.city, org.state, org.country].filter(Boolean).join(", ")} />
        )}
        {Object.entries(answers).map(([k, v]) => (
          <ReviewRow key={k} label={labelOf(k)} value={Array.isArray(v) ? v.join(", ") : String(v)} />
        ))}
        <ReviewRow label="Preferred contact" value={`${contactMethod}${contactWindow ? " · " + contactWindow : ""}`} />
        <div className="pt-3 border-t border-border">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Your goals</div>
          <div className="whitespace-pre-wrap text-foreground">{goal}</div>
        </div>
      </div>
      <label className="flex items-start gap-3 mt-6 p-4 bg-muted/30 rounded-lg cursor-pointer">
        <Checkbox checked={consent} onCheckedChange={(v) => setConsent(!!v)} className="mt-0.5" />
        <span className="text-sm text-foreground">
          I agree Agatsa may contact me about this enquiry. I understand my details will be handled per Agatsa's privacy policy.
        </span>
      </label>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</Label>
      <div className="mt-1.5">{children}</div>
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-1.5 border-b border-border/60">
      <div className="text-xs uppercase tracking-wider text-muted-foreground w-44 shrink-0 pt-0.5">{label}</div>
      <div className="text-foreground flex-1">{value}</div>
    </div>
  );
}

function FieldRow({ field, value, onChange }: { field: Field; value: string | string[] | undefined; onChange: (v: string | string[]) => void }) {
  const v = value;
  if (field.type === "textarea") {
    return (
      <Field label={`${field.label}${field.required ? " *" : ""}`}>
        <Textarea rows={3} value={(v as string) || ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
      </Field>
    );
  }
  if (field.type === "select") {
    return (
      <Field label={`${field.label}${field.required ? " *" : ""}`}>
        <select
          value={(v as string) || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Select…</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </Field>
    );
  }
  if (field.type === "radio") {
    return (
      <Field label={`${field.label}${field.required ? " *" : ""}`}>
        <div className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const selected = v === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => onChange(o)}
                className={`text-xs px-3 py-2 rounded-full border transition-colors ${
                  selected ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </Field>
    );
  }
  if (field.type === "multiselect") {
    const arr = (Array.isArray(v) ? v : []) as string[];
    const toggle = (o: string) => {
      onChange(arr.includes(o) ? arr.filter((x) => x !== o) : [...arr, o]);
    };
    return (
      <Field label={`${field.label}${field.required ? " *" : ""}`} hint="Select all that apply">
        <div className="flex flex-wrap gap-2">
          {field.options?.map((o) => {
            const selected = arr.includes(o);
            return (
              <button
                key={o}
                type="button"
                onClick={() => toggle(o)}
                className={`text-xs px-3 py-2 rounded-full border transition-colors ${
                  selected ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/40"
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      </Field>
    );
  }
  // text / email / tel / url / number
  return (
    <Field label={`${field.label}${field.required ? " *" : ""}`}>
      <Input
        type={field.type === "number" ? "number" : field.type === "email" ? "email" : field.type === "tel" ? "tel" : field.type === "url" ? "url" : "text"}
        value={(v as string) || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    </Field>
  );
}

/* -------------------- Lookup tab -------------------- */

function LookupTab() {
  const [num, setNum] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const search = async () => {
    if (!num.trim() || !email.trim()) {
      toast.error("Please enter both enquiry number and email");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("lookup-partnership", {
        body: { enquiry_number: num.trim(), email: email.trim() },
      });
      if (error || (data as any)?.error) {
        toast.error((data as any)?.error || "Not found");
      } else {
        setResult(data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-bold text-foreground">Track your enquiry</h2>
      <p className="text-sm text-muted-foreground mt-1">Enter your enquiry number and the email you used.</p>
      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <Field label="Enquiry number">
          <Input value={num} onChange={(e) => setNum(e.target.value)} placeholder="AGT-PRT-2026-00001" />
        </Field>
        <Field label="Your email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@organisation.com" />
        </Field>
      </div>
      <Button onClick={search} disabled={loading} className="mt-4 rounded-full bg-primary text-primary-foreground">
        {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
        Look up
      </Button>

      {result?.enquiry && (
        <div className="mt-6 p-5 bg-muted/30 rounded-xl border border-border">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Enquiry</div>
              <div className="font-bold text-foreground">{result.enquiry.enquiry_number}</div>
              <div className="text-sm text-muted-foreground">{result.enquiry.organisation_name} · {result.enquiry.partner_type}</div>
            </div>
            <span className="text-xs uppercase font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {result.enquiry.status}
            </span>
          </div>
          {result.messages?.length > 0 && (
            <div className="mt-5 space-y-3">
              {result.messages.map((m: any, i: number) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${m.sender_type === "staff" ? "bg-primary/5 border border-primary/10" : "bg-white border border-border"}`}>
                  <div className="text-xs text-muted-foreground mb-1">
                    <strong className="text-foreground">{m.sender_name || (m.sender_type === "staff" ? "Agatsa Team" : "You")}</strong>
                    {" · "}{new Date(m.created_at).toLocaleString()}
                  </div>
                  <div className="whitespace-pre-wrap text-foreground">{m.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
