import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.agatsakone";
const APP_STORE = "https://apps.apple.com/in/app/agatsa-one/id6760245564";

export default function LoseBellyWelcome() {
  useSEO({
    title: "You're enrolled · Lose Your Belly 90 | Agatsa One",
    description: "Welcome to Lose Your Belly 90. Download the Agatsa One app to begin Day 0.",
  });

  const [params] = useSearchParams();
  const orderId = params.get("orderId") || "";
  const phone = params.get("phone") || "";

  const isIOS = useMemo(
    () => typeof navigator !== "undefined" && /iPhone|iPad|iPod/i.test(navigator.userAgent),
    []
  );

  return (
    <SiteLayout>
      <div className="container mx-auto max-w-2xl px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 className="mx-auto h-20 w-20 text-[#1F7A4D]" />
        </motion.div>
        <h1 className="mt-6 text-3xl font-bold text-[#0B2A4A] md:text-4xl">
          You're enrolled. Day 0 starts now.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          We've sent a download link to <strong className="text-[#0B2A4A]">{phone || "your phone"}</strong>.
          Tap it from your phone, install the Agatsa One app, and log in with this same number.
          The app already knows you're enrolled.
        </p>

        <div className={`mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center ${isIOS ? "sm:flex-row-reverse" : ""}`}>
          <Button asChild size="lg" className="h-14 bg-[#0B2A4A] text-white hover:bg-[#0B2A4A]/90">
            <a href={PLAY_STORE} target="_blank" rel="noreferrer">
              <Smartphone className="mr-2 h-5 w-5" /> Get on Google Play
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14">
            <a href={APP_STORE} target="_blank" rel="noreferrer">
               Get on App Store
            </a>
          </Button>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Smart scale ships in 5–7 days to your address. Welcome kit in 48 hours.
        </p>
        {orderId && (
          <p className="mt-6 font-mono text-xs text-muted-foreground">
            Order ref: {orderId}
          </p>
        )}
        <Link to="/" className="mt-8 inline-block text-sm text-[#007A7C] underline">
          Back to home
        </Link>
      </div>
    </SiteLayout>
  );
}
