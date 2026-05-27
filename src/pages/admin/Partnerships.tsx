import { useEffect, useState } from "react";
import { db } from "@/integrations/supabase/db";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, Globe, MapPin, Send, X, Clock, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = ["new", "qualified", "nurture", "in_conversation", "won", "lost", "disqualified"];

const CANNED: Record<string, { label: string; body: string }> = {
  intro: {
    label: "Intro & deck",
    body: "Hi {name},\n\nThanks for reaching out about a partnership with Agatsa. I'd love to learn more about your goals and share how we can help.\n\nAttaching our partnership deck — could we schedule a quick 20-minute call this week?\n\nBest regards,",
  },
  qualified: {
    label: "Qualified — schedule call",
    body: "Hi {name},\n\nThanks for the details — this looks like a great fit. I'd like to schedule a call to go deeper.\n\nPlease share 2–3 time slots that work for you this week, or pick one here: https://calendly.com/agatsa\n\nLooking forward,",
  },
  proposal: {
    label: "Sending proposal",
    body: "Hi {name},\n\nAs discussed, please find our proposal attached. Happy to walk you through it on a call — let me know a good time.\n\nBest regards,",
  },
  decline: {
    label: "Polite decline",
    body: "Hi {name},\n\nThanks again for considering Agatsa. After reviewing your enquiry, this isn't the right fit for us at this stage — but we'd love to stay in touch as your needs evolve.\n\nAll the best,",
  },
};

export default function AdminPartnerships() {
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await db
      .from("partnership_enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setList(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = list.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return (
        e.organisation_name?.toLowerCase().includes(s) ||
        e.contact_name?.toLowerCase().includes(s) ||
        e.contact_email?.toLowerCase().includes(s) ||
        e.enquiry_number?.toLowerCase().includes(s)
      );
    }
    return true;
  });

  const stats = {
    new: list.filter((e) => e.status === "new").length,
    qualified: list.filter((e) => e.status === "qualified").length,
    in_conversation: list.filter((e) => e.status === "in_conversation").length,
    won: list.filter((e) => e.status === "won").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partnership Enquiries</h1>
          <p className="text-sm text-gray-500 mt-1">Hospitals, corporates, distributors and more</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Stat label="New" value={stats.new} color="bg-blue-50 text-blue-700" />
        <Stat label="Qualified" value={stats.qualified} color="bg-purple-50 text-purple-700" />
        <Stat label="In conversation" value={stats.in_conversation} color="bg-amber-50 text-amber-700" />
        <Stat label="Won" value={stats.won} color="bg-green-50 text-green-700" />
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-9 rounded-md border border-gray-200 px-3 text-sm bg-white">
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search org, name, email, number…" className="max-w-sm h-9" />
        <Button variant="outline" size="sm" onClick={load} className="h-9">Refresh</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">No enquiries match.</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Enquiry</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Contact</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} onClick={() => setSelected(e)} className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-900">{e.organisation_name}</div>
                    <div className="text-xs text-gray-500">{e.enquiry_number}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">{e.partner_type}</td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{e.contact_name}</div>
                    <div className="text-xs text-gray-500">{e.contact_email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <ScoreBadge score={e.score} priority={e.priority} />
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{new Date(e.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <EnquiryDrawer enquiry={selected} onClose={() => setSelected(null)} onSaved={() => { load(); }} />
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`p-4 rounded-xl border border-gray-200 bg-white`}>
      <div className={`inline-block text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${color}`}>{label}</div>
      <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    qualified: "bg-purple-100 text-purple-700",
    nurture: "bg-amber-100 text-amber-700",
    in_conversation: "bg-indigo-100 text-indigo-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-gray-100 text-gray-600",
    disqualified: "bg-red-100 text-red-700",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${map[status] || "bg-gray-100 text-gray-700"}`}>{status.replace("_", " ")}</span>;
}

function ScoreBadge({ score, priority }: { score: number; priority: string }) {
  const color = score >= 80 ? "text-red-700 bg-red-50" : score >= 65 ? "text-orange-700 bg-orange-50" : score >= 45 ? "text-purple-700 bg-purple-50" : "text-gray-600 bg-gray-100";
  return <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${color}`}>{score} · {priority}</span>;
}

function EnquiryDrawer({ enquiry, onClose, onSaved }: { enquiry: any; onClose: () => void; onSaved: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [isNote, setIsNote] = useState(false);
  const [newStatus, setNewStatus] = useState(enquiry.status);
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState(enquiry.internal_notes || "");
  const [preset, setPreset] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await db
        .from("partnership_messages")
        .select("*")
        .eq("enquiry_id", enquiry.id)
        .order("created_at", { ascending: true });
      setMessages(data || []);
      setLoading(false);
    })();
  }, [enquiry.id]);

  const applyPreset = (key: string) => {
    setPreset(key);
    const p = CANNED[key];
    if (!p) return;
    setReply(p.body.replace("{name}", enquiry.contact_name?.split(" ")[0] || "there"));
    if (key === "qualified") setNewStatus("qualified");
    if (key === "decline") setNewStatus("disqualified");
  };

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("partnership-reply", {
        body: {
          enquiry_id: enquiry.id,
          body: reply,
          is_internal_note: isNote,
          new_status: newStatus !== enquiry.status ? newStatus : undefined,
          preset: preset || "general",
        },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);
      toast.success(isNote ? "Note saved" : "Reply sent to customer");
      setReply("");
      setPreset("");
      // refresh
      const { data: m } = await db.from("partnership_messages").select("*").eq("enquiry_id", enquiry.id).order("created_at");
      setMessages(m || []);
      onSaved();
    } catch (err: any) {
      toast.error(err.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  const saveMeta = async () => {
    const { error } = await db
      .from("partnership_enquiries")
      .update({ status: newStatus, internal_notes: notes })
      .eq("id", enquiry.id);
    if (error) toast.error(error.message);
    else { toast.success("Saved"); onSaved(); }
  };

  const answers = (enquiry.questionnaire_answers || []) as Array<{ question: string; answer: string }>;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-3xl bg-white shadow-xl h-full overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-xs text-gray-500">{enquiry.enquiry_number}</div>
            <div className="font-bold text-lg text-gray-900">{enquiry.organisation_name}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><X className="h-5 w-5" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Contact */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Meta icon={<Mail className="h-4 w-4" />} label="Email" value={enquiry.contact_email} link={`mailto:${enquiry.contact_email}`} />
            {enquiry.contact_phone && <Meta icon={<Phone className="h-4 w-4" />} label="Phone" value={enquiry.contact_phone} link={`tel:${enquiry.contact_phone}`} />}
            {enquiry.website && <Meta icon={<Globe className="h-4 w-4" />} label="Website" value={enquiry.website} link={enquiry.website} />}
            {(enquiry.city || enquiry.country) && <Meta icon={<MapPin className="h-4 w-4" />} label="Location" value={[enquiry.city, enquiry.state, enquiry.country].filter(Boolean).join(", ")} />}
            <Meta icon={<Clock className="h-4 w-4" />} label="Contact" value={`${enquiry.contact_name}${enquiry.contact_designation ? ", " + enquiry.contact_designation : ""}`} />
            <Meta icon={<CheckCircle2 className="h-4 w-4" />} label="Score" value={`${enquiry.score} / 100 · ${enquiry.priority}`} />
          </div>

          {/* Goals */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-purple-700 font-semibold mb-2">Their goal</div>
            <div className="text-sm text-gray-900 whitespace-pre-wrap">{enquiry.goal_summary}</div>
          </div>

          {/* Answers */}
          {answers.length > 0 && (
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Questionnaire</div>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                {answers.map((a, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4 text-sm border-t border-gray-100 first:border-t-0 px-4 py-2.5">
                    <div className="text-gray-600">{a.question}</div>
                    <div className="col-span-2 text-gray-900">{a.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Qualify panel */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Qualify & track</div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-600">Status</label>
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm mt-1">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <Button size="sm" variant="outline" onClick={saveMeta} className="w-full">Save</Button>
              </div>
            </div>
            <div className="mt-3">
              <label className="text-xs text-gray-600">Internal notes (not emailed)</label>
              <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1" placeholder="Lead context, next steps, decision-makers…" />
            </div>
          </div>

          {/* Conversation */}
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">Conversation</div>
            {loading ? <Loader2 className="h-5 w-5 animate-spin text-gray-400" /> : messages.length === 0 ? (
              <div className="text-sm text-gray-500">No messages yet.</div>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`p-3 rounded-lg text-sm ${m.is_internal_note ? "bg-amber-50 border border-amber-200" : m.sender_type === "staff" ? "bg-purple-50 border border-purple-100" : "bg-white border border-gray-200"}`}>
                    <div className="text-xs text-gray-500 mb-1">
                      <strong className="text-gray-800">{m.sender_name || m.sender_type}</strong>
                      {m.is_internal_note && <span className="ml-2 text-amber-700 font-semibold uppercase text-[10px]">Internal note</span>}
                      <span className="ml-2">{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <div className="whitespace-pre-wrap text-gray-900">{m.body}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reply */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Reply</div>
              <select value={preset} onChange={(e) => applyPreset(e.target.value)} className="text-xs h-8 rounded border border-gray-200 px-2 bg-white">
                <option value="">Canned response…</option>
                {Object.entries(CANNED).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <Textarea rows={6} value={reply} onChange={(e) => setReply(e.target.value)} placeholder={`Reply to ${enquiry.contact_name}…`} />
            <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isNote} onChange={(e) => setIsNote(e.target.checked)} />
                Internal note only (don't email)
              </label>
              <Button onClick={send} disabled={sending || !reply.trim()} className="bg-purple-600 hover:bg-purple-700 text-white">
                {sending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {isNote ? "Save note" : "Send reply"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Meta({ icon, label, value, link }: { icon: React.ReactNode; label: string; value: string; link?: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-gray-500 font-semibold">{icon} {label}</div>
      {link ? <a href={link} target="_blank" rel="noreferrer" className="text-purple-700 hover:underline text-sm mt-0.5 block">{value}</a> : <div className="text-gray-900 text-sm mt-0.5">{value}</div>}
    </div>
  );
}
