import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import { Check, ShoppingCart, Scale, Activity, Droplets, Zap, Heart, TrendingUp, Users, Home, Dumbbell, Building2, Shield, ArrowRight, Star, Truck, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { useRef, useEffect, useState } from "react";
import corebalanceHero from "@/assets/corebalance-hero.png";
import corebalanceCard from "@/assets/corebalance-card.png";
import appMuscle from "@/assets/corebalance-app-muscle.png";
import appComposition from "@/assets/corebalance-app-composition.png";
import appBmi from "@/assets/corebalance-app-bmi.png";
import appMetrics from "@/assets/corebalance-app-metrics.png";
import { useShopifyProduct } from "@/hooks/useShopifyProduct";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";

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

// Body composition metrics
const bodyMetrics = [
  { name: "Body Fat %", description: "Understand your fat distribution", icon: Activity, color: "from-orange-500 to-amber-400" },
  { name: "Muscle Mass", description: "Track your lean muscle gains", icon: Dumbbell, color: "from-blue-500 to-cyan-400" },
  { name: "Body Water", description: "Monitor hydration levels", icon: Droplets, color: "from-cyan-500 to-teal-400" },
  { name: "BMR", description: "Know your calorie burn at rest", icon: Zap, color: "from-yellow-500 to-orange-400" },
  { name: "Visceral Fat", description: "Measure hidden belly fat", icon: Heart, color: "from-red-500 to-pink-400" },
  { name: "Metabolic Age", description: "See your body's true age", icon: TrendingUp, color: "from-purple-500 to-violet-400" },
];

const useCases = [
  {
    icon: Home,
    title: "At Home",
    description: "Daily tracking for the whole family",
    detail: "Up to 8 user profiles with individual tracking",
  },
  {
    icon: Dumbbell,
    title: "At the Gym",
    description: "Track fitness progress over time",
    detail: "See muscle gains and fat loss in real numbers",
  },
  {
    icon: Building2,
    title: "In Clinics",
    description: "Professional-grade accuracy for practitioners",
    detail: "Export reports for patient consultations",
  },
];

const accuracyPoints = [
  { title: "BIA Technology", description: "Bioelectrical impedance analysis for precise measurements" },
  { title: "Medical-Grade Sensors", description: "Hospital-quality electrodes for accuracy" },
  { title: "Validated Results", description: "Tested against DEXA scan standards" },
  { title: "Consistent Readings", description: "Reliable measurements every time" },
  { title: "Multi-Frequency", description: "Comprehensive body composition analysis" },
  { title: "Instant Results", description: "Complete analysis in under 30 seconds" },
];

const testimonials = [
  {
    quote: "Finally, I can see that my workouts are actually building muscle. The scale number stayed the same, but CoreBalance showed me I lost fat and gained muscle.",
    author: "Rahul M.",
    role: "Fitness Enthusiast",
    rating: 5,
  },
  {
    quote: "As a nutritionist, I recommend CoreBalance to all my clients. The body composition data helps me create personalized meal plans that actually work.",
    author: "Dr. Priya S.",
    role: "Clinical Nutritionist",
    rating: 5,
  },
  {
    quote: "My whole family uses it. The multiple profiles make it easy for everyone to track their health journey. The app syncing is seamless.",
    author: "Anita K.",
    role: "Mother of 3",
    rating: 5,
  },
];

const CoreBalanceProduct = () => {
  const { loading, findProductByTitle, addToCart } = useShopifyProduct();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    const product = findProductByTitle("CoreBalance");
    if (product) {
      setAddingToCart(true);
      addToCart(product);
      setTimeout(() => setAddingToCart(false), 500);
    }
  };

  return (
    <Layout>
      {/* Section 1: Hero Introduction */}
      <section className="min-h-[90vh] flex items-center bg-gradient-to-b from-emerald-50/50 to-background py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Introducing CoreBalance™
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                The scale told me{" "}
                <span className="text-emerald-600">one number</span>.{" "}
                CoreBalance told me the{" "}
                <span className="text-emerald-600">whole story</span>.
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                CoreBalance goes beyond weight to reveal what your body is truly made of—
                muscle, fat, water, and more. Because understanding your body is the first step to transforming it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 gap-2 bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleAddToCart}
                  disabled={addingToCart || loading}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  Add to Cart — ₹1,999
                </Button>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  1-Year Warranty
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 via-transparent to-emerald-100/20 rounded-3xl blur-3xl" />
                <img
                  src={corebalanceHero}
                  alt="CoreBalance BMI Scale"
                  className="relative w-full max-w-lg mx-auto"
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                />
              </div>
              
              {/* Floating Stats Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 right-4 lg:right-0 bg-card border border-emerald-100 rounded-2xl p-4 shadow-lg"
              >
                <div className="text-xs text-emerald-600 font-medium mb-1">Body Composition</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">10+</span>
                  <span className="text-sm text-muted-foreground">metrics tracked</span>
                </div>
                <div className="text-xs text-emerald-600 mt-1">Complete body analysis</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Problem Statement */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-12 leading-tight">
              Your weight is just a number.{" "}
              <span className="text-muted-foreground">Your body is a story.</span>
            </h2>
            
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground text-center mb-12">
              <p>You've been working out. Eating better. Making changes.</p>
              <p>But the scale hasn't moved. Or worse—it went up.</p>
              <p className="text-foreground font-medium italic">"Am I even making progress?"</p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 border border-emerald-100">
              <p className="text-xl md:text-2xl text-center font-medium text-foreground">
                A regular scale shows <span className="text-muted-foreground">weight</span>.
                <br />
                CoreBalance shows <span className="text-emerald-600">transformation</span>.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 3: Stats */}
      <section className="py-16 bg-background border-y">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 10, suffix: "+", label: "Body Metrics" },
              { value: 8, suffix: "", label: "User Profiles" },
              { value: 30, suffix: "s", label: "Measurement Time" },
              { value: 99, suffix: "%", label: "Accuracy Rate" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                  <CountingNumber value={stat.value} delay={i * 0.2} />
                  {stat.suffix}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Body Metrics */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-emerald-50/30 to-background">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              See What You're Really Made Of
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              CoreBalance measures 10+ metrics to give you the complete picture of your body composition
            </p>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bodyMetrics.map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-card border rounded-2xl p-6 hover:shadow-xl hover:border-emerald-100 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center mb-4`}>
                  <metric.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{metric.name}</h3>
                <p className="text-muted-foreground">{metric.description}</p>
              </motion.div>
            ))}
          </div>
          
          <AnimatedSection className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Plus: BMI, Bone Mass, Protein Level, Skeletal Muscle, and more</p>
            <Button variant="outline" className="border-emerald-200 hover:bg-emerald-50">
              View All Metrics
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </AnimatedSection>
        </div>
      </section>

      {/* Section: App Insights Showcase */}
      <section className="py-24 lg:py-32 bg-background overflow-hidden">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <Activity className="h-4 w-4" />
              Smart App Insights
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Body, Visualized
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The CoreBalance app transforms complex data into beautiful, easy-to-understand insights
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                image: appMuscle, 
                title: "Muscle Mass Analysis", 
                description: "See muscle distribution across your body with detailed breakdowns"
              },
              { 
                image: appComposition, 
                title: "Body Composition", 
                description: "Track weight, fat, water, protein, and bone mass at a glance"
              },
              { 
                image: appBmi, 
                title: "BMI Tracking", 
                description: "Visual BMI scale shows where you stand with healthy weight targets"
              },
              { 
                image: appMetrics, 
                title: "Detailed Metrics", 
                description: "Compare your measurements against healthy reference ranges"
              },
            ].map((screen, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden border border-emerald-100 bg-slate-900 shadow-xl hover:shadow-2xl transition-all">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <img
                    src={screen.image}
                    alt={screen.title}
                    className="w-full h-auto object-cover"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-semibold text-foreground mb-1">{screen.title}</h3>
                  <p className="text-sm text-muted-foreground">{screen.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <AnimatedSection className="mt-12 text-center">
            <p className="text-lg text-muted-foreground italic">
              All insights sync instantly to your smartphone via Bluetooth
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 5: How It Works */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Simple Steps to Complete Insights
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get your full body composition analysis in under 30 seconds
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Step On",
                  description: "Stand barefoot on the tempered glass surface. The sensors activate automatically.",
                },
                {
                  step: "02",
                  title: "Measure",
                  description: "Advanced BIA technology sends safe signals through your body to analyze composition.",
                },
                {
                  step: "03",
                  title: "Understand",
                  description: "View all 10+ metrics on the app. Track trends over time and see your progress.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-6xl font-bold text-emerald-200 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 6: Family & Fitness */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-background to-emerald-50/30 overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
                <Users className="h-4 w-4" />
                Multi-User Support
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                One Scale,<br />
                <span className="text-emerald-600">Whole Family</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                CoreBalance automatically recognizes up to 8 different users. Each family member gets their own profile with personalized tracking, goals, and progress history.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: "Auto-Recognition", desc: "Step on and it knows who you are" },
                  { title: "Individual Goals", desc: "Set personalized targets for each user" },
                  { title: "Private Data", desc: "Each profile stays secure and separate" },
                  { title: "Progress Tracking", desc: "See everyone's journey over time" },
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
            
            <AnimatedSection>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/30 via-transparent to-emerald-100/20 rounded-3xl blur-2xl" />
                <div className="relative rounded-3xl overflow-hidden border border-emerald-100 bg-card p-8">
                  <img
                    src={corebalanceCard}
                    alt="CoreBalance with family"
                    className="w-full h-auto object-contain"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 7: Use Cases */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built for Every Setting
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From home wellness to professional practice
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
                className="bg-card border rounded-2xl p-8 text-center hover:shadow-xl hover:border-emerald-100 transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                  <useCase.icon className="h-9 w-9 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                <p className="text-muted-foreground mb-3">{useCase.description}</p>
                <p className="text-sm text-emerald-600 font-medium">{useCase.detail}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Accuracy & Technology */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Professional Accuracy
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Technology You Can Trust
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Medical-grade sensors deliver reliable, consistent results every time
            </p>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {accuracyPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-background rounded-xl p-5 border hover:border-emerald-200 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">{point.title}</h4>
                      <p className="text-sm text-muted-foreground">{point.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 9: Testimonials */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Real Stories, Real Results
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from people who transformed their understanding of health
            </p>
          </AnimatedSection>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className="bg-card border rounded-2xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star key={j} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 10: Final CTA */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-emerald-50/50 to-background">
        <div className="container">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to Know Your{" "}
              <span className="text-emerald-600">Whole Story</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Stop guessing. Start understanding. CoreBalance gives you the complete picture
              of what's happening inside your body.
            </p>
            
            <div className="bg-background border border-emerald-100 rounded-2xl p-8 mb-8">
              <motion.img
                src={corebalanceHero}
                alt="CoreBalance"
                className="h-32 object-contain mx-auto mb-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              />
              <div className="text-3xl font-bold text-foreground mb-2">₹6,999</div>
              <p className="text-sm text-muted-foreground mb-6">Includes scale, app access & 1-year warranty</p>
              <Button size="lg" className="text-lg px-10 py-6 gap-2 bg-emerald-600 hover:bg-emerald-700">
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-emerald-600" />
                Free Shipping
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                1-Year Warranty
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                Easy Returns
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <StickyAddToCart
        productName="CoreBalance BMI Scale"
        price="₹1,999"
        onAddToCart={handleAddToCart}
        isLoading={loading}
        themeColor="emerald"
      />
    </Layout>
  );
};

export default CoreBalanceProduct;
