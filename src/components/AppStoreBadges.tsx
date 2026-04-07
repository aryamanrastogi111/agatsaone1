import { Apple, Play } from "lucide-react";

interface AppStoreBadgesProps {
  className?: string;
  variant?: "default" | "stacked";
}

const iosUrl = import.meta.env.VITE_IOS_APP_STORE_URL || "https://apps.apple.com/in/app/agatsa-one/id6760245564";
const androidUrl = import.meta.env.VITE_ANDROID_PLAY_URL || "https://play.google.com/store/apps/details?id=com.agatsakone";

export function AppStoreBadges({ className = "", variant = "default" }: AppStoreBadgesProps) {
  return (
    <div className={`flex ${variant === "stacked" ? "flex-col" : "flex-row"} gap-3 ${className}`}>
      {/* iOS */}
      <a
        href={iosUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-foreground text-background rounded-xl px-5 py-3 hover:opacity-90 transition-opacity"
      >
        <Apple className="h-6 w-6 shrink-0" />
        <div className="text-left leading-tight">
          <span className="text-[10px] opacity-80">Download on the</span>
          <br />
          <span className="text-sm font-semibold">App Store</span>
        </div>
      </a>

      {/* Android */}
      <a
        href={androidUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 bg-primary text-primary-foreground rounded-xl px-5 py-3 hover:opacity-90 transition-opacity"
      >
        <Play className="h-6 w-6 shrink-0 fill-current" />
        <div className="text-left leading-tight">
          <span className="text-[10px] opacity-80">Get it on</span>
          <br />
          <span className="text-sm font-semibold">Google Play</span>
        </div>
      </a>
    </div>
  );
}
