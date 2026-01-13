import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Health monitoring{" "}
              <span className="text-primary">made simple.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Smart, non-invasive health devices designed to help you understand
              your body better — at home and on the go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="text-base">
                <Link to="/products">Explore Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/device-finder">Find the right device</Link>
              </Button>
            </div>
          </motion.div>

          {/* Product Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Background circles */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent to-transparent rounded-full opacity-50" />
              
              {/* Floating products */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/4 w-32 h-32 md:w-40 md:h-40"
              >
                <img
                  src={products[0].image}
                  alt={products[0].name}
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </motion.div>
              
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 right-0 w-28 h-28 md:w-36 md:h-36"
              >
                <img
                  src={products[1].image}
                  alt={products[1].name}
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </motion.div>
              
              <motion.div
                animate={{ y: [-3, 7, -3] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-1/4 left-0 w-24 h-24 md:w-32 md:h-32"
              >
                <img
                  src={products[2].image}
                  alt={products[2].name}
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </motion.div>
              
              <motion.div
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 right-1/4 w-28 h-28 md:w-36 md:h-36"
              >
                <img
                  src={products[3].image}
                  alt={products[3].name}
                  className="w-full h-full object-contain drop-shadow-xl"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
