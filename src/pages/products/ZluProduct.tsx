import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Moon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { products } from "@/data/products";

const zlu = products.find(p => p.id === "zlu")!;

const ZluProduct = () => (
  <Layout>
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4">
              <Moon className="h-6 w-6 text-primary" />
              <span className="text-primary font-medium">Sleep Support</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{zlu.name}</h1>
            <p className="text-xl text-primary mb-4">{zlu.tagline}</p>
            <p className="text-muted-foreground mb-6">{zlu.description}</p>
            <p className="text-3xl font-bold text-foreground mb-6">{zlu.price}</p>
            <div className="flex gap-4">
              <Button size="lg">Buy Now</Button>
              <Button variant="outline" size="lg" asChild><Link to="/support#contact">Contact Support</Link></Button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-2xl p-8 border">
            <img src={zlu.image} alt={zlu.name} className="max-h-64 object-contain mx-auto" onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }} />
          </motion.div>
        </div>
      </div>
    </section>
    <section className="py-16 bg-background">
      <div className="container max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">Key Benefits</h2>
        <ul className="space-y-4 mb-12">
          {zlu.benefits.map((b, i) => (
            <li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 text-primary mt-0.5" /><span>{b}</span></li>
          ))}
        </ul>
        <h2 className="text-2xl font-bold text-foreground mb-6">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {zlu.features?.map((f, i) => (
            <div key={i} className="bg-muted/50 rounded-xl p-4 flex items-center gap-3">
              <Check className="h-5 w-5 text-primary" /><span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="py-16 bg-muted/30">
      <div className="container text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to sleep better?</h2>
        <Button size="lg">Buy Now – {zlu.price}</Button>
      </div>
    </section>
  </Layout>
);

export default ZluProduct;
