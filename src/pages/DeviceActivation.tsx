import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppStoreBadges } from "@/components/AppStoreBadges";

const API_BASE = import.meta.env.VITE_API_BASE || "https://agatsa-one-api-651017108992.asia-south1.run.app";

const DEVICE_NAMES: Record<string, string> = {
  ecg: "SanketLife ECG",
  easytouch: "EasyTouch Wellness Monitor",
  rhythm: "EasyTouch Rhythm Band",
  scale: "Agatsa Smart Scale",
  multivital: "MultiVital Monitor",
};
const DEVICE_EMOJI: Record<string, string> = { ecg: "🫀", easytouch: "💡", rhythm: "⌚", scale: "⚖️", multivital: "📊" };
const DEVICE_STEPS: Record<string, string[]> = {
  ecg: ["Download Agatsa One from App Store or Play Store", "Enter your phone number and verify with OTP", "Your SanketLife ECG setup screen opens automatically", "Follow the on-screen pairing instructions (30 seconds)"],
  easytouch: ["Download Agatsa One from App Store or Play Store", "Enter your phone number and verify with OTP", "Your EasyTouch Wellness setup screen opens automatically", "Calibrate once for accurate glucose estimates"],
  rhythm: ["Download Agatsa One from App Store or Play Store", "Enter your phone number and verify with OTP", "Your Rhythm Band setup screen opens automatically", "Wear on your non-dominant wrist for best accuracy"],
  scale: ["Download Agatsa One from App Store or Play Store", "Enter your phone number and verify with OTP", "Stand on the scale barefoot — it syncs automatically", "View your 14 body composition metrics in the app"],
  multivital: ["Download Agatsa One from App Store or Play Store", "Enter your phone number and verify with OTP", "Your MultiVital setup screen opens automatically", "Follow the calibration guide for accurate readings"],
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
        if (data.error) { setInvalid(true); return; }
        setDeviceType(data.deviceType);
        setRedeemed(data.redeemed);
        window.location.href = `agatsaone://activate?device=${data.deviceType}&code=${code}`;
      })
      .catch(() => setInvalid(true))
      .finally(() => setLoading(false));
  }, [code]);

  const deviceName = deviceType ? DEVICE_NAMES[deviceType] ?? "your device" : "your device";
  const emoji = deviceType ? DEVICE_EMOJI[deviceType] ?? "📦" : "📦";
  const steps = deviceType ? DEVICE_STEPS[deviceType] ?? [] : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-pulse text-lg text-muted-foreground">Loading your device...</div>
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted text-center px-4">
        <p className="text-5xl mb-4">❌</p>
        <h1 className="text-2xl font-bold text-foreground mb-2">Invalid activation link</h1>
        <p className="text-muted-foreground mb-6">This link may be expired or incorrect. Contact support@agatsaone.com</p>
        <a href="/app" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold">Download Agatsa One</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="bg-background rounded-3xl shadow-purple-lg max-w-md w-full p-8 text-center space-y-6">
        <p className="text-5xl">{emoji}</p>
        <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-muted text-muted-foreground">
          {redeemed ? "Previously Activated" : "Ready to Set Up"}
        </span>
        <h1 className="text-2xl font-bold text-foreground">Set up your {deviceName}</h1>
        <p className="text-muted-foreground text-sm">Download Agatsa One to connect your device in 30 seconds.</p>
        <p className="text-xs text-muted-foreground">Your device is pre-configured — no long setup needed.</p>

        <div className="bg-muted rounded-2xl p-4 text-left space-y-2">
          <p className="font-semibold text-foreground text-sm">How to set up:</p>
          {steps.map((step, i) => (
            <p key={i} className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">{i + 1}.</span> {step}</p>
          ))}
        </div>

        <AppStoreBadges className="justify-center" />

        <p className="text-xs text-muted-foreground">
          Save this email — this link works anytime, even after your device arrives.<br />
          Code: <span className="font-mono font-semibold text-foreground">{code}</span>
        </p>
      </div>
    </div>
  );
}
