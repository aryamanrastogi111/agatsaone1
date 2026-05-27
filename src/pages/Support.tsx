import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Mail,
  HelpCircle,
  Send,
  Ticket,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import {
  SUPPORT_CATEGORIES,
  type SupportCategory,
  type SupportIssue,
} from "@/data/supportIssues";
import { toast } from "sonner";

type Step = "pick" | "self-help" | "form" | "success" | "lookup";

interface SubmittedTicket {
  ticket_number: string;
  ticket_id: string;
}

export default function Support() {
  useSEO({
    title: "Support — Agatsa | Get help with your device or order",
    description:
      "Browse common issues, try guided self-help, or open a support ticket. Our team replies within 24 hours.",
  });

  const [step, setStep] = useState<Step>("pick");
  const [category, setCategory] = useState<SupportCategory | null>(null);
  const [issue, setIssue] = useState<SupportIssue | null>(null);
  const [answers, setAnswers] = useState<Record<number, "yes" | "no" | "skip">>(
    {},
  );
  const [submitted, setSubmitted] = useState<SubmittedTicket | null>(null);

  const reset = () => {
    setStep("pick");
    setCategory(null);
    setIssue(null);
    setAnswers({});
    setSubmitted(null);
  };

  return (
    <SiteLayout>
      <div className="min-h-screen bg-gradient-to-b from-[#fafafa] to-white pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7C4DFF]/10 text-[#7C4DFF] text-xs font-semibold tracking-wide mb-4">
              <HelpCircle className="w-3.5 h-3.5" /> SUPPORT CENTRE
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-3">
              How can we help?
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Pick the issue you're facing — try the quick self-help steps —
              and if you still need a hand, open a ticket and our team will
              reply within 24 hours.
            </p>

            <div className="flex gap-2 justify-center mt-6">
              <Button
                variant={step !== "lookup" ? "default" : "outline"}
                size="sm"
                onClick={reset}
                className={
                  step !== "lookup"
                    ? "bg-[#7C4DFF] hover:bg-[#6a3def]"
                    : ""
                }
              >
                Get help
              </Button>
              <Button
                variant={step === "lookup" ? "default" : "outline"}
                size="sm"
                onClick={() => setStep("lookup")}
                className={
                  step === "lookup" ? "bg-[#7C4DFF] hover:bg-[#6a3def]" : ""
                }
              >
                <Ticket className="w-4 h-4 mr-1.5" /> Track my ticket
              </Button>
            </div>
          </div>

          {/* Progress chips (only during flow) */}
          {step !== "lookup" && step !== "success" && (
            <StepProgress current={step} />
          )}

          {/* Body */}
          <AnimatePresence mode="wait">
            {step === "pick" && (
              <IssuePicker
                key="pick"
                onSelect={(c, i) => {
                  setCategory(c);
                  setIssue(i);
                  setAnswers({});
                  setStep(i.questionnaire.length > 0 ? "self-help" : "form");
                }}
              />
            )}

            {step === "self-help" && category && issue && (
              <SelfHelp
                key="self-help"
                category={category}
                issue={issue}
                answers={answers}
                setAnswers={setAnswers}
                onBack={() => setStep("pick")}
                onResolved={() => setStep("success")}
                onContinue={() => setStep("form")}
                resolvedMode="self"
              />
            )}

            {step === "form" && category && issue && (
              <TicketForm
                key="form"
                category={category}
                issue={issue}
                answers={answers}
                onBack={() =>
                  setStep(
                    issue.questionnaire.length > 0 ? "self-help" : "pick",
                  )
                }
                onSubmitted={(t) => {
                  setSubmitted(t);
                  setStep("success");
                }}
              />
            )}

            {step === "success" && (
              <Success
                key="success"
                ticket={submitted}
                onReset={reset}
              />
            )}

            {step === "lookup" && <Lookup key="lookup" />}
          </AnimatePresence>

          {/* Footer contact */}
          <div className="mt-12 text-center text-sm text-gray-500">
            Prefer email? Write to{" "}
            <a
              href="mailto:info@agatsa.com"
              className="text-[#7C4DFF] font-medium hover:underline"
            >
              info@agatsa.com
            </a>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

/* ============ Step progress ============ */

function StepProgress({ current }: { current: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "pick", label: "1. Pick issue" },
    { id: "self-help", label: "2. Quick fixes" },
    { id: "form", label: "3. Open ticket" },
  ];
  const idx = steps.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium transition ${
              i <= idx
                ? "bg-[#7C4DFF] text-white"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ============ Step 1: Issue picker ============ */

function IssuePicker({
  onSelect,
}: {
  onSelect: (c: SupportCategory, i: SupportIssue) => void;
}) {
  const [query, setQuery] = useState("");
  const [openCat, setOpenCat] = useState<string | null>(
    SUPPORT_CATEGORIES[0].id,
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return SUPPORT_CATEGORIES;
    const q = query.toLowerCase();
    return SUPPORT_CATEGORIES.map((c) => ({
      ...c,
      issues: c.issues.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          c.label.toLowerCase().includes(q),
      ),
    })).filter((c) => c.issues.length > 0);
  }, [query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search issues (e.g. 'battery', 'pairing', 'refund')…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-12 text-base"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((cat) => {
          const open = query ? true : openCat === cat.id;
          return (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenCat(open ? null : cat.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50"
              >
                <div>
                  <div className="font-semibold text-[#1A1A2E]">
                    {cat.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {cat.blurb}
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-400 transition ${
                    open ? "rotate-90" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-100"
                  >
                    <ul className="divide-y divide-gray-100">
                      {cat.issues.map((issue) => (
                        <li key={issue.id}>
                          <button
                            onClick={() => onSelect(cat, issue)}
                            className="w-full px-5 py-3 flex items-center justify-between text-left hover:bg-[#f6f4ff] transition"
                          >
                            <span className="text-sm text-gray-800">
                              {issue.title}
                            </span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">
            No matching issue. Try a different search, or{" "}
            <button
              className="text-[#7C4DFF] font-medium"
              onClick={() =>
                onSelect(
                  SUPPORT_CATEGORIES.find((c) => c.id === "other")!,
                  SUPPORT_CATEGORIES.find((c) => c.id === "other")!.issues[0],
                )
              }
            >
              open a ticket for something else
            </button>
            .
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ============ Step 2: Self-help ============ */

function SelfHelp({
  category,
  issue,
  answers,
  setAnswers,
  onBack,
  onResolved,
  onContinue,
}: {
  category: SupportCategory;
  issue: SupportIssue;
  answers: Record<number, "yes" | "no" | "skip">;
  setAnswers: (a: Record<number, "yes" | "no" | "skip">) => void;
  onBack: () => void;
  onResolved: () => void;
  onContinue: () => void;
  resolvedMode?: "self";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl border border-gray-200 p-6 md:p-8"
    >
      <button
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-[#7C4DFF] flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to issues
      </button>

      <div className="text-xs font-semibold text-[#7C4DFF] tracking-wide">
        {category.label.toUpperCase()}
      </div>
      <h2 className="text-2xl font-bold text-[#1A1A2E] mt-1 mb-2">
        {issue.title}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Try these quick checks first — they fix most cases in under a minute.
      </p>

      <ul className="space-y-3 mb-6">
        {issue.questionnaire.map((q, i) => {
          const a = answers[i];
          return (
            <li
              key={i}
              className="p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="text-sm text-[#1A1A2E] mb-3">
                {i + 1}. {q}
              </div>
              <div className="flex gap-2">
                {(["yes", "no", "skip"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setAnswers({ ...answers, [i]: v })}
                    className={`px-3 py-1 rounded-md text-xs font-medium border transition ${
                      a === v
                        ? v === "yes"
                          ? "bg-green-600 text-white border-green-600"
                          : v === "no"
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-gray-400 text-white border-gray-400"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {v === "yes" ? "Yes" : v === "no" ? "No" : "Skip"}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ul>

      {issue.hint && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 flex gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{issue.hint}</span>
        </div>
      )}

      <div className="border-t border-gray-100 pt-5">
        <div className="text-sm font-medium text-[#1A1A2E] mb-3">
          Did this solve your issue?
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onResolved}
            variant="outline"
            className="border-green-600 text-green-700 hover:bg-green-50"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" /> Yes, all sorted
          </Button>
          <Button
            onClick={onContinue}
            className="bg-[#7C4DFF] hover:bg-[#6a3def]"
          >
            No, open a support ticket <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

/* ============ Step 3: Ticket form ============ */

function TicketForm({
  category,
  issue,
  answers,
  onBack,
  onSubmitted,
}: {
  category: SupportCategory;
  issue: SupportIssue;
  answers: Record<number, "yes" | "no" | "skip">;
  onBack: () => void;
  onSubmitted: (t: SubmittedTicket) => void;
}) {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    order_number: "",
    issue_summary: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.customer_name.trim() || form.customer_name.trim().length < 2) {
      toast.error("Please enter your name");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email)) {
      toast.error("Please enter a valid email");
      return;
    }
    if (form.issue_summary.trim().length < 10) {
      toast.error("Please describe your issue (at least 10 characters)");
      return;
    }

    setLoading(true);
    try {
      const questionnaireAnswers = issue.questionnaire
        .map((q, i) => ({
          question: q,
          answer: answers[i] || "skip",
        }))
        .filter((a) => a.answer !== "skip");

      const { data, error } = await supabase.functions.invoke("submit-ticket", {
        body: {
          customer_name: form.customer_name.trim(),
          customer_email: form.customer_email.trim().toLowerCase(),
          customer_phone: form.customer_phone.trim() || undefined,
          order_number: form.order_number.trim() || undefined,
          category: category.label,
          sub_issue: issue.title,
          subject: `[${category.label}] ${issue.title}`,
          issue_summary: form.issue_summary.trim(),
          priority: issue.priority,
          type: category.label,
          questionnaire_answers: questionnaireAnswers,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      onSubmitted({
        ticket_number: data.ticket_number,
        ticket_id: data.ticket_id,
      });
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Couldn't submit the ticket. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl border border-gray-200 p-6 md:p-8"
    >
      <button
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-[#7C4DFF] flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <div className="text-xs font-semibold text-[#7C4DFF] tracking-wide">
        {category.label.toUpperCase()} · {issue.priority.toUpperCase()} PRIORITY
      </div>
      <h2 className="text-2xl font-bold text-[#1A1A2E] mt-1 mb-1">
        {issue.title}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Fill in your details below. We'll email a confirmation and reply within
        24 hours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="name">Your name *</Label>
          <Input
            id="name"
            value={form.customer_name}
            onChange={(e) =>
              setForm({ ...form, customer_name: e.target.value })
            }
            placeholder="Full name"
            maxLength={100}
          />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={form.customer_email}
            onChange={(e) =>
              setForm({ ...form, customer_email: e.target.value })
            }
            placeholder="you@example.com"
            maxLength={255}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input
            id="phone"
            value={form.customer_phone}
            onChange={(e) =>
              setForm({ ...form, customer_phone: e.target.value })
            }
            placeholder="+91…"
            maxLength={20}
          />
        </div>
        <div>
          <Label htmlFor="order">Order number (if applicable)</Label>
          <Input
            id="order"
            value={form.order_number}
            onChange={(e) =>
              setForm({ ...form, order_number: e.target.value })
            }
            placeholder="e.g. AGT-..."
            maxLength={50}
          />
        </div>
      </div>

      <div className="mb-5">
        <Label htmlFor="desc">Describe your issue *</Label>
        <Textarea
          id="desc"
          value={form.issue_summary}
          onChange={(e) =>
            setForm({ ...form, issue_summary: e.target.value })
          }
          rows={5}
          maxLength={2000}
          placeholder="Tell us what's happening — when it started, what you've tried, your phone model if relevant…"
        />
        <div className="text-xs text-gray-400 mt-1 text-right">
          {form.issue_summary.length}/2000
        </div>
      </div>

      <Button
        onClick={submit}
        disabled={loading}
        className="w-full bg-[#7C4DFF] hover:bg-[#6a3def] h-12 text-base"
      >
        {loading ? (
          "Sending…"
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" /> Submit ticket
          </>
        )}
      </Button>
    </motion.div>
  );
}

/* ============ Success screens ============ */

function Success({
  ticket,
  onReset,
}: {
  ticket: SubmittedTicket | null;
  onReset: () => void;
}) {
  if (!ticket) {
    // "Yes I'm sorted" path
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-xl border border-gray-200 p-10 text-center"
      >
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">
          Glad we could help!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          If anything else comes up, we're just a click away.
        </p>
        <Button onClick={onReset} className="bg-[#7C4DFF] hover:bg-[#6a3def]">
          Back to Support
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white rounded-xl border border-gray-200 p-10 text-center"
    >
      <div className="w-14 h-14 bg-[#7C4DFF]/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Ticket className="w-7 h-7 text-[#7C4DFF]" />
      </div>
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">
        Ticket created successfully
      </h2>
      <p className="text-gray-600 mb-5">
        We've emailed a confirmation. Our team will reply within 24 hours.
      </p>
      <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-6 py-4 mb-6">
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          Your ticket number
        </div>
        <div className="text-xl font-bold text-[#1A1A2E] font-mono">
          {ticket.ticket_number}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button onClick={onReset} variant="outline">
          Back to Support
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-[#7C4DFF] text-[#7C4DFF] hover:bg-[#7C4DFF]/10"
        >
          <a href="mailto:info@agatsa.com">
            <Mail className="w-4 h-4 mr-1.5" /> Email us
          </a>
        </Button>
      </div>
    </motion.div>
  );
}

/* ============ Ticket lookup ============ */

interface LookupResult {
  ticket: {
    ticket_number: string;
    subject: string;
    status: string;
    priority: string;
    category: string;
    sub_issue: string;
    customer_name: string;
    created_at: string;
    resolution_notes: string | null;
  };
  messages: Array<{
    id: string;
    sender_type: "customer" | "staff" | "system";
    sender_name: string;
    body: string;
    created_at: string;
  }>;
}

function Lookup() {
  const [form, setForm] = useState({ ticket_number: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);

  const search = async () => {
    if (!form.ticket_number.trim() || !form.email.trim()) {
      toast.error("Please enter both ticket number and email");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("lookup-ticket", {
        body: {
          ticket_number: form.ticket_number.trim(),
          email: form.email.trim().toLowerCase(),
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data as LookupResult);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't find that ticket.",
      );
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl border border-gray-200 p-6 md:p-8"
    >
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">
        Track your ticket
      </h2>
      <p className="text-sm text-gray-600 mb-5">
        Enter your ticket number and the email you used to see the latest
        status and replies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <Input
          placeholder="Ticket number (e.g. AGT-TKT-2026-00001)"
          value={form.ticket_number}
          onChange={(e) =>
            setForm({ ...form, ticket_number: e.target.value })
          }
        />
        <Input
          type="email"
          placeholder="Email on the ticket"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <Button
        onClick={search}
        disabled={loading}
        className="bg-[#7C4DFF] hover:bg-[#6a3def] w-full md:w-auto"
      >
        {loading ? "Searching…" : "View ticket"}
      </Button>

      {result && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {result.ticket.ticket_number} · {result.ticket.category}
              </div>
              <div className="text-lg font-bold text-[#1A1A2E] mt-1">
                {result.ticket.subject}
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusPillClass(result.ticket.status)}`}
            >
              {result.ticket.status.replace("_", " ")}
            </span>
          </div>

          <div className="space-y-3">
            {result.messages.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-lg ${
                  m.sender_type === "staff"
                    ? "bg-[#f6f4ff] border border-[#7C4DFF]/20"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <div className="text-xs text-gray-500 mb-1.5 flex items-center gap-2">
                  <span className="font-semibold text-[#1A1A2E]">
                    {m.sender_type === "staff"
                      ? `Agatsa Support · ${m.sender_name || "Team"}`
                      : m.sender_name || "You"}
                  </span>
                  <span>·</span>
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">
                  {m.body}
                </div>
              </div>
            ))}
          </div>

          {result.ticket.status === "resolved" &&
            result.ticket.resolution_notes && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-xs font-semibold text-green-700 mb-1">
                  RESOLUTION
                </div>
                <div className="text-sm text-green-900 whitespace-pre-wrap">
                  {result.ticket.resolution_notes}
                </div>
              </div>
            )}
        </div>
      )}
    </motion.div>
  );
}

function statusPillClass(s: string) {
  switch (s) {
    case "open":
      return "bg-red-100 text-red-700";
    case "in_progress":
      return "bg-yellow-100 text-yellow-700";
    case "resolved":
      return "bg-green-100 text-green-700";
    case "closed":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}
