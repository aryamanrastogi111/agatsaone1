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
  // HeartGuardTeaserSection, // hidden for now
} from "@/components/home-new";
import { VideoShowcaseSection } from "@/components/home/VideoShowcaseSection";
import { AwardsTrustSection } from "@/components/AwardsTrustSection";
import { TrustVideosSection } from "@/components/TrustVideosSection";

export default function HomePage() {
  useSEO({ title: "Agatsa — Leading AI-Powered Personal Health Devices | SanketLife ECG, MultiVital, EasyTouch, Zlu", description: "Agatsa leads the way in AI-powered personal health. SanketLife ECG, MultiVital, EasyTouch Wellness and Zlu connect to Agatsa One, where Nera AI turns your readings into clear, personal health insights. 2.1 Lac+ users. Download free." });

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
      {/* HeartGuardTeaserSection hidden for now */}
      <ProvidersSection />
      <TestimonialsSection />
      <TrustVideosSection />
      <AwardsTrustSection />
      <FinalCTASection />
    </SiteLayout>
  );
}
