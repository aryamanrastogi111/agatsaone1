import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, AlertTriangle, ArrowLeft, ShieldCheck, Lock, MapPin, User, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { usePricing, type DeviceSku } from "@/hooks/useDevicePricing";
import agatsaLogo from "@/assets/agatsa-logo.webp";

// ─── Device display names ───────────────────────────────────────
const DEVICE_NAMES: Record<string, string> = {
  ecg_bundle:      "SanketLife ECG",
  band_sub:        "EasyTouch Rhythm Band",
  scale_sub:       "Agatsa Smart Scale",
  wellness_sub:    "EasyTouch Wellness",
  multivital:      "Agatsa MultiVital",
  bundle_ecg_band: "ECG + Rhythm Band Bundle",
};

const API_BASE = "https://agatsa-one-api-651017108992.asia-south1.run.app";

// ─── Pincode lookup ─────────────────────────────────────────────
async function lookupPincode(pincode: string): Promise<{ city: string; state: string } | null> {
  if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) return null;
  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await res.json();
    if (data?.[0]?.Status === "Success" && data[0].PostOffice?.length) {
      const po = data[0].PostOffice[0];
      return { city: po.District, state: po.State };
    }
  } catch {
    /* ignore */
  }
  return null;
}

// ─── Razorpay loader ────────────────────────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

type CheckoutStep = 1 | 2;
type PageState = "form" | "processing" | "success" | "error";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const { prices, fmt } = usePricing();
  const skuParam = searchParams.get("sku") || "";
  const skus = skuParam.split(",").filter((s) => s in DEVICE_NAMES);

  // ─── Form state ────────────────────────────────────────────
  const [step, setStep] = useState<CheckoutStep>(1);
  const [pageState, setPageState] = useState<PageState>("form");
  const [errorMsg, setErrorMsg] = useState("");

  // Step 1
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [cityAutoFilled, setCityAutoFilled] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");

  // Step 2
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [paying, setPaying] = useState(false);

  // ─── Computed ──────────────────────────────────────────────
  const items = skus.map((s) => ({ sku: s, name: DEVICE_NAMES[s], amountPaise: (prices[s as DeviceSku] || 0) * 100 }));
  const totalPaise = items.reduce((sum, d) => sum + d.amountPaise, 0);
  const totalRupees = totalPaise / 100;

  // ─── Preload Razorpay + InitiateCheckout pixel ──────────────
  useEffect(() => {
    loadRazorpay();
    if (typeof window !== "undefined" && (window as any).fbq && skus.length > 0) {
      try {
        (window as any).fbq("track", "InitiateCheckout", {
          content_ids: skus,
          content_type: "product",
          num_items: skus.length,
          value: totalRupees,
          currency: "INR",
        });
      } catch (e) {
        console.error("Meta Pixel InitiateCheckout error:", e);
      }
    }
  }, []);

  // ─── Pincode auto-fill ─────────────────────────────────────
  const handlePincodeChange = useCallback(async (val: string) => {
    const clean = val.replace(/\D/g, "").slice(0, 6);
    setPincode(clean);
    setPincodeChecked(false);
    setCityAutoFilled(false);

    if (clean.length === 6) {
      setPincodeLoading(true);
      const result = await lookupPincode(clean);
      setPincodeLoading(false);
      setPincodeChecked(true);
      if (result) {
        setCity(result.city);
        setState(result.state);
        setCityAutoFilled(true);
      } else {
        setCity("");
        setState("");
        setCityAutoFilled(false);
      }
    }
  }, []);

  const step1Valid = pincode.length === 6 && addressLine1.trim().length >= 4 && city.trim().length > 0 && state.trim().length > 0;
  const step2Valid = fullName.trim().length >= 2 && /^\d{10}$/.test(phone);

  // ─── Meta Pixel Purchase event on success ───────────────────
  useEffect(() => {
    if (pageState === "success" && typeof window !== "undefined" && (window as any).fbq) {
      try {
        (window as any).fbq("track", "Purchase", {
          value: totalRupees,
          currency: "INR",
          content_ids: skus,
          content_type: "product",
          num_items: skus.length,
        });
      } catch (e) {
        console.error("Meta Pixel Purchase error:", e);
      }
    }
  }, [pageState, totalRupees, skus]);

  if (skus.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="text-xl font-bold text-foreground">No device selected</h1>
          <p className="text-muted-foreground">Please select a device to purchase.</p>
          <Button asChild><Link to="/devices">Browse Devices</Link></Button>
        </div>
      </div>
    );
  }

  // ─── Payment flow ──────────────────────────────────────────
  const handlePay = async () => {
    setPaying(true);
    setPageState("processing");
    setErrorMsg("");

    try {
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const recipientEmail = email.trim() || `${cleanPhone}@noemail.agatsa.com`;

      // 1. Create order via backend API
      const createRes = await fetch(`${API_BASE}/v1/orders/website/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skus,
          recipientName: fullName.trim(),
          recipientPhone: "+91" + cleanPhone,
          recipientEmail: recipientEmail,
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        }),
      });

      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        console.error("Order creation failed:", createRes.status, createData);
        throw new Error(createData.error || createData.message || `Order creation failed (${createRes.status})`);
      }

      const razorpayOrderId = createData.razorpayOrderId || createData.razorpay_order_id;
      const websiteOrderId = createData.websiteOrderId;
      if (!razorpayOrderId) throw new Error("Missing Razorpay order ID in response");

      // 2. Open Razorpay
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error("Failed to load payment gateway");

      setPageState("form"); // hide processing overlay while Razorpay modal is open

      await new Promise<void>((resolve, reject) => {
        const rzp = new (window as any).Razorpay({
          key: createData.keyId || "rzp_live_SVjGEVthft6CGI",
          amount: createData.amount || totalPaise,
          currency: createData.currency || "INR",
          name: "Agatsa One",
          description: items.map((d) => d.name).join(", "),
          order_id: razorpayOrderId,
          prefill: {
            name: fullName.trim(),
            email: recipientEmail,
            contact: "+91" + cleanPhone,
          },
          theme: { color: "#7C4DFF" },
          handler: async (response: any) => {
            // 3. Verify payment
            setPageState("processing");
            try {
              const verifyRes = await fetch(`${API_BASE}/v1/orders/website/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  websiteOrderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json().catch(() => ({}));
              if (!verifyRes.ok) throw new Error(verifyData.error || "Payment verification failed");
              setPageState("success");
              resolve();
            } catch (err: any) {
              setErrorMsg(err.message || "Payment verification failed");
              setPageState("error");
              reject(err);
            }
          },
          modal: {
            ondismiss: () => {
              setPaying(false);
              setPageState("form");
              reject(new Error("cancelled"));
            },
            backdropclose: false,
            escape: false,
          },
        });
        rzp.open();
      });
    } catch (err: any) {
      if (err.message !== "cancelled") {
        setErrorMsg(err.message || "Something went wrong");
        setPageState("error");
      }
      setPaying(false);
    }
  };

  // ─── Success state ─────────────────────────────────────────
  if (pageState === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Your device ships within 2–4 business days. You'll receive a confirmation on your phone shortly.
          </p>
          <div className="bg-muted/50 rounded-xl p-4 text-sm space-y-1">
            <p className="font-medium text-foreground">Shipping to</p>
            <p className="text-muted-foreground">{fullName}</p>
            <p className="text-muted-foreground">{addressLine1}, {city}, {state} - {pincode}</p>
            <p className="text-muted-foreground">+91 {phone}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            📱 Download the <strong>Agatsa One</strong> app and log in with <strong>+91 {phone}</strong> to activate your device and Nera AI plan.
          </p>
          <div className="flex gap-3 justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/app">Download App</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error state ───────────────────────────────────────────
  if (pageState === "error") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Payment Failed</h1>
          <p className="text-muted-foreground">{errorMsg || "Something went wrong. Please try again."}</p>
          <Button onClick={() => { setPageState("form"); setPaying(false); setErrorMsg(""); }} className="rounded-full px-8">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // ─── Processing overlay ────────────────────────────────────
  if (pageState === "processing") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
          <p className="text-foreground font-medium">Processing your order…</p>
          <p className="text-sm text-muted-foreground">Please don't close this page.</p>
        </div>
      </div>
    );
  }

  // ─── Main form ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8 sm:py-12">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/">
            <img src={agatsaLogo} alt="Agatsa" className="h-8" />
          </Link>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Step {step} of 2</span>
            <span>{step === 1 ? "Delivery Address" : "Contact & Pay"}</span>
          </div>
          <Progress value={step === 1 ? 50 : 100} className="h-2" />
        </div>

        {/* Order summary pill */}
        <div className="bg-muted/50 rounded-xl p-4 mb-8 border border-border">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              {items.map((d) => (
                <p key={d.sku} className="text-sm font-medium text-foreground">{d.name}</p>
              ))}
              <p className="text-xs text-primary font-medium">+ Free 1-year Nera AI Plan</p>
            </div>
            <span className="text-xl font-bold text-foreground">₹{totalRupees.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Step 1: Delivery Address */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-foreground">Delivery Address</h2>

            {/* Pincode */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Pincode</label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                />
                {pincodeLoading && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
                )}
              </div>
              {pincodeChecked && cityAutoFilled && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Delivering to {city}, {state}
                </p>
              )}
            </div>

            {/* City & State */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">State</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full px-4 py-3 border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background"
                />
              </div>
            </div>

            {/* Address line 1 */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">House / Flat / Street</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="e.g. Flat 201, Green Towers, MG Road"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            </div>

            {/* Address line 2 */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Landmark <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="e.g. Near City Hospital"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            </div>

            <Button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className={`w-full rounded-xl py-6 text-base font-semibold mt-2 ${
                !step1Valid ? "!bg-gray-300 !text-gray-500 !opacity-100 cursor-not-allowed" : ""
              }`}
            >
              Continue to Payment
            </Button>
          </div>
        )}

        {/* Step 2: Contact & Pay */}
        {step === 2 && (
          <div className="space-y-4">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <h2 className="text-lg font-bold text-foreground">Contact Details</h2>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            </div>

            {/* Mobile Number */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Mobile Number</label>
              <div className="flex">
                <span className="flex items-center px-3 border border-r-0 border-border rounded-l-xl bg-muted text-sm text-muted-foreground">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="flex-1 px-4 py-3 border border-border rounded-r-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Use your Agatsa One app number for automatic plan activation</p>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">
                Email <span className="text-muted-foreground font-normal">— for invoice (optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-border rounded-xl text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm"
              />
            </div>

            {/* Shipping summary */}
            <div className="bg-muted/30 rounded-xl p-3 text-sm text-muted-foreground border border-border">
              <p className="font-medium text-foreground mb-1">Shipping to</p>
              <p>{addressLine1}{addressLine2 ? `, ${addressLine2}` : ""}</p>
              <p>{city}, {state} - {pincode}</p>
            </div>

            {/* Pay button */}
            <Button
              onClick={handlePay}
              disabled={!step2Valid || paying}
              className="w-full rounded-xl py-6 text-base font-semibold mt-2"
            >
              {paying ? (
                <span className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Processing…</span>
              ) : (
                <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Pay ₹{totalRupees.toLocaleString("en-IN")} securely</span>
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              UPI · Cards · Net Banking · EMI · Secured by Razorpay
            </p>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> 256-bit SSL</span>
              <span className="flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-green-600" /> PCI-DSS Compliant</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
