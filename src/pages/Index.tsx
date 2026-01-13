import { Layout } from "@/components/layout";
import {
  HeroSection,
  ChooseByNeedSection,
  ProductsPortfolioSection,
  WhyAgatsaSection,
  TrustProofSection,
  FinalCTASection,
} from "@/components/home";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ChooseByNeedSection />
      <ProductsPortfolioSection />
      <WhyAgatsaSection />
      <TrustProofSection />
      <FinalCTASection />
    </Layout>
  );
};

export default Index;
