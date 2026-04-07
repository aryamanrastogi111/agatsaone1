import { SiteLayout } from "@/components/SiteLayout";
import { Trash2, ShieldCheck, Clock, AlertCircle, Mail } from "lucide-react";

const DATA_TYPES = [
  { label: "Account & Profile", desc: "Name, email, phone, company details" },
  { label: "ECG & Health Records", desc: "ECG readings, body composition scans, health metrics" },
  { label: "Device Data", desc: "Paired device IDs, firmware history, usage logs" },
  { label: "Order & Transaction History", desc: "Purchase records, invoices, shipping details" },
  { label: "Support & Communication", desc: "Support tickets, chat history, submitted feedback" },
  { label: "App Analytics & Logs", desc: "Usage events, crash reports, session data" },
];

export default function DataDeletion() {
  return (
    <SiteLayout>
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

        <div className="container max-w-3xl py-12 space-y-8">

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

          {/* Contact card */}
          <div className="rounded-xl border border-border bg-card p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 shrink-0">
              <Mail className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground mb-1">How to Request Deletion</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Send an email to our support team with the subject line{" "}
                <strong className="text-foreground">"Data Deletion Request"</strong>. Please include
                your registered full name and the email address linked to your Agatsa account. We will
                confirm receipt within <strong className="text-foreground">48 hours</strong> and
                complete the deletion within <strong className="text-foreground">30 days</strong>.
              </p>
              <a
                href="mailto:care@agatsa.com?subject=Data%20Deletion%20Request"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email care@agatsa.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </SiteLayout>
  );
}
