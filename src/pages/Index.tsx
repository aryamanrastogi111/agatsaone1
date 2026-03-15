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
      <WhyAgatsaSection />
      <AwardsSection />
      <TrustProofSection />
      <FinalCTASection />
    </Layout>
  );
};

export default Index;
