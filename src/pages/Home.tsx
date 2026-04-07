import { SiteLayout } from "@/components/SiteLayout";
import {
  HeroSection,
  ProblemSection,
  HowItWorksSection,
  DeviceShowcaseSection,
  CareProgrammesSection,
  NeraAISection,
  ClinicalProofSection,
  ProvidersSection,
  TestimonialsSection,
  FinalCTASection,
} from "@/components/home-new";

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <DeviceShowcaseSection />
      <CareProgrammesSection />
      <NeraAISection />
      <ClinicalProofSection />
      <ProvidersSection />
      <TestimonialsSection />
      <FinalCTASection />
    </SiteLayout>
  );
}
