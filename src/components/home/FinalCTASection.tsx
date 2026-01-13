import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function FinalCTASection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Not sure which device is right for you?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Take our quick quiz to find the perfect health monitoring solution
            for your needs, or speak with our team for personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link to="/device-finder">Find the right device</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="/support#contact">Talk to us</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
