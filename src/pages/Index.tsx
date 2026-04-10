import { Layout } from "@/components/layout";
import {
  HeroSection,
  ChooseByNeedSection,
  ProductsPortfolioSection,
  ProductHighlightSanketLife,
  ProductHighlightEasyTouch,
  ProductHighlightZlu,
  ProductHighlightCoreBalance,
  WhyAgatsaSection,
  AwardsSection,
  TrustProofSection,
  FinalCTASection,
} from "@/components/home";
import { VideoShowcaseSection } from "@/components/home/VideoShowcaseSection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ChooseByNeedSection />
      <ProductsPortfolioSection />
      <ProductHighlightSanketLife />
      <ProductHighlightEasyTouch />
      <ProductHighlightZlu />
      <ProductHighlightCoreBalance />
      <VideoShowcaseSection />
      <WhyAgatsaSection />
      <AwardsSection />
      <TrustProofSection />
      <FinalCTASection />
    </Layout>
  );
};

export default Index;
