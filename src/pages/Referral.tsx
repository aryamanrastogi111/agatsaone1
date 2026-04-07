import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE || "https://agatsa-one-api-651017108992.asia-south1.run.app";

const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.agatsakone";
const APP_STORE = "https://apps.apple.com/app/agatsa-one/id6670175601";

export default function ReferralPage() {
  const { code } = useParams<{ code: string }>();
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) { setLoading(false); return; }
    localStorage.setItem("referralCode", code);
    if ((window as any).gtag) {
      (window as any).gtag("event", "referral_link_clicked", { code });
    }
    fetch(`${API_BASE}/v1/referrals/info/${code}`)
      .then(r => r.json())
      .then(data => { if (data.name) setReferrerName(data.name); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [code]);

  const copyCode = () => {
    if (code) { navigator.clipboard.writeText(code); toast.success("Code copied!"); }
  };

  const headline = referrerName
    ? `${referrerName} thinks you should try Agatsa One.`
    : "Someone who cares about your heart invited you to Agatsa One.";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="text-center">
          <div className="h-8 w-8 mx-auto border-2 border-t-transparent rounded-full animate-spin mb-4" style={{ borderColor: "#7C4DFF", borderTopColor: "transparent" }} />
          <p style={{ color: "#4A4A68" }}>Loading your invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(180deg, #F8F4FF 0%, #FFFFFF 100%)" }}>
      <div className="bg-card rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
        <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full" style={{ background: "#F3EEFF", color: "#7C4DFF" }}>
          🎁 You've been personally invited
        </span>

        <h1 className="text-2xl font-extrabold leading-tight" style={{ color: "#1A1A2E" }}>{headline}</h1>

        <p className="text-sm leading-relaxed" style={{ color: "#4A4A68" }}>
          Agatsa One is India's most trusted AI health monitoring app. Your friend is already using it to monitor their heart, vitals, and wellbeing — and they want you to have the same peace of mind.
        </p>

        {/* Offer box */}
        <div className="rounded-2xl p-6 border" style={{ background: "#F8F4FF", borderColor: "rgba(124,77,255,0.2)" }}>
          <p className="text-lg font-extrabold" style={{ color: "#7C4DFF" }}>Your first month FREE</p>
          <p className="text-sm mt-1" style={{ color: "#4A4A68" }}>Nera AI subscription — worth ₹599 — included when you download with this invite</p>
        </div>

        {/* Code pill */}
        {code && (
          <button onClick={copyCode} className="mx-auto flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed transition-colors hover:bg-muted" style={{ borderColor: "#7C4DFF" }}>
            <span className="font-mono font-bold text-sm" style={{ color: "#7C4DFF" }}>{code}</span>
            <span className="text-xs" style={{ color: "#4A4A68" }}>tap to copy</span>
          </button>
        )}

        {/* Benefits */}
        <ul className="text-left space-y-2">
          {["1 month of Nera AI free (worth ₹599)", "Full AI analysis on all your readings", "Weekly health reports from Nera"].map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <Check size={16} className="mt-0.5 shrink-0" style={{ color: "#22C55E" }} />
              <span style={{ color: "#1A1A2E" }}>{b}</span>
            </li>
          ))}
        </ul>

        {/* Download buttons */}
        <div className="flex flex-col gap-3">
          <a href={`${APP_STORE}${code ? `?referral=${code}` : ""}`} target="_blank" rel="noopener noreferrer">
            <Button className="w-full rounded-full py-4 text-sm font-semibold text-white" style={{ background: "#7C4DFF" }}>
              Download on App Store
            </Button>
          </a>
          <a href={`${PLAY_STORE}${code ? `&referrer=referral_${code}` : ""}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full rounded-full py-4 text-sm font-semibold" style={{ borderColor: "#7C4DFF", color: "#7C4DFF" }}>
              Get it on Google Play
            </Button>
          </a>
        </div>

        <p className="text-xs" style={{ color: "#9CA3AF" }}>
          Offer valid for new Agatsa One users only. Free month applied after sign-up with referral code. Standard terms and conditions apply.
        </p>
      </div>
    </div>
  );
}
