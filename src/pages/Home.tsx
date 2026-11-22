import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import {
  HeroSection,
  AudienceSection,
  ProductEditorialSection,
  NeraConnectedSection,
  EvidenceSection,
  StorySection,
  DualCTASection,
} from "@/components/home-v3";

export default function HomePage() {
  useSEO({ title: "Agatsa — Your Health. A Bigger Picture. | SanketLife ECG, EasyTouch, Rhythm Band", description: "From heart monitoring to everyday wellness, explore Agatsa's connected devices and NERA AI insights designed to help you understand your health." });

  return (
    <SiteLayout theme="luxe">
      <HeroSection />
      <ProductEditorialSection />
      <AudienceSection />
      <NeraConnectedSection />
      <EvidenceSection />
      <StorySection />
      <DualCTASection />
    </SiteLayout>
  );
}
