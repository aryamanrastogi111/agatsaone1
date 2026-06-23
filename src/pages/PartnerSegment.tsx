import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Users, Mail } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";
import { PARTNER_SEGMENT_BY_SLUG, PARTNER_SEGMENTS } from "@/data/partnerSegments";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

export default function PartnerSegment() {
  const { slug } = useParams<{ slug: string }>();
  const segment = slug ? PARTNER_SEGMENT_BY_SLUG[slug] : undefined;

  useSEO({
    title: segment
      ? `${segment.shortTitle} — Partner with Agatsa`
      : "Partner with Agatsa",
    description: segment?.tagline ?? "Partner with Agatsa.",
  });

  if (!segment) return <Navigate to="/partner-with-us" replace />;

  const ctaHref = `/partner-with-us?type=${segment.partnerTypeId}`;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="pt-12 pb-10 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div {...fade}>
            <Link
              to="/partner-with-us"
              className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-3 hover:underline"
            >
              ← Partnerships
            </Link>
            <div className="text-5xl mb-4" aria-hidden>
              {segment.emoji}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
              {segment.title}
            </h1>
            <p className="text-lg text-primary font-medium mt-4">{segment.tagline}</p>
            <p className="text-base text-muted-foreground mt-4 max-w-2xl mx-auto">
              {segment.heroDescription}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={ctaHref}>
                <Button size="lg" className="rounded-full bg-primary text-primary-foreground px-7">
                  Start partnership enquiry <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="mailto:info@agatsa.com">
                <Button size="lg" variant="outline" className="rounded-full px-7 w-full sm:w-auto">
                  <Mail className="h-4 w-4 mr-2" /> Email the team
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-14 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fade} className="mb-8 flex items-center gap-3">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Who it's for</h2>
          </motion.div>
          <motion.div {...fade} className="grid sm:grid-cols-2 gap-3">
            {segment.whoItsFor.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 bg-card border border-border rounded-xl p-4"
              >
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4">
          <motion.h2 {...fade} className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            What we offer
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-5">
            {segment.services.map((s, i) => (
              <motion.div
                key={s.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Agatsa */}
      <section className="py-14 bg-background">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fade} className="mb-8 flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why Agatsa</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {segment.whyAgatsa.map((w, i) => (
              <motion.div
                key={w.title}
                {...fade}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-card border border-border rounded-2xl p-6"
              >
                <h3 className="text-base font-bold text-foreground">{w.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {w.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-14 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <motion.h2 {...fade} className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Outcomes you can expect
          </motion.h2>
          <motion.ul {...fade} className="space-y-3">
            {segment.outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>{o}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <motion.div {...fade} className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to start?</h2>
          <p className="mt-3 opacity-90">
            Fill the partnership questionnaire — pre-set for {segment.shortTitle.toLowerCase()} — and our team will respond within 2 business days.
          </p>
          <Link to={ctaHref}>
            <Button
              size="lg"
              className="mt-6 rounded-full bg-white text-primary hover:bg-white/90 font-semibold px-8"
            >
              Fill partnership form <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Other segments */}
      <section className="py-14 bg-background border-t border-border">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            Other partnership segments
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PARTNER_SEGMENTS.filter((s) => s.slug !== segment.slug).map((s) => (
              <Link
                key={s.slug}
                to={`/partner/segments/${s.slug}`}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary hover:shadow-sm transition-all flex items-start gap-3"
              >
                <span className="text-2xl" aria-hidden>{s.emoji}</span>
                <div>
                  <div className="font-semibold text-foreground text-sm">{s.shortTitle}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.tagline}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
