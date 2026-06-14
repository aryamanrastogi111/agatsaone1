import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import {
  HeroSection,
  ProblemSection,
  IntersectionSection,
  DeviceShowcaseSection,
  TimelineInsightSection,
  NeraAISection,
  ClinicalProofSection,
  ProvidersSection,
  TestimonialsSection,
  FinalCTASection,
  HeartGuardTeaserSection,
} from "@/components/home-new";
import { VideoShowcaseSection } from "@/components/home/VideoShowcaseSection";
import { AwardsTrustSection } from "@/components/AwardsTrustSection";
import { TrustVideosSection } from "@/components/TrustVideosSection";

export default function HomePage() {
  useSEO({ title: "Agatsa One — AI Health Monitoring Powered by Nera AI | ECG, Metabolic Health, BP", description: "Agatsa One connects to medical-grade ECG, metabolic health, BP, and wellness devices — then uses Nera AI to give you weekly health reports, early warnings, and a voice health assistant. 2.1 Lac+ users. CDSCO certified. Download free." });

  return (
    <SiteLayout>
      <HeroSection />
      <ProblemSection />
      <IntersectionSection />
      <TimelineInsightSection />
      <NeraAISection />
      <DeviceShowcaseSection />
      <VideoShowcaseSection />
      <ClinicalProofSection />
      <HeartGuardTeaserSection />
      <ProvidersSection />
      <TestimonialsSection />
      <TrustVideosSection />
      <AwardsTrustSection />
      <FinalCTASection />
    </SiteLayout>
  );
}
