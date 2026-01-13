import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { Check, ShoppingCart, Moon, Plane, BedDouble, Building, Shield, Leaf, ArrowRight, Star, Truck, ShieldCheck, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { useRef, useEffect, useState } from "react";
import zluHero from "@/assets/zlu-hero.png";
import zluDevice from "@/assets/zlu-device.webp";
import zluLifestyle from "@/assets/zlu-lifestyle.png";
import zluTravel from "@/assets/zlu-travel.png";

// Counting number animation component
const CountingNumber = ({ value, delay = 0, className = "" }: { value: number; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        const controls = animate(0, value, {
          duration: 1.5,
          ease: "easeOut",
          onUpdate: (latest) => {
            setDisplayValue(Math.round(latest));
          },
        });
        return () => controls.stop();
      }, delay * 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [isInView, value, delay]);
  
  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
};

const AnimatedSection = ({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Sleep phase data
const sleepPhases = [
  { name: "Theta Support", description: "Helps the body settle into pre-sleep relaxation", icon: Moon },
  { name: "Proximity Based", description: "Simply keep it near you—no contact required", icon: BedDouble },
  { name: "Non-Invasive", description: "No wearing, consuming, or active interaction", icon: Leaf },
  { name: "Travel Ready", description: "Compact design goes wherever you rest", icon: Plane },
];

const useCases = [
  {
    icon: BedDouble,
    title: "At Home",
    description: "On your bedside table or near your pillow",
    detail: "The natural choice for nightly use",
  },
  {
    icon: Plane,
    title: "While Traveling",
    description: "Tucked in your seat pocket on a flight",
    detail: "Rest easier in unfamiliar environments",
  },
  {
    icon: Building,
    title: "In Hotels",
    description: "When unfamiliar rooms make sleep difficult",
    detail: "Bring your calm wherever you go",
  },
];

const safetyPoints = [
  { title: "No Chemicals", description: "Zero pharmaceuticals or supplements" },
  { title: "No Drugs", description: "Nothing enters your body" },
  { title: "No Habit Formation", description: "Use as needed, skip when you don't" },
  { title: "No Withdrawal", description: "Stop anytime with no effects" },
  { title: "Long-Term Safe", description: "Designed for repeated, daily use" },
  { title: "Non-Invasive", description: "Your body does the work naturally" },
];

const ZluProduct = () => {
  return (
    <Layout>
      {/* Section 1: Hero Introduction */}
      <section className="min-h-[90vh] flex items-center bg-gradient-to-b from-cyan-50/30 via-background to-background py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                Natural Sleep Support
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Let your body{" "}
                <span className="text-cyan-600">remember</span>{" "}
                how to rest.
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Zlu supports your body's natural ability to settle into calm, restful sleep—without 
                pills, without wearing anything, without effort. Just keep it near you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="text-lg px-8 py-6 gap-2 bg-cyan-600 hover:bg-cyan-700">
                  <ShoppingCart className="h-5 w-5" />
                  Buy Zlu — ₹4,999
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-cyan-200 text-cyan-700 hover:bg-cyan-50">
                  Learn How It Works
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-cyan-600" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-600" />
                  30-Day Returns
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2 relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/40 via-transparent to-cyan-100/30 rounded-3xl blur-3xl" />
                <motion.img
                  src={zluDevice}
                  alt="Zlu Sleep Aid Device"
                  className="relative w-full max-w-md mx-auto animate-drift"
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                />
              </div>
              
              {/* Floating Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 right-4 lg:right-0 bg-card border border-cyan-100 rounded-2xl p-4 shadow-lg"
              >
                <div className="text-xs text-cyan-600 font-medium mb-1">Proximity-Based</div>
                <div className="text-sm text-foreground font-medium">No wearing required</div>
                <div className="text-xs text-muted-foreground mt-1">Just keep it near you</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: The Modern Sleep Problem */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-12 leading-tight">
              The mind races.{" "}
              <span className="text-muted-foreground">The body stays awake.</span>
            </h2>
            
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground text-center mb-12">
              <p>You know the feeling—lying in bed, exhausted, yet somehow alert.</p>
              <p>The more you try to sleep, the further it slips away.</p>
              <p className="text-foreground font-medium italic">"And the fear of pills, supplements, and dependency..."</p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 border border-cyan-100">
              <p className="text-xl md:text-2xl text-center font-medium text-foreground">
                What if support didn't require <span className="text-muted-foreground">effort</span>?
                <br />
                What if it was as simple as <span className="text-cyan-600">keeping something nearby</span>?
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 3: How Zlu Works */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                A Different Kind of Support
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Zlu works by proximity—no contact, no consumption, no routine
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {sleepPhases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="text-center bg-card border border-cyan-50 rounded-2xl p-6 hover:shadow-lg hover:border-cyan-100 transition-all"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center">
                    <phase.icon className="h-7 w-7 text-cyan-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{phase.name}</h3>
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-lg text-muted-foreground mt-12 italic">
              Just keep it near you—and let your body do what it already knows how to do.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 4: Theta State Explanation */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-cyan-50/30 to-background overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="text-cyan-600 font-medium mb-2">Natural Relaxation</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                The Theta State
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Your body naturally moves through different states as it prepares for sleep. 
                The theta state is that quiet space between waking and dreaming—when the mind 
                begins to slow and the body starts to relax deeply.
              </p>
              
              <div className="bg-cyan-50/50 border-l-4 border-cyan-400 p-4 rounded-r-lg mb-6">
                <p className="text-foreground italic">
                  "Your body knows this place. Zlu simply makes it easier to find."
                </p>
              </div>
              
              <ul className="space-y-3">
                {[
                  "Supports natural pre-sleep relaxation",
                  "Helps the body settle without forcing sleep",
                  "Works with your body's existing rhythms",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-cyan-600 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-100/50 to-transparent rounded-3xl blur-2xl" />
                <div className="relative bg-gradient-to-br from-cyan-50 to-white rounded-3xl overflow-hidden border border-cyan-100">
                  <img
                    src={zluLifestyle}
                    alt="Woman sleeping peacefully with Zlu nearby"
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 5: Travel Section */}
      <section className="py-24 lg:py-32 bg-background overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-6">
                <Plane className="h-4 w-4" />
                Travel Ready
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Rest Easier, Wherever You Go
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Unfamiliar beds. Different time zones. The anxiety of sleeping somewhere new. 
                Travel often means restless nights—but it doesn't have to.
              </p>
              <p className="text-lg text-foreground mb-8">
                Zlu's compact design fits in your carry-on, your hotel nightstand, 
                or even your seat pocket on a flight. Bring your calm with you.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "On Flights", desc: "Tuck it in your seat pocket for long-haul rest" },
                  { title: "In Hotels", desc: "Familiar support in unfamiliar rooms" },
                  { title: "Visiting Family", desc: "Sleep well even in guest beds" },
                  { title: "Business Trips", desc: "Stay sharp with better rest on the road" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-cyan-600" />
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{item.title}</span>
                      <span className="text-muted-foreground"> — {item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/30 via-transparent to-cyan-100/20 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden border border-cyan-100">
                  <img
                    src={zluTravel}
                    alt="Man sleeping peacefully on airplane with Zlu nearby"
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section: BMI & Weight Management */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-emerald-50/20 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 via-transparent to-emerald-100/20 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden border border-emerald-100">
                  <img
                    src={zluLifestyle}
                    alt="Zlu supporting wellness and healthy lifestyle"
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <Scale className="h-4 w-4" />
                Wellness Support
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Sleep Better,<br />
                <span className="text-emerald-600">Live Lighter</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Quality sleep is the foundation of healthy weight management. When you rest deeply, your body regulates hormones that control hunger, metabolism, and energy—naturally supporting your wellness goals.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Metabolism Support", desc: "Quality sleep helps regulate metabolic function" },
                  { title: "Appetite Balance", desc: "Better rest supports healthy hunger hormones" },
                  { title: "Energy for Activity", desc: "Wake up refreshed with motivation to move" },
                  { title: "Recovery & Repair", desc: "Support your body's natural healing processes" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-emerald-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">{item.title}</span>
                      <span className="text-muted-foreground"> — {item.desc}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Anywhere You Rest
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compact, portable, and always ready when you need to wind down
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {useCases.map((useCase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-card border rounded-2xl p-8 text-center hover:shadow-xl hover:border-cyan-100 transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-100 to-cyan-50 flex items-center justify-center">
                  <useCase.icon className="h-9 w-9 text-cyan-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground mb-3">{useCase.description}</p>
                <p className="text-sm text-cyan-600 font-medium">{useCase.detail}</p>
              </motion.div>
            ))}
          </div>
          
          <AnimatedSection className="mt-12 text-center">
            <p className="text-lg text-muted-foreground italic">
              Wherever you need rest, Zlu goes with you.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 6: Non-Addictive by Design */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Safety First
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Non-Addictive by Design
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your body's natural ability to rest—supported, never forced
            </p>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {safetyPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background rounded-xl p-5 border border-green-100 hover:border-green-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 7: Over Time Benefits */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container max-w-4xl">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Over Time
            </h2>
            <p className="text-lg text-muted-foreground">
              Not a promise—a possibility
            </p>
          </AnimatedSection>
          
          <div className="space-y-8">
            {[
              { num: "01", text: "Easier transition into rest" },
              { num: "02", text: "Improved sleep readiness" },
              { num: "03", text: "A calmer mind before bed" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="flex items-center gap-8 p-6 rounded-2xl hover:bg-cyan-50/30 transition-colors"
              >
                <span className="text-6xl md:text-7xl font-extralight text-cyan-200">{item.num}</span>
                <span className="text-xl md:text-2xl text-foreground font-light">{item.text}</span>
              </motion.div>
            ))}
          </div>
          
          <AnimatedSection className="mt-12 text-center">
            <p className="text-lg text-muted-foreground italic">
              The body learns. The mind follows. Rest becomes natural again.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 8: Trust & Stats */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join those who have discovered a gentler way to rest
            </p>
          </AnimatedSection>
          
          {/* Stats */}
          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { value: 50000, suffix: "+", label: "Users Resting Better" },
                { value: 4.8, suffix: "", label: "Average Rating", isDecimal: true },
                { value: 30, suffix: "+", label: "Countries" },
                { value: 95, suffix: "%", label: "Satisfaction Rate" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-background border border-cyan-50 rounded-2xl">
                  <div className="text-3xl md:text-4xl font-bold text-cyan-600 mb-2">
                    {stat.isDecimal ? (
                      <span>{stat.value}{stat.suffix}</span>
                    ) : (
                      <>
                        <CountingNumber value={stat.value} delay={i * 0.2} />
                        {stat.suffix}
                      </>
                    )}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          
          {/* Testimonials */}
          <AnimatedSection>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "I was skeptical at first. No pills, no patches—just keep it nearby? But after a week, I noticed I was falling asleep without that racing-mind feeling.",
                  name: "Meera R.",
                  title: "Working Professional",
                },
                {
                  quote: "Travel used to mean sleepless nights in hotel rooms. Now Zlu comes with me everywhere. It's become part of my rest ritual.",
                  name: "Arjun K.",
                  title: "Frequent Traveler",
                },
                {
                  quote: "What I love most is that there's nothing to remember—no pills, no timers. It's just there, quietly helping me wind down.",
                  name: "Priya S.",
                  title: "Busy Mom",
                },
              ].map((testimonial, i) => (
                <motion.div 
                  key={i} 
                  className="bg-background border border-cyan-50 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-cyan-400 text-cyan-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-cyan-50/50 to-cyan-100/30">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to rest better?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              No rush. No pressure. Just quiet support when you're ready.
            </p>
            
            <div className="bg-background border border-cyan-100 rounded-2xl p-8 mb-8">
              <motion.img
                src={zluDevice}
                alt="Zlu"
                className="h-32 object-contain mx-auto mb-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
              />
              
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-4xl font-bold text-foreground">₹4,999</span>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Button size="lg" className="text-lg px-12 py-6 gap-2 bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto">
                  <ShoppingCart className="h-5 w-5" />
                  Buy Zlu Now
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-cyan-200 text-cyan-700 hover:bg-cyan-50 w-full sm:w-auto">
                  <Link to="/support#contact">Contact Us</Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-cyan-600" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-600" />
                  30-Day Money Back
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground/70 italic">
              Your rest can wait. But when you're ready, Zlu will be here.
            </p>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default ZluProduct;
