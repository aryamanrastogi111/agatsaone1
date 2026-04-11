import { useEffect } from "react";

const APPSTORE_URL = "https://apps.apple.com/app/id6760245564";
const PLAYSTORE_URL = "https://play.google.com/store/apps/details?id=com.agatsakone";

export default function Heritage() {
  useEffect(() => {
    document.title = "Your Heritage Report — Agatsa One";
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-start justify-center px-5">
      <div className="w-full max-w-[480px] py-8 pb-16">

        {/* 1. Logo */}
        <div className="text-center pt-4 mb-14">
          <span className="text-xl font-bold tracking-tight text-foreground">
            agatsa <span className="text-primary">one</span>
          </span>
        </div>

        {/* 2. Hero */}
        <div className="text-center mb-14 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            For SanketLife users
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight text-foreground">
            Your heart has been talking.
            <br />
            Now you can hear it.
          </h1>
          <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-[420px] mx-auto">
            Every ECG you ever took with your SanketLife device is now inside Agatsa One
            — analysed by Nera AI. Your Heritage Report is waiting for you.
          </p>
        </div>

        {/* 3. Value list */}
        <div className="space-y-5 mb-14">
          {[
            { emoji: "📊", text: "Your complete ECG history in one view" },
            { emoji: "🧠", text: "AI patterns detected across months or years of readings" },
            { emoji: "❤️", text: "See if your heart health has improved, stayed stable, or needs attention" },
          ].map((item) => (
            <div key={item.emoji} className="flex items-start gap-4">
              <span className="text-2xl leading-none mt-0.5 shrink-0">{item.emoji}</span>
              <p className="text-[15px] leading-relaxed text-foreground/80">{item.text}</p>
            </div>
          ))}
        </div>

        {/* 4. Download buttons */}
        <div className="text-center space-y-4 mb-16">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Free to download
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={APPSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-foreground text-background rounded-xl px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              Download on the App Store
            </a>

            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-foreground/90 text-background rounded-xl px-6 py-3.5 text-sm font-semibold hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33c.576.334.576 1.17 0 1.504L17.698 13.7 15.19 12l2.508-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.635-8.635z" />
              </svg>
              Get it on Google Play
            </a>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed max-w-[380px] mx-auto pt-1">
            Sign in with your SanketLife phone number — your ECG history is already there.
          </p>
        </div>

        {/* 5. Trust line */}
        <p className="text-center text-xs text-muted-foreground/60">
          Made by the team behind SanketLife · Trusted by 2,00,000+ users
        </p>
      </div>
    </div>
  );
}
