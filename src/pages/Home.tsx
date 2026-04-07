import { useSEO } from "@/hooks/useSEO";
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
  useSEO({ title: "Agatsa One — AI Health Monitoring Powered by Nera AI | ECG, Glucose, BP", description: "Agatsa One connects to medical-grade ECG, glucose, BP, and wellness devices — then uses Nera AI to give you weekly health reports, early warnings, and a voice health assistant. 50,000+ users. CDSCO certified. Download free." });

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
