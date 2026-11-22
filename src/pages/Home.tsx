import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import {
  HeroSection,
  AudienceSplitSection,
  DeviceShowcaseSection,
  NeraAISection,
  ProofStripSection,
  ClinicalProofSection,
  FeaturedSpotlightSection,
  TestimonialsSection,
  B2BBandSection,
  JournalSection,
  FinalCTASection,
} from "@/components/home-new";

export default function HomePage() {
  useSEO({ title: "Agatsa — AI-Powered Personal Health Devices | SanketLife ECG, EasyTouch, Rhythm Band, Zlu", description: "Agatsa leads the way in AI-powered personal health. SanketLife ECG, EasyTouch Wellness, Rhythm Band and Zlu connect to Agatsa One, where Nera AI turns your readings into clear, personal health insights. 2.1 Lac+ users. Download free." });

  return (
    <SiteLayout>
      <HeroSection />
      <AudienceSplitSection />
      <DeviceShowcaseSection />
      <NeraAISection />
      <ProofStripSection />
      <ClinicalProofSection />
      <FeaturedSpotlightSection />
      <TestimonialsSection />
      <B2BBandSection />
      <JournalSection />
      <FinalCTASection />
    </SiteLayout>
  );
}
