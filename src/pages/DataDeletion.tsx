import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Trash2, ShieldCheck, Clock, AlertCircle, CheckCircle2, Mail } from "lucide-react";

type Step = "form" | "confirm" | "submitted";

export default function DataDeletion() {
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState({ name: "", email: "", reason: "", confirm: false });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "A valid email address is required.";
    if (!form.confirm) e.confirm = "You must acknowledge the deletion is permanent.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep("confirm");
  };

  const handleConfirm = () => {
    // In production this would POST to a backend/edge function
    setStep("submitted");
  };

  const DATA_TYPES = [
    { label: "Account & Profile", desc: "Name, email, phone, company details" },
    { label: "ECG & Health Records", desc: "ECG readings, body composition scans, health metrics" },
    { label: "Device Data", desc: "Paired device IDs, firmware history, usage logs" },
    { label: "Order & Transaction History", desc: "Purchase records, invoices, shipping details" },
    { label: "Support & Communication", desc: "Support tickets, chat history, submitted feedback" },
    { label: "App Analytics & Logs", desc: "Usage events, crash reports, session data" },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <section className="border-b border-border bg-muted/40 py-14">
          <div className="container max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-destructive/10 mb-5">
              <Trash2 className="w-7 h-7 text-destructive" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Request Account & Data Deletion
            </h1>
            <p className="text-muted-foreground text-base max-w-xl mx-auto">
              You have the right to request permanent deletion of all personal data associated
              with your Agatsa account, including data collected through our mobile apps.
            </p>
          </div>
        </section>

        <div className="container max-w-3xl py-12 space-y-10">

          {/* Compliance badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ShieldCheck, label: "DPDP Act 2023 Compliant", color: "text-primary" },
              { icon: Clock, label: "Processed within 30 days", color: "text-amber-500" },
              { icon: AlertCircle, label: "Permanent & Irreversible", color: "text-destructive" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                <Icon className={`w-5 h-5 shrink-0 ${color}`} />
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* What will be deleted */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">What data will be deleted?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DATA_TYPES.map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <Trash2 className="w-4 h-4 mt-0.5 text-destructive shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important notice */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-5 flex gap-4">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
              <p className="font-semibold">Before you proceed, please note:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-400">
                <li>Deletion is <strong>permanent and cannot be undone</strong>.</li>
                <li>Active subscriptions will be <strong>cancelled immediately</strong>.</li>
                <li>ECG credits and health history will be <strong>permanently lost</strong>.</li>
                <li>You will lose access to the Agatsa app and all associated services.</li>
                <li>Data required by law (tax records, statutory obligations) may be <strong>retained for up to 7 years</strong>.</li>
              </ul>
            </div>
          </div>

          {/* Step: Form */}
          {step === "form" && (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-5">Submit a Deletion Request</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="As registered in your account"
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Registered Email Address *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="The email linked to your Agatsa account"
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Reason for Deletion <span className="text-muted-foreground font-normal">(optional)</span></label>
                  <textarea
                    rows={3}
                    value={form.reason}
                    onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                    placeholder="Help us understand why you're leaving so we can improve…"
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="confirm-check"
                    type="checkbox"
                    checked={form.confirm}
                    onChange={e => setForm(f => ({ ...f, confirm: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-destructive"
                  />
                  <label htmlFor="confirm-check" className="text-sm text-foreground cursor-pointer">
                    I understand that submitting this request will <strong>permanently delete all my data</strong> and this action cannot be reversed.
                  </label>
                </div>
                {errors.confirm && <p className="text-xs text-destructive -mt-3">{errors.confirm}</p>}

                <button
                  type="submit"
                  className="w-full py-3 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors"
                >
                  Continue to Confirmation →
                </button>
              </form>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div className="rounded-xl border border-destructive/40 bg-card p-6 space-y-5">
              <h2 className="text-lg font-semibold text-foreground">Confirm Your Request</h2>
              <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground font-medium">{form.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground font-medium">{form.email}</span></div>
              </div>
              <p className="text-sm text-muted-foreground">
                By clicking <strong>"Confirm Deletion"</strong> below, you are authorising Agatsa to permanently delete all personal data, health records, and associated account information linked to <strong>{form.email}</strong>.
                You will receive a confirmation email within 48 hours and the deletion will be completed within <strong>30 days</strong>.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("form")}
                  className="flex-1 py-3 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  ← Go Back
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-destructive text-destructive-foreground rounded-lg text-sm font-semibold hover:bg-destructive/90 transition-colors"
                >
                  Confirm Deletion
                </button>
              </div>
            </div>
          )}

          {/* Step: Submitted */}
          {step === "submitted" && (
            <div className="rounded-xl border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 mx-auto">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Request Received</h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your data deletion request for <strong>{form.email}</strong> has been submitted. We will send a confirmation to your email within <strong>48 hours</strong> and complete the deletion within <strong>30 days</strong>.
              </p>
              <p className="text-xs text-muted-foreground">
                Request reference: <span className="font-mono font-medium">DDR-{Date.now().toString(36).toUpperCase()}</span>
              </p>
            </div>
          )}

          {/* Alternative: email */}
          <div className="rounded-xl border border-border bg-muted/30 p-5 flex items-start gap-4">
            <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-0.5">Prefer to contact us directly?</p>
              You can also email your deletion request to{" "}
              <a href="mailto:privacy@agatsa.com" className="text-primary underline underline-offset-4">
                privacy@agatsa.com
              </a>{" "}
              with the subject line <strong>"Data Deletion Request"</strong>. Include your registered name and email address.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
