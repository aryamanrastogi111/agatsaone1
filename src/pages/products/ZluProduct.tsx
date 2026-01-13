import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import zluHero from "@/assets/zlu-hero.png";

// Animated text component that reveals on scroll
const RevealText = ({ 
  children, 
  delay = 0, 
  className = "" 
}: { 
  children: React.ReactNode; 
  delay?: number; 
  className?: string;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Section wrapper with consistent spacing
const SleepSection = ({ 
  children, 
  className = "",
  id
}: { 
  children: React.ReactNode; 
  className?: string;
  id?: string;
}) => (
  <section id={id} className={`py-24 md:py-32 lg:py-40 ${className}`}>
    <div className="container max-w-4xl mx-auto px-6">
      {children}
    </div>
  </section>
);

const ZluProduct = () => {
  return (
    <Layout>
      {/* 1. Opening Mood */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyan-50/30 via-white to-white relative overflow-hidden">
        {/* Ambient glow behind device */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-cyan-100/40 rounded-full blur-3xl animate-glow-pulse" />
        </div>
        
        <div className="container max-w-4xl mx-auto px-6 text-center relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-12"
          >
            <img 
              src={zluHero} 
              alt="Zlu Sleep Aid" 
              className="max-h-[320px] md:max-h-[400px] object-contain mx-auto animate-drift"
              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
            />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-3xl lg:text-4xl text-foreground/80 font-light tracking-wide"
          >
            Let your body remember how to rest.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="mt-16"
          >
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-cyan-300/50 to-transparent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* 2. The Modern Sleep Problem */}
      <SleepSection className="bg-white">
        <div className="space-y-16 md:space-y-20">
          <RevealText delay={0}>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/70 font-light leading-relaxed">
              The mind races.
            </p>
          </RevealText>
          
          <RevealText delay={0.15}>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/70 font-light leading-relaxed">
              The body stays awake.
            </p>
          </RevealText>
          
          <RevealText delay={0.3}>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl">
              You know the feeling—lying in bed, exhausted, yet somehow alert. The more you try to sleep, the further it slips away.
            </p>
          </RevealText>
          
          <RevealText delay={0.45}>
            <p className="text-lg md:text-xl text-muted-foreground/80 font-light italic">
              And the fear of pills, supplements, dependency...
            </p>
          </RevealText>
        </div>
      </SleepSection>

      {/* 3. A Different Way */}
      <SleepSection className="bg-gradient-to-b from-white via-cyan-50/20 to-white">
        <div className="space-y-12 md:space-y-16">
          <RevealText>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/80 font-light leading-relaxed">
              What if support didn't require effort?
            </p>
          </RevealText>
          
          <RevealText delay={0.2}>
            <div className="space-y-6 text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              <p>No pills to take.</p>
              <p>No device to wear.</p>
              <p>No routine to follow.</p>
            </div>
          </RevealText>
          
          <RevealText delay={0.4}>
            <div className="py-8 border-l-2 border-cyan-200/60 pl-8">
              <p className="text-xl md:text-2xl text-foreground/70 font-light leading-relaxed">
                Just keep it near you—and let your body do what it already knows.
              </p>
            </div>
          </RevealText>
        </div>
      </SleepSection>

      {/* 4. Natural Relaxation Support */}
      <SleepSection className="bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-50/30 to-transparent pointer-events-none" />
        
        <div className="relative space-y-12 md:space-y-16 text-center">
          <RevealText>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
              Zlu is designed to help your body settle into a calm, pre-sleep state.
            </p>
          </RevealText>
          
          <RevealText delay={0.2}>
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground/80 font-light leading-relaxed">
              The theta state.
            </p>
            <p className="text-lg md:text-xl text-muted-foreground/70 font-light mt-4">
              That quiet space between waking and dreaming.
            </p>
          </RevealText>
          
          <RevealText delay={0.4}>
            <div className="py-8">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent mx-auto mb-8" />
              <p className="text-lg md:text-xl text-foreground/60 font-light italic">
                Your body knows this place. Zlu simply makes it easier to find.
              </p>
            </div>
          </RevealText>
        </div>
      </SleepSection>

      {/* 5. Anywhere You Rest */}
      <SleepSection className="bg-gradient-to-b from-white to-cyan-50/20">
        <div className="space-y-16 md:space-y-20">
          <RevealText>
            <p className="text-2xl md:text-3xl text-foreground/80 font-light text-center mb-16">
              Anywhere you rest.
            </p>
          </RevealText>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <RevealText delay={0.1}>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto">
                  <div className="w-3 h-3 rounded-full bg-cyan-300/60" />
                </div>
                <p className="text-lg text-muted-foreground font-light">
                  At home, on a bedside table.
                </p>
              </div>
            </RevealText>
            
            <RevealText delay={0.25}>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto">
                  <div className="w-3 h-3 rounded-full bg-cyan-300/60" />
                </div>
                <p className="text-lg text-muted-foreground font-light">
                  On a flight, tucked nearby.
                </p>
              </div>
            </RevealText>
            
            <RevealText delay={0.4}>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto">
                  <div className="w-3 h-3 rounded-full bg-cyan-300/60" />
                </div>
                <p className="text-lg text-muted-foreground font-light">
                  In a hotel, in an unfamiliar room.
                </p>
              </div>
            </RevealText>
          </div>
          
          <RevealText delay={0.5}>
            <p className="text-xl text-foreground/60 font-light text-center italic">
              Wherever you need rest, Zlu goes with you.
            </p>
          </RevealText>
        </div>
      </SleepSection>

      {/* 6. Non-Addictive by Design */}
      <SleepSection className="bg-white">
        <div className="space-y-12 md:space-y-16">
          <RevealText>
            <p className="text-2xl md:text-3xl text-foreground/80 font-light text-center">
              Non-addictive by design.
            </p>
          </RevealText>
          
          <div className="max-w-xl mx-auto">
            <RevealText delay={0.15}>
              <div className="flex items-center gap-6 py-4 border-b border-cyan-100/50">
                <div className="w-2 h-2 rounded-full bg-cyan-300/60 flex-shrink-0" />
                <p className="text-lg text-muted-foreground font-light">No chemicals. No drugs.</p>
              </div>
            </RevealText>
            
            <RevealText delay={0.25}>
              <div className="flex items-center gap-6 py-4 border-b border-cyan-100/50">
                <div className="w-2 h-2 rounded-full bg-cyan-300/60 flex-shrink-0" />
                <p className="text-lg text-muted-foreground font-light">No habit formation. No withdrawal.</p>
              </div>
            </RevealText>
            
            <RevealText delay={0.35}>
              <div className="flex items-center gap-6 py-4 border-b border-cyan-100/50">
                <div className="w-2 h-2 rounded-full bg-cyan-300/60 flex-shrink-0" />
                <p className="text-lg text-muted-foreground font-light">Safe for long-term, repeated use.</p>
              </div>
            </RevealText>
          </div>
          
          <RevealText delay={0.5}>
            <p className="text-lg md:text-xl text-foreground/60 font-light text-center max-w-2xl mx-auto">
              Your body's natural ability to rest—supported, never forced.
            </p>
          </RevealText>
        </div>
      </SleepSection>

      {/* 7. Over Time */}
      <SleepSection className="bg-gradient-to-b from-white via-cyan-50/10 to-white">
        <div className="space-y-16">
          <RevealText>
            <p className="text-2xl md:text-3xl text-foreground/80 font-light text-center">
              Over time.
            </p>
          </RevealText>
          
          <div className="space-y-12">
            <RevealText delay={0.1}>
              <div className="flex items-start gap-8">
                <span className="text-5xl md:text-6xl font-extralight text-cyan-200/80">01</span>
                <div className="pt-3">
                  <p className="text-lg md:text-xl text-muted-foreground font-light">
                    Easier transition into rest.
                  </p>
                </div>
              </div>
            </RevealText>
            
            <RevealText delay={0.2}>
              <div className="flex items-start gap-8">
                <span className="text-5xl md:text-6xl font-extralight text-cyan-200/80">02</span>
                <div className="pt-3">
                  <p className="text-lg md:text-xl text-muted-foreground font-light">
                    Improved sleep readiness.
                  </p>
                </div>
              </div>
            </RevealText>
            
            <RevealText delay={0.3}>
              <div className="flex items-start gap-8">
                <span className="text-5xl md:text-6xl font-extralight text-cyan-200/80">03</span>
                <div className="pt-3">
                  <p className="text-lg md:text-xl text-muted-foreground font-light">
                    A calmer mind before bed.
                  </p>
                </div>
              </div>
            </RevealText>
          </div>
          
          <RevealText delay={0.5}>
            <p className="text-lg text-muted-foreground/70 font-light italic text-center">
              Not a promise—a possibility.
            </p>
          </RevealText>
        </div>
      </SleepSection>

      {/* 8. Gentle Close */}
      <section className="py-32 md:py-40 bg-gradient-to-b from-white to-cyan-50/30 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] bg-cyan-100/30 rounded-full blur-3xl animate-breathe" />
        </div>
        
        <div className="container max-w-3xl mx-auto px-6 text-center relative z-10">
          <RevealText>
            <img 
              src={zluHero} 
              alt="Zlu" 
              className="max-h-48 object-contain mx-auto mb-12 opacity-80"
              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
            />
          </RevealText>
          
          <RevealText delay={0.2}>
            <p className="text-2xl md:text-3xl text-foreground/70 font-light mb-12">
              Ready to rest better?
            </p>
          </RevealText>
          
          <RevealText delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-cyan-200 text-foreground/70 hover:bg-cyan-50/50 hover:border-cyan-300 transition-all duration-500 px-8"
              >
                <Link to="/support#contact">Learn More</Link>
              </Button>
              <Button 
                size="lg"
                className="bg-cyan-600/90 hover:bg-cyan-600 text-white px-8 transition-all duration-500"
              >
                Buy Zlu – ₹4,999
              </Button>
            </div>
          </RevealText>
          
          <RevealText delay={0.6}>
            <p className="text-sm text-muted-foreground/50 font-light mt-16">
              No rush. Your rest can wait.
            </p>
          </RevealText>
        </div>
      </section>
    </Layout>
  );
};

export default ZluProduct;
