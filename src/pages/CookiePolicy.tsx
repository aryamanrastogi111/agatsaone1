import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Cookie, Shield, Settings, ToggleLeft } from "lucide-react";

const fade = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const cookieTypes = [
  {
    name: "Essential Cookies",
    required: true,
    desc: "These cookies are necessary for the website to function. They enable core features like page navigation, secure access, and session management. You cannot disable these cookies.",
    examples: "Session ID, CSRF token, authentication state",
  },
  {
    name: "Analytics Cookies",
    required: false,
    desc: "These cookies help us understand how visitors interact with our website by collecting anonymous usage data. We use this information to improve the user experience.",
    examples: "Google Analytics (_ga, _gid), page view tracking, scroll depth",
  },
  {
    name: "Marketing Cookies",
    required: false,
    desc: "These cookies are used to deliver relevant advertisements and measure the effectiveness of our marketing campaigns. They may be set by third-party advertising partners.",
    examples: "Meta Pixel (_fbp), Google Ads conversion tracking, TikTok Pixel",
  },
  {
    name: "Functional Cookies",
    required: false,
    desc: "These cookies enable enhanced functionality and personalisation, such as remembering your preferences, language settings, or region.",
    examples: "Language preference, theme preference, recently viewed devices",
  },
];

export default function CookiePolicy() {
  useSEO({ title: "Cookie Policy — Agatsa One", description: "Learn about how Agatsa uses cookies on our website. Manage your cookie preferences and understand what data we collect." });

  return (
    <SiteLayout>
      <section className="pt-16 pb-12 text-center" style={{ background: "linear-gradient(180deg, hsl(var(--primary) / 0.05) 0%, hsl(var(--background)) 100%)" }}>
        <motion.div {...fade} className="max-w-3xl mx-auto px-4">
          <Cookie className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Cookie Policy</h1>
          <p className="text-lg text-muted-foreground mt-4">How Agatsa uses cookies and similar technologies on our website</p>
          <p className="text-sm text-muted-foreground mt-2">Last updated: April 2026</p>
        </motion.div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-3xl mx-auto px-4 space-y-12">
          {/* Intro */}
          <motion.div {...fade} className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Shield className="h-6 w-6 text-primary" /> What Are Cookies?</h2>
            <p className="text-muted-foreground leading-relaxed">Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, understand how you use the site, and improve your experience. Some cookies are essential for the website to work; others help us analyse traffic and personalise content.</p>
          </motion.div>

          {/* Cookie types */}
          <motion.div {...fade} className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><Settings className="h-6 w-6 text-primary" /> Types of Cookies We Use</h2>
            {cookieTypes.map((c, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground">{c.name}</h3>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.required ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {c.required ? "Required" : "Optional"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
                <p className="text-xs text-muted-foreground mt-2"><span className="font-medium text-foreground">Examples:</span> {c.examples}</p>
              </div>
            ))}
          </motion.div>

          {/* Managing cookies */}
          <motion.div {...fade} className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2"><ToggleLeft className="h-6 w-6 text-primary" /> Managing Your Cookie Preferences</h2>
            <p className="text-muted-foreground leading-relaxed">You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies. However, if you block essential cookies, some parts of our website may not function correctly.</p>
            <div className="bg-muted/50 rounded-xl p-5 space-y-2">
              <p className="text-sm font-semibold text-foreground">Browser cookie settings:</p>
              {["Chrome: Settings → Privacy and Security → Cookies", "Safari: Preferences → Privacy → Manage Website Data", "Firefox: Settings → Privacy & Security → Cookies", "Edge: Settings → Cookies and Site Permissions"].map((b, i) => (
                <p key={i} className="text-sm text-muted-foreground">• {b}</p>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div {...fade} className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold text-foreground mb-2">Questions about our cookie policy?</h3>
            <p className="text-sm text-muted-foreground">Contact us at <a href="mailto:privacy@agatsa.com" className="text-primary font-medium">privacy@agatsa.com</a> or visit our <a href="/privacy-policy" className="text-primary font-medium underline">Privacy Policy</a> for more information about how we handle your data.</p>
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}
