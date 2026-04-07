import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { AppStoreBadges } from "@/components/AppStoreBadges";
import { Activity, Loader2, AlertCircle, XCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const API_BASE = import.meta.env.VITE_API_BASE || "https://agatsa-one-api-651017108992.asia-south1.run.app";

const DEVICE_CONFIG: Record<string, { name: string; headline: string; copy: string; steps: string[] }> = {
  ecg: {
    name: "SanketLife ECG",
    headline: "Your SanketLife ECG is ready to activate",
    copy: "You've purchased a SanketLife 12-Lead ECG Monitor. Download Agatsa One to complete setup, activate your device, and start getting AI-powered cardiac analysis from Nera.",
    steps: [
      "Download Agatsa One (free) using the button below",
      "Create your account or sign in",
      'Tap "Add Device" and select SanketLife ECG',
    ],
  },
  easytouch: {
    name: "EasyTouch Wellness Monitor",
    headline: "Your EasyTouch Wellness Monitor is ready to activate",
    copy: "Download Agatsa One to activate your EasyTouch device and start monitoring glucose, BP, and SpO2 — no needles, no cuffs, no complexity.",
    steps: [
      "Download Agatsa One (free) using the button below",
      "Create your account or sign in",
      'Tap "Add Device" and select EasyTouch Wellness',
    ],
  },
  rhythm: {
    name: "EasyTouch Rhythm Band",
    headline: "Your EasyTouch Rhythm Band is ready to activate",
    copy: "Download Agatsa One to activate your Rhythm band and begin 24/7 wellness monitoring — sleep, heart rate, HRV, steps, and SpO2, all unified with Nera AI.",
    steps: [
      "Download Agatsa One (free) using the button below",
      "Create your account or sign in",
      'Tap "Add Device" and select Rhythm Band',
    ],
  },
  scale: {
    name: "Agatsa Smart Scale",
    headline: "Your Agatsa Smart Scale is ready to activate",
    copy: "Download Agatsa One to activate your Smart Scale and track 14 body composition metrics — weight, BMI, body fat, muscle mass, and more.",
    steps: [
      "Download Agatsa One (free) using the button below",
      "Create your account or sign in",
      "Stand on the scale barefoot — it syncs automatically",
    ],
  },
  multivital: {
    name: "MultiVital Monitor",
    headline: "Your MultiVital Monitor is ready to activate",
    copy: "Download Agatsa One to activate your MultiVital Monitor and start tracking all your vitals with Nera AI.",
    steps: [
      "Download Agatsa One (free) using the button below",
      "Create your account or sign in",
      'Tap "Add Device" and select MultiVital',
    ],
  },
};

export default function DeviceActivationPage() {
  const { code } = useParams<{ code: string }>();
  const [deviceType, setDeviceType] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!code) { setInvalid(true); setLoading(false); return; }
    fetch(`${API_BASE}/v1/device-activations/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setInvalid(true); trackEvent("device_activation_view", { device_type: "unknown", code_valid: false }); return; }
        setDeviceType(data.deviceType);
        setRedeemed(data.redeemed);
        trackEvent("device_activation_view", { device_type: data.deviceType, code_valid: true });
        if (!data.redeemed) {
          trackEvent("deep_link_attempt", { device_type: data.deviceType });
          window.location.href = `agatsaone://activate?device=${data.deviceType}&code=${code}`;
        }
      })
      .catch(() => { setInvalid(true); trackEvent("device_activation_view", { device_type: "unknown", code_valid: false }); })
      .finally(() => setLoading(false));
  }, [code]);

  // Loading
  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary" />
            <h2 className="text-xl font-bold text-foreground">Activating your device...</h2>
            <p className="text-muted-foreground">Looking up your device code. This takes just a moment.</p>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Invalid code
  if (invalid) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="bg-card rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-5">
            <XCircle className="h-14 w-14 mx-auto text-destructive" />
            <h1 className="text-2xl font-extrabold text-foreground">We couldn't find this device code</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The code <span className="font-mono font-bold text-foreground">{code}</span> doesn't match any device in our system. Please double-check the code on the sticker inside your device box. If the problem persists, contact <a href="mailto:support@agatsa.ai" className="text-primary font-medium">support@agatsa.ai</a> — we'll get it sorted within 24 hours.
            </p>
            <a href="/app" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-sm">
              Download Agatsa One
            </a>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Already redeemed
  if (redeemed) {
    return (
      <SiteLayout>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <div className="bg-card rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-5">
            <AlertCircle className="h-14 w-14 mx-auto text-amber-500" />
            <h1 className="text-2xl font-extrabold text-foreground">This device has already been activated</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Device code <span className="font-mono font-bold text-foreground">{code}</span> has already been used. If you believe this is an error, or if you received this device as a gift and need a new activation, please contact our support team at <a href="mailto:support@agatsa.ai" className="text-primary font-medium">support@agatsa.ai</a>.
            </p>
            <a href="/app" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold text-sm">
              Download Agatsa One
            </a>
          </div>
        </div>
      </SiteLayout>
    );
  }

  // Valid device
  const config = deviceType ? DEVICE_CONFIG[deviceType] : null;
  const deviceName = config?.name ?? "your device";
  const headline = config?.headline ?? `Your ${deviceName} is ready to activate`;
  const copy = config?.copy ?? "Download Agatsa One to complete your device setup.";
  const steps = config?.steps ?? [];

  return (
    <SiteLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
        <div className="bg-card rounded-3xl shadow-xl max-w-md w-full p-8 text-center space-y-6">
          <Activity className="h-14 w-14 mx-auto text-primary" />

          <span className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full bg-primary/10 text-primary">
            Ready to Set Up
          </span>

          <h1 className="text-2xl font-extrabold text-foreground">{headline}</h1>

          <p className="text-sm text-muted-foreground leading-relaxed">{copy}</p>

          {/* Steps */}
          <div className="bg-muted rounded-2xl p-5 text-left space-y-3">
            {steps.map((step, i) => (
              <p key={i} className="text-sm text-muted-foreground">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold mr-2">{i + 1}</span>
                {step}
              </p>
            ))}
            <p className="text-sm text-muted-foreground">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold mr-2">{steps.length + 1}</span>
              Your device code <span className="font-mono font-bold text-foreground">{code}</span> will activate your 3-month Nera AI subscription automatically
            </p>
          </div>

          <AppStoreBadges className="justify-center" />

          <p className="text-xs text-muted-foreground">
            Code: <span className="font-mono font-semibold text-foreground">{code}</span>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}
