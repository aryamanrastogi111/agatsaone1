import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { products } from "@/data/products";

const comparisonFeatures = [
  { name: "Medical-grade accuracy", products: { sanketlife: true, "easytouch-rhythm": true, zlu: false, corebalance: true } },
  { name: "Daily monitoring", products: { sanketlife: true, "easytouch-rhythm": true, zlu: true, corebalance: true } },
  { name: "Wearable design", products: { sanketlife: false, "easytouch-rhythm": true, zlu: false, corebalance: false } },
  { name: "App connectivity", products: { sanketlife: true, "easytouch-rhythm": true, zlu: false, corebalance: true } },
  { name: "PDF reports", products: { sanketlife: true, "easytouch-rhythm": true, zlu: false, corebalance: true } },
  { name: "Multi-user profiles", products: { sanketlife: true, "easytouch-rhythm": false, zlu: false, corebalance: true } },
];

const Compare = () => {
  return (
    <Layout>
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Compare Products</h1>
            <p className="text-muted-foreground">Find the perfect device for your needs</p>
          </motion.div>
        </div>
      </section>

      <section className="py-8 bg-background overflow-x-auto">
        <div className="container">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div></div>
              {products.map((p) => (
                <div key={p.id} className="text-center">
                  <img src={p.image} alt={p.name} className="h-24 object-contain mx-auto mb-2" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
                  <h3 className="font-semibold text-foreground">{p.name}</h3>
                  <p className="text-xs text-primary">{p.tagline}</p>
                </div>
              ))}
            </div>
            
            {comparisonFeatures.map((feature, i) => (
              <div key={i} className={`grid grid-cols-5 gap-4 py-4 ${i % 2 === 0 ? 'bg-muted/30' : ''} rounded-lg`}>
                <div className="px-4 font-medium text-foreground">{feature.name}</div>
                {products.map((p) => (
                  <div key={p.id} className="text-center">
                    {feature.products[p.id as keyof typeof feature.products] ? (
                      <Check className="h-5 w-5 text-primary mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </div>
                ))}
              </div>
            ))}
            
            <div className="grid grid-cols-5 gap-4 mt-8">
              <div></div>
              {products.map((p) => (
                <div key={p.id} className="text-center">
                  <Button asChild size="sm" className="w-full">
                    {p.isExternal ? (
                      <a href={p.link} target="_blank" rel="noopener noreferrer">
                        Visit <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    ) : (
                      <Link to={p.link}>Learn more <ArrowRight className="h-3 w-3 ml-1" /></Link>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Compare;
