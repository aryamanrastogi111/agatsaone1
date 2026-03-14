import { Link } from "react-router-dom";
import { addBusinessDays, format } from "date-fns";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Check, ShoppingCart, ChevronRight, Play, Star, Truck, ShieldCheck, ArrowRight, Loader2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { useRef, useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useFacebookPixel, useEasyTouchRhythmPixelPageView } from "@/hooks/useFacebookPixel";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { FomoCounter } from "@/components/shop/FomoCounter";
import { MultiProductDiscountBanner } from "@/components/shop/MultiProductDiscountBanner";
import { 
  CountdownTimer, 
  CouponCodeBox, 
  RepublicDaySaleBadge, 
  isSaleActive, 
  SALE_CODE 
} from "@/components/sale";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import kineticFlowImg from "@/assets/easytouch-kinetic-flow.png";
import kineticTrendsImg from "@/assets/easytouch-kinetic-trends.png";
import mealLoadImg from "@/assets/easytouch-meal-load.png";
import mealTimelineImg from "@/assets/easytouch-meal-timeline.png";
import mealAftermathImg from "@/assets/easytouch-meal-aftermath.png";
import fitnessBgImg from "@/assets/easytouch-fitness-bg.png";
import mealBgImg from "@/assets/easytouch-meal-bg.png";
import reviewImg1 from "@/assets/review-image-1.png";
import reviewImg2 from "@/assets/review-image-2.png";
import reviewImg3 from "@/assets/review-image-3.png";
import reviewImg4 from "@/assets/review-image-4.png";
import republicDayHeroBanner from "@/assets/republic-day-banner-hero.jpeg";
import republicDayOfferBanner from "@/assets/republic-day-banner-offer.jpeg";

// Image assets from shop.myeasytouch.com
const images = {
  heroband: "https://shop.myeasytouch.com/assets/band-hero-new-eJqxalsU.png",
  productHero2: "https://shop.myeasytouch.com/assets/product-hero-2-DZLGq91o.png",
  mealLoggingApp: "https://shop.myeasytouch.com/assets/meal-logging-app-g1XWheXS.png",
  productsLineup: "https://shop.myeasytouch.com/assets/products-lineup-CWziGlGu.png",
  appScreens: [
    { src: "https://shop.myeasytouch.com/assets/app-screen-home-uielQm0f.png", title: "Home Dashboard", desc: "Your daily health overview at a glance" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-metrics-BdPzDSNV.png", title: "Health Metrics", desc: "Track all your vital signs in one place" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-longevity-9eIZHtjV.png", title: "Longevity Goal", desc: "Set and achieve your wellness targets" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-vitals-DYJ6mWkw.png", title: "Quick Vitals", desc: "Instant access to your key health data" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-rhythm-matrix-BnPda25G.png", title: "Rhythm Matrix", desc: "See how your rhythms interconnect" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-plan-actual-BEThdkNf.png", title: "Plan vs Actual", desc: "Compare your goals with reality" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-bio-correlations-CcciHraG.png", title: "Bio-Correlations", desc: "Discover patterns in your health data" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-metabolic-BRSh33fq.png", title: "Metabolic Rhythm", desc: "Understand your energy patterns" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-meal-analysis-CwE5CQ4g.png", title: "Meal Analysis", desc: "See how food affects your body" },
    { src: "https://shop.myeasytouch.com/assets/app-screen-circulatory-C1TfLPJM.png", title: "Circulatory Rhythm", desc: "Monitor your heart health trends" },
  ],
  rhythms: [
    { src: "https://shop.myeasytouch.com/assets/rhythm-nervous-system-DGXl7tAO.jpg", name: "Nervous System", subtitle: "Your Calm & Stress Balance" },
    { src: "https://shop.myeasytouch.com/assets/rhythm-kinetic-BoyGbY5f.jpg", name: "Kinetic", subtitle: "Your Movement Patterns" },
    { src: "https://shop.myeasytouch.com/assets/rhythm-circadian-DkBrPuU8.jpg", name: "Circadian", subtitle: "Your Sleep & Wake Cycle" },
    { src: "https://shop.myeasytouch.com/assets/rhythm-circulatory-BQr9OeIQ.jpg", name: "Circulatory", subtitle: "Your Heart & Vascular Health" },
    { src: "https://shop.myeasytouch.com/assets/rhythm-metabolic-D7eO7vXC.jpg", name: "Metabolic", subtitle: "Your Energy & Nutrition" },
  ],
  awards: [
    { src: "https://shop.myeasytouch.com/assets/award-ceremony-D4dsQIqC.png", name: "Anjani Mashelkar Prize" },
    { src: "https://shop.myeasytouch.com/assets/award-amiia-2015-DbpJ5eCx.jpg", name: "AMIIA Winner 2015" },
    { src: "https://shop.myeasytouch.com/assets/award-10000-startups-n0jyIGYc.jpg", name: "10,000 Startups" },
    { src: "https://shop.myeasytouch.com/assets/award-medtech-expo-2023-DlkOCdHR.jpg", name: "MedTech Expo 2023" },
  ],
};

const rhythmDescriptions = [
  {
    name: "Nervous System",
    subtitle: "Your Calm & Stress Balance",
    description: "Your nervous system orchestrates how you respond to the world around you. EasyTouch Rhythm tracks your Heart Rate Variability (HRV) to reveal the delicate balance between your sympathetic (fight-or-flight) and parasympathetic (rest-and-digest) systems.",
    insight: "When this rhythm is balanced, you feel centered, focused, and resilient. When it's strained, even small stressors can feel overwhelming.",
  },
  {
    name: "Kinetic",
    subtitle: "Your Movement Patterns",
    description: "Movement is medicine—but only when it matches your body's current capacity. Your Kinetic rhythm reveals not just how much you move, but whether that movement is helping or hurting your overall balance.",
    insight: "The right movement at the right time energizes you. The wrong movement, even if 'healthy,' can exhaust instead of strengthen.",
  },
  {
    name: "Circadian",
    subtitle: "Your Sleep & Wake Cycle",
    description: "Your circadian rhythm is your body's master clock, governing when you feel alert, when you feel tired, and how restorative your sleep truly is. It's not just about hours—it's about alignment.",
    insight: "When your circadian rhythm is in sync, you wake refreshed and wind down naturally. When it's disrupted, no amount of sleep feels like enough.",
  },
  {
    name: "Circulatory",
    subtitle: "Your Heart & Vascular Health",
    description: "Your circulatory system is the highway that delivers oxygen, nutrients, and vitality to every cell. EasyTouch Rhythm monitors your heart rate patterns, blood pressure trends, and vascular efficiency.",
    insight: "A healthy circulatory rhythm means steady energy throughout the day. Imbalances often show up as afternoon crashes or morning sluggishness.",
  },
  {
    name: "Metabolic",
    subtitle: "Your Energy & Nutrition",
    description: "Your metabolic rhythm reflects how your body processes food, generates energy, and maintains balance. It's influenced by what you eat, when you eat, and how your body uniquely responds.",
    insight: "Understanding your metabolic rhythm helps you eat in harmony with your body—not against it.",
  },
];

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

const EasyTouchRhythmProduct = () => {
  const addItem = useCartStore((s) => s.addItem);
  const [addingToCart, setAddingToCart] = useState(false);
  const { trackAddToCart } = useFacebookPixel();
  
  // Fire PageView and ViewContent on mount for Facebook Pixel
  useEasyTouchRhythmPixelPageView();

  const handleAddToCart = () => {
    setAddingToCart(true);
    addItem({ productId: "easytouch-rhythm", productName: "EasyTouch Rhythm", variantTitle: "Default Title", price: 4999, quantity: 1 });
    toast.success("EasyTouch Rhythm added to cart", { position: "top-center" });
    // Track AddToCart event for Facebook Pixel
    trackAddToCart(1);
    setTimeout(() => setAddingToCart(false), 500);
  };

  return (
    <Layout>
      {/* Republic Day Sale Strip - Compact Banner */}
      {isSaleActive() && (
        <section className="bg-gradient-to-r from-orange-500/10 via-background to-green-600/10 border-b">
          <div className="container py-4 md:py-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left: Sale info with small banner image */}
              <div className="flex items-center gap-4">
                <img 
                  src={republicDayHeroBanner} 
                  alt="Republic Day Sale" 
                  className="hidden sm:block w-24 h-16 md:w-32 md:h-20 object-cover rounded-lg shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🇮🇳</span>
                    <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Republic Day Sale</span>
                  </div>
                  <p className="text-lg md:text-xl font-bold text-foreground">
                    <span className="text-primary">10% OFF</span> EasyTouch Rhythm
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <CouponCodeBox variant="inline" />
                  </div>
                </div>
              </div>
              
              {/* Right: Countdown and CTA */}
              <div className="flex items-center gap-4 flex-wrap">
                <CountdownTimer variant="compact" className="hidden md:flex" />
                <Button 
                  size="lg" 
                  className="gap-2"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  <span className="hidden sm:inline">Grab Yours —</span>
                  <span className="line-through text-primary-foreground/60">₹4,999</span>
                  <span className="font-bold">₹4,499</span>
                </Button>
              </div>
            </div>
            
            {/* Mobile countdown */}
            <div className="md:hidden mt-3">
              <CountdownTimer variant="compact" />
            </div>
          </div>
        </section>
      )}

      {/* Section 1: Hero Introduction */}
      <section className="min-h-[90vh] flex items-center bg-background py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Introducing EasyTouch Rhythm™
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                I finally understand why my{" "}
                <span className="text-primary">body feels</span>{" "}
                the way it does.
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                EasyTouch Rhythm doesn't just track your health—it reveals the hidden patterns 
                that explain your energy, your fatigue, your clarity, and your calm.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 gap-2"
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  {isSaleActive() ? (
                    <>Add to Cart — <span className="line-through text-primary-foreground/60 mr-1">₹4,999</span> ₹4,499</>
                  ) : (
                    "Add to Cart — ₹4,999"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => window.open("https://www.youtube.com/watch?v=j8QwXnQwozg", "_blank", "noopener,noreferrer")}
                >
                  Watch Demo
                  <Play className="h-5 w-5 ml-2" />
                </Button>
              </div>
              
              {/* Republic Day Offer Inline */}
              {isSaleActive() && (
                <div className="bg-gradient-to-r from-orange-500/10 via-background to-green-600/10 border border-primary/20 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-lg">🇮🇳</span>
                    <span className="font-medium text-foreground">Republic Day Discount Active</span>
                    <CouponCodeBox variant="inline" />
                  </div>
                  <CountdownTimer variant="compact" className="mt-3" />
                </div>
              )}
              
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  7-Day Returns (Mfg. Defects)
                </div>
              </div>
              
              <MultiProductDiscountBanner variant="compact" className="mt-4" />
              
              {/* Bonus Offer Section */}
              <div className="mt-4 space-y-3">
                <div className="text-xs text-muted-foreground text-center">also</div>
                
                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-3 border border-orange-200 dark:border-orange-800/50">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base">🍴</span>
                    <span className="text-sm font-medium text-foreground">Detailed Meal Logging</span>
                    <span className="text-xs text-muted-foreground line-through">₹1,200/yr</span>
                    <span className="text-sm font-bold text-emerald-600">FREE</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-200 dark:bg-orange-800 text-orange-700 dark:text-orange-200 font-medium">Limited Time</span>
                  </div>
                </div>
                
                {/* FOMO Counter */}
                <FomoCounter productHandle="easytouch-rhythm" lowStockThreshold={20} className="justify-center" />
                
                {/* Delivery Estimate */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <span>📦</span>
                  <span>Delivers by <span className="font-medium text-foreground">{format(addBusinessDays(new Date(), 3), "EEE, MMM d")}</span></span>
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
                {/* Sale Badge */}
                {isSaleActive() && (
                  <RepublicDaySaleBadge className="absolute -top-2 -right-2 z-10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10 rounded-3xl blur-3xl" />
                <img
                  src={images.heroband}
                  alt="EasyTouch Rhythm Band"
                  className="relative w-full max-w-lg mx-auto"
                />
              </div>
              
              {/* Floating Price Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-4 right-4 lg:right-0 bg-card border rounded-2xl p-4 shadow-lg"
              >
                {isSaleActive() ? (
                  <>
                    <div className="text-xs text-primary font-medium mb-1">🇮🇳 Republic Day Offer</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">₹4,499</span>
                      <span className="text-sm text-muted-foreground line-through">₹4,999</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Use code {SALE_CODE}</p>
                  </>
                ) : (
                  <>
                    <div className="text-xs text-primary font-medium mb-1">Introductory Offer</div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">₹4,999</span>
                      <span className="text-sm text-muted-foreground line-through">₹7,999</span>
                    </div>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Republic Day Special Offer Section */}
      {isSaleActive() && (
        <section className="py-16 bg-gradient-to-br from-orange-500/5 via-background to-green-600/5">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Offer Banner Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img 
                  src={republicDayOfferBanner} 
                  alt="Republic Day Special - 10% OFF" 
                  className="w-full rounded-2xl shadow-xl"
                />
              </motion.div>
              
              {/* Offer Details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className="text-3xl">🇮🇳</span>
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Republic Day Special</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  BIG <span className="text-primary">10% OFF</span>
                </h2>
                
                <p className="text-lg text-muted-foreground mb-6">
                  Limited units. Limited time. Offer ends soon.
                </p>
                
                <CouponCodeBox variant="card" className="mb-6" />
                
                <CountdownTimer variant="full" className="mb-8" />
                
                <Button 
                  size="lg" 
                  className="text-lg px-10 py-6 gap-2"
                  onClick={handleAddToCart}
                  disabled={addingToCart || loading}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  Claim Republic Offer — ₹4,499
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Problem Statement */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-12 leading-tight">
              Your body is talking.{" "}
              <span className="text-muted-foreground">Most wearables just record it.</span>
            </h2>
            
            <div className="space-y-4 text-lg md:text-xl text-muted-foreground text-center mb-12">
              <p>You slept less. You sat too long. You ate late. You skipped your walk.</p>
              <p>These choices compound—quietly, invisibly—until one day you wonder:</p>
              <p className="text-foreground font-medium italic">"Why do I feel so tired?"</p>
            </div>
            
            <div className="bg-background rounded-2xl p-8 border">
              <p className="text-xl md:text-2xl text-center font-medium text-foreground">
                Most devices show <span className="text-muted-foreground">numbers</span>.
                <br />
                EasyTouch Rhythm shows <span className="text-primary">impact</span>.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Three Steps to Understanding
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A gentle, continuous process that works in the background of your life
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Sense",
                  description: "Your body's rhythms are continuously understood—heart rate variability, movement patterns, sleep quality, and more.",
                },
                {
                  step: "02",
                  title: "Interpret",
                  description: "Rhythm scores translate raw data into meaningful insights. Not just what happened, but what it means for you.",
                },
                {
                  step: "03",
                  title: "Adjust",
                  description: "Small daily nudges help you correct strain before it becomes a problem. Gentle guidance, never pressure.",
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
                  <div className="text-6xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-lg text-muted-foreground mt-12 italic">
              No alarms. No pressure. Just quiet intelligence in the background.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 4: Rhythm Score System */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-background overflow-hidden">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            >
              Your Daily Balance Score
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Five interconnected rhythms that reveal the complete picture of your health
            </motion.p>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { name: "Rhythm Score", value: 78, color: "from-amber-400 via-yellow-500 to-orange-500", anchorId: "five-rhythms", isMain: true },
              { name: "Kinetic", value: 82, color: "from-orange-500 to-amber-400", anchorId: "rhythm-kinetic" },
              { name: "Metabolic", value: 71, color: "from-blue-500 to-cyan-400", anchorId: "rhythm-metabolic" },
              { name: "Nervous", value: 85, color: "from-blue-600 to-sky-400", anchorId: "rhythm-nervous" },
              { name: "Circadian", value: 74, color: "from-green-500 to-emerald-400", anchorId: "rhythm-circadian" },
            ].map((score, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: 45 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                transition={{ 
                  delay: i * 0.15, 
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true, margin: "-50px" }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
                onClick={() => {
                  document.getElementById(score.anchorId)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                  });
                }}
                className={`bg-card border rounded-2xl p-6 text-center hover:shadow-xl transition-shadow cursor-pointer group ${
                  score.isMain ? 'ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/20 relative overflow-hidden' : ''
                }`}
              >
                {/* Gold shimmer effect for main score */}
                {score.isMain && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                )}
                <motion.div 
                  className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${score.color} flex items-center justify-center relative ${
                    score.isMain ? 'w-24 h-24 ring-4 ring-amber-300/30' : ''
                  }`}
                  initial={{ rotate: -180, scale: 0 }}
                  whileInView={{ rotate: 0, scale: 1 }}
                  transition={{ 
                    delay: i * 0.15 + 0.3, 
                    duration: 0.8,
                    type: "spring",
                    stiffness: 120
                  }}
                  viewport={{ once: true }}
                >
                  <CountingNumber 
                    value={score.value} 
                    delay={i * 0.15 + 0.6}
                    className="text-2xl font-bold text-white"
                  />
                  
                  {/* Animated ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/30"
                    initial={{ scale: 1, opacity: 0.5 }}
                    whileInView={{ scale: 1.3, opacity: 0 }}
                    transition={{ 
                      delay: i * 0.15 + 0.5,
                      duration: 1,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    viewport={{ once: true }}
                  />
                </motion.div>
                <motion.h3 
                  className="font-semibold text-foreground group-hover:text-primary transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 + 0.4, duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  {score.name}
                </motion.h3>
                <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1 block">
                  Click to learn more
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            viewport={{ once: true }}
            className="mt-12 bg-card border rounded-2xl p-8 max-w-3xl mx-auto"
          >
            <p className="text-lg text-center text-muted-foreground leading-relaxed">
              Your <span className="text-foreground font-medium">Rhythm Score</span> is a single number 
              that reflects your body's overall balance. It's calculated from five interconnected rhythms, 
              each revealing a different aspect of your health. When they're in harmony, you feel it. 
              When they're not, EasyTouch Rhythm helps you understand why.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Benefits */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container max-w-4xl">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
              Why People Choose EasyTouch Rhythm
            </h2>
            
            <div className="space-y-6">
              {[
                "Understand fatigue beyond sleep hours",
                "See how food timing affects your energy",
                "Recognize stress before it shows physically",
                "Balance movement and recovery",
                "Avoid overdoing 'healthy' habits",
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg md:text-xl text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>
            
            <p className="text-xl text-center text-primary font-medium mt-12">
              This is how long-term health actually works.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 6: App Experience Carousel */}
      <section className="py-24 lg:py-32 bg-muted/30 overflow-hidden">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                The EasyTouch Rhythm App
              </h2>
              <p className="text-lg text-muted-foreground">
                Beautiful insights, always at your fingertips
              </p>
            </div>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-4">
                {images.appScreens.map((screen, i) => (
                  <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                    <div className="bg-card border rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow">
                      <div className="aspect-[9/16] bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                        <img
                          src={screen.src}
                          alt={screen.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-1">{screen.title}</h3>
                        <p className="text-sm text-muted-foreground">{screen.desc}</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden lg:flex -left-12" />
              <CarouselNext className="hidden lg:flex -right-12" />
            </Carousel>
            
            <p className="text-center text-sm text-muted-foreground mt-8">
              Swipe to explore more screens →
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 7: Five Rhythms Deep Dive */}
      <section id="five-rhythms" className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Five Rhythms
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your body operates in interconnected rhythms. Understanding them is the key to lasting wellness.
            </p>
          </AnimatedSection>
          
          {/* Anchor Navigation */}
          <div className="sticky top-20 z-40 mb-16">
            <nav className="flex flex-wrap justify-center gap-2 md:gap-4 bg-background/95 backdrop-blur-sm py-4 px-4 rounded-full border border-border/50 shadow-lg max-w-fit mx-auto">
              {rhythmDescriptions.map((rhythm, i) => (
                <a
                  key={i}
                  href={`#rhythm-${rhythm.name.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`rhythm-${rhythm.name.toLowerCase()}`)?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
                >
                  {rhythm.name}
                </a>
              ))}
            </nav>
          </div>
          
          {rhythmDescriptions.map((rhythm, i) => (
            <AnimatedSection key={i} id={`rhythm-${rhythm.name.toLowerCase()}`} className="mb-24 last:mb-0 scroll-mt-40">
              <div className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="overflow-hidden rounded-2xl bg-muted/30">
                    <motion.img
                      src={images.rhythms[i].src}
                      alt={rhythm.name}
                      className="w-full h-auto object-contain"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="text-primary font-medium mb-2">{rhythm.subtitle}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                    {rhythm.name}
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                    {rhythm.description}
                  </p>
                  <div className="bg-primary/5 border-l-4 border-primary p-4 rounded-r-lg">
                    <p className="text-foreground italic">{rhythm.insight}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Section 8: Movement Story */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={fitnessBgImg}
            alt="Rock climbing with EasyTouch Rhythm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Your Body Speaks When You Move
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                Movement is more than exercise. It's a conversation between you and your body. 
                EasyTouch Rhythm listens—and translates.
              </p>
              <p className="text-lg text-foreground font-medium mb-8">
                Movement done at the wrong time can exhaust instead of strengthen.
              </p>
              <Button variant="outline" size="lg" className="gap-2">
                Understand Your Kinetic Rhythm
                <ArrowRight className="h-4 w-4" />
              </Button>
            </AnimatedSection>

            <AnimatedSection className="order-1 lg:order-2">
              <Carousel className="w-full max-w-sm mx-auto">
                <CarouselContent>
                  <CarouselItem>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                      <img 
                        src={kineticFlowImg} 
                        alt="Kinetic & Fuel Dashboard - Balanced Flow" 
                        className="w-full rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                      <img 
                        src={kineticTrendsImg} 
                        alt="7-Day Activity Trends" 
                        className="w-full rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="-left-4 lg:-left-6" />
                <CarouselNext className="-right-4 lg:-right-6" />
              </Carousel>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 9: Meal Logging */}
      <section className="relative py-32 lg:py-48 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={mealBgImg}
            alt="Woman preparing salad while wearing EasyTouch Rhythm"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="text-primary font-medium mb-2">Meal Insights</div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Meal Logging That Understands Your Body
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Forget calorie counting. Forget macro tracking. EasyTouch Rhythm focuses on 
                what actually matters: how food affects <em>you</em>.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  "No calorie counting required",
                  "No macro targets to hit",
                  "No food guilt or restrictions",
                  "Just honest feedback about your body's response",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="max-w-xs">
                <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Watch it in action
                </p>
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    width="280"
                    height="158"
                    src="https://www.youtube.com/embed/NIAIfnCV4Io"
                    title="Meal Insights Demo"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full aspect-video"
                  />
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection>
              <Carousel className="w-full max-w-sm mx-auto">
                <CarouselContent>
                  <CarouselItem>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                      <img 
                        src={images.mealLoggingApp} 
                        alt="Meal Logging Feature" 
                        className="w-full rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                      <img 
                        src={mealAftermathImg} 
                        alt="Metabolic Aftermath Insights" 
                        className="w-full rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                      <img 
                        src={mealLoadImg} 
                        alt="Live Meal Load Dashboard" 
                        className="w-full rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-4 shadow-2xl">
                      <img 
                        src={mealTimelineImg} 
                        alt="12-hour Meal Load Timeline" 
                        className="w-full rounded-2xl"
                      />
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious className="-left-4 lg:-left-6" />
                <CarouselNext className="-right-4 lg:-right-6" />
              </Carousel>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Section 10: Comparison Table */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How EasyTouch Rhythm Compares
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See why EasyTouch Rhythm offers a fundamentally different approach to health monitoring
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-4 bg-muted/50 rounded-tl-xl font-semibold text-foreground min-w-[200px]">
                      Feature
                    </th>
                    <th className="p-4 bg-primary text-primary-foreground font-semibold min-w-[180px]">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-lg">EasyTouch Rhythm</span>
                        <span className="text-xs font-normal opacity-80">₹4,999</span>
                      </div>
                    </th>
                    <th className="p-4 bg-muted/50 font-semibold text-muted-foreground min-w-[140px]">
                      Apple Watch
                    </th>
                    <th className="p-4 bg-muted/50 font-semibold text-muted-foreground min-w-[140px]">
                      Fitbit
                    </th>
                    <th className="p-4 bg-muted/50 rounded-tr-xl font-semibold text-muted-foreground min-w-[140px]">
                      Oura Ring
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      feature: "Five Rhythm Analysis",
                      rhythm: true,
                      apple: false,
                      fitbit: false,
                      oura: false,
                      highlight: true,
                    },
                    {
                      feature: "Unified Rhythm Score",
                      rhythm: true,
                      apple: false,
                      fitbit: false,
                      oura: false,
                      highlight: true,
                    },
                    {
                      feature: "Personalized Meal Insights",
                      rhythm: true,
                      apple: false,
                      fitbit: false,
                      oura: false,
                      highlight: true,
                    },
                    {
                      feature: "Heart Rate Monitoring",
                      rhythm: true,
                      apple: true,
                      fitbit: true,
                      oura: true,
                    },
                    {
                      feature: "Sleep Tracking",
                      rhythm: true,
                      apple: true,
                      fitbit: true,
                      oura: true,
                    },
                    {
                      feature: "Blood Oxygen (SpO2)",
                      rhythm: true,
                      apple: true,
                      fitbit: true,
                      oura: true,
                    },
                    {
                      feature: "Stress Detection",
                      rhythm: true,
                      apple: true,
                      fitbit: true,
                      oura: true,
                    },
                    {
                      feature: "Circadian Rhythm Tracking",
                      rhythm: true,
                      apple: false,
                      fitbit: false,
                      oura: true,
                      highlight: true,
                    },
                    {
                      feature: "Metabolic Insights",
                      rhythm: true,
                      apple: false,
                      fitbit: false,
                      oura: false,
                      highlight: true,
                    },
                    {
                      feature: "Cognitive Rhythm Analysis",
                      rhythm: true,
                      apple: false,
                      fitbit: false,
                      oura: false,
                      highlight: true,
                    },
                    {
                      feature: "No Subscription Required",
                      rhythm: true,
                      apple: true,
                      fitbit: false,
                      oura: false,
                      highlight: true,
                    },
                    {
                      feature: "Made in India",
                      rhythm: true,
                      apple: false,
                      fitbit: false,
                      oura: false,
                    },
                  ].map((row, i) => (
                    <tr 
                      key={i} 
                      className={`border-b border-border/50 ${row.highlight ? 'bg-primary/5' : ''}`}
                    >
                      <td className="p-4 text-foreground font-medium">
                        {row.feature}
                        {row.highlight && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-primary/20 text-primary">
                            Unique
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center bg-primary/10">
                        {row.rhythm ? (
                          <Check className="h-5 w-5 text-primary mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.apple ? (
                          <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.fitbit ? (
                          <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.oura ? (
                          <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-6">
                * Comparison based on publicly available product specifications as of 2024
              </p>
              <Button size="lg" className="gap-2">
                Choose EasyTouch Rhythm
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Section 11: Trust & Awards */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              A Decade Of Smart Innovations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted by over 500,000 users worldwide
            </p>
          </AnimatedSection>
          
          {/* Stats */}
          <AnimatedSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { value: "500K+", label: "Lives Impacted" },
                { value: "10+", label: "Years of Innovation" },
                { value: "50+", label: "Countries Reached" },
                { value: "15+", label: "Awards Won" },
              ].map((stat, i) => (
                <div key={i} className="text-center p-6 bg-card border rounded-2xl">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          
          {/* Awards Carousel */}
          <AnimatedSection>
            <h3 className="text-xl font-semibold text-foreground text-center mb-8">Recognition & Awards</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {images.awards.map((award, i) => (
                <div key={i} className="bg-card border rounded-xl overflow-hidden">
                  <img
                    src={award.src}
                    alt={award.name}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-3 text-center">
                    <span className="text-sm font-medium text-foreground">{award.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
          
          {/* Testimonials Preview */}
          <AnimatedSection className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-foreground">Customer Reviews</h3>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="gap-2"
              >
                View All Reviews
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "For the first time, I understand why some days feel harder than others. It's not just sleep—it's everything working together.",
                  name: "Priya S.",
                  title: "Working Professional",
                  stars: 5,
                },
                {
                  quote: "I stopped chasing arbitrary fitness goals. Now I move in rhythm with my body, and I've never felt better.",
                  name: "Rahul M.",
                  title: "Fitness Enthusiast",
                  stars: 5,
                },
                {
                  quote: "The meal insights changed how I think about food. It's not about restriction—it's about understanding.",
                  name: "Ananya K.",
                  title: "Health-Conscious Mom",
                  stars: 5,
                },
              ].map((testimonial, i) => (
                <div key={i} className="bg-card border rounded-2xl p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`h-4 w-4 ${j < testimonial.stars ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews-section" className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-lg font-semibold text-foreground">4.8</span>
              <span className="text-muted-foreground">based on 20 reviews</span>
            </div>
          </AnimatedSection>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              { quote: "For the first time, I understand why some days feel harder than others. It's not just sleep—it's everything working together.", name: "Priya S.", title: "Working Professional", stars: 5, image: reviewImg4 },
              { quote: "I stopped chasing arbitrary fitness goals. Now I move in rhythm with my body, and I've never felt better.", name: "Rahul M.", title: "Fitness Enthusiast", stars: 5, image: reviewImg1 },
              { quote: "The meal insights changed how I think about food. It's not about restriction—it's about understanding.", name: "Ananya K.", title: "Health-Conscious Mom", stars: 5 },
              { quote: "Amazing product! The rhythm score helps me plan my day better. Only wish the battery lasted a bit longer.", name: "Vikram T.", title: "Software Engineer", stars: 4, image: reviewImg2 },
              { quote: "My doctor was impressed with the data I could share from my band. It's like having a health assistant on my wrist.", name: "Sunita R.", title: "Retired Teacher", stars: 5 },
              { quote: "The stress tracking feature helped me identify triggers I never knew about. Life-changing!", name: "Aditya P.", title: "Startup Founder", stars: 5, image: reviewImg3 },
              { quote: "Good product overall. The app could use some improvements but the hardware is solid.", name: "Meera J.", title: "Graphic Designer", stars: 4 },
              { quote: "I've tried many fitness bands, but this is the first one that actually helps me understand my body.", name: "Karthik N.", title: "Marathon Runner", stars: 5 },
              { quote: "The circadian rhythm tracking improved my sleep quality within weeks. Highly recommend!", name: "Deepa M.", title: "Night Shift Nurse", stars: 5 },
              { quote: "Love how it tracks my nervous system balance. Perfect for managing work stress.", name: "Arjun S.", title: "Investment Banker", stars: 5 },
              { quote: "Great value for money. Does everything a premium band does at half the price.", name: "Pooja V.", title: "College Student", stars: 4 },
              { quote: "The metabolic insights helped me lose 8 kgs in 3 months without any crash diets.", name: "Ramesh K.", title: "Business Owner", stars: 5 },
              { quote: "Comfortable to wear all day and the battery lasts almost a week. Very happy!", name: "Sneha L.", title: "Yoga Instructor", stars: 5 },
              { quote: "App syncing could be faster, but the insights are worth the wait. Great product!", name: "Nikhil G.", title: "Data Analyst", stars: 4 },
              { quote: "Bought one for my parents too. The health alerts gave us peace of mind.", name: "Kavitha R.", title: "IT Manager", stars: 5 },
              { quote: "The daily rhythm score is addictive! I check it every morning to plan my day.", name: "Sanjay D.", title: "Sales Executive", stars: 5 },
              { quote: "Finally a health device made in India that rivals international brands. Proud to wear it!", name: "Lakshmi B.", title: "Government Officer", stars: 5 },
              { quote: "Wish it had more color options, but functionality is excellent. Gets the job done.", name: "Amit H.", title: "Freelance Writer", stars: 4 },
              { quote: "Customer support was helpful when I had setup issues. Great after-sales service.", name: "Rekha P.", title: "Homemaker", stars: 5 },
              { quote: "The kinetic rhythm feature helped me optimize my workout timing. No more burnouts!", name: "Varun C.", title: "Gym Trainer", stars: 5 },
            ].map((review, i) => (
              <motion.div 
                key={i} 
                className="bg-card border rounded-2xl p-5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`h-4 w-4 ${j < review.stars ? 'fill-primary text-primary' : 'text-muted-foreground'}`} />
                  ))}
                </div>
                {review.image && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img src={review.image} alt={`${review.name}'s photo`} className="w-full h-40 object-cover" />
                  </div>
                )}
                <p className="text-muted-foreground mb-4 text-sm italic">"{review.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground text-sm">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Republic Day Sale FAQ Section */}
      {isSaleActive() && (
        <section className="py-16 bg-background">
          <div className="container max-w-3xl">
            <AnimatedSection className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <HelpCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sale FAQ</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Republic Day Offer Questions
              </h2>
            </AnimatedSection>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="how-to-apply">
                <AccordionTrigger className="text-left">
                  How do I apply the coupon code?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Simply enter the code <span className="font-mono font-bold text-primary">{SALE_CODE}</span> at checkout. 
                    The 10% discount will be automatically applied to your EasyTouch Rhythm purchase. 
                    You can copy the code using any of the copy buttons on this page.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="valid-products">
                <AccordionTrigger className="text-left">
                  Is this offer valid only for EasyTouch Rhythm?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    Yes, the Republic Day 10% OFF offer with code <span className="font-mono font-bold text-primary">{SALE_CODE}</span> is 
                    exclusively valid for EasyTouch Rhythm. Other Agatsa products are not included in this promotion.
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="offer-duration">
                <AccordionTrigger className="text-left">
                  Till when is the offer active?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    The Republic Day offer is valid until <span className="font-bold text-foreground">January 26, 2026 at 11:59 PM IST</span>. 
                    After this time, the coupon code will no longer work. We recommend placing your order soon to avoid missing out!
                  </p>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="combine-offers">
                <AccordionTrigger className="text-left">
                  Can I combine this with other offers?
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">
                    The Republic Day discount cannot be combined with other coupon codes. However, you still get 
                    free shipping and the bonus meal logging feature (worth ₹1,200/year) included with your purchase.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      )}

      {/* Section 11: Final CTA */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="container">
          <AnimatedSection className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to understand your body?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands who have discovered the power of rhythm-based health insights.
            </p>
            
            <div className="bg-card border rounded-2xl p-8 mb-8">
              {/* Republic Day Sale Pricing */}
              {isSaleActive() ? (
                <>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">🇮🇳</span>
                    <span className="text-sm font-medium text-primary">Republic Day Discount Active</span>
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="text-4xl font-bold text-foreground">₹4,499</span>
                    <span className="text-xl text-muted-foreground line-through">₹4,999</span>
                    <span className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      10% OFF
                    </span>
                  </div>
                  <CouponCodeBox variant="compact" className="justify-center mb-4" />
                  <CountdownTimer variant="compact" className="justify-center mb-6" />
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-4xl font-bold text-foreground">₹4,999</span>
                    <span className="text-xl text-muted-foreground line-through">₹7,999</span>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Save ₹3,000
                    </span>
                  </div>
                  <p className="text-orange-600 text-sm mb-6">Limited stock – Only 4 units left!</p>
                </>
              )}
              
              <Button 
                size="lg" 
                className="text-lg px-12 py-6 gap-2 w-full sm:w-auto"
                onClick={handleAddToCart}
                disabled={addingToCart || loading}
              >
                {addingToCart ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="h-5 w-5" />
                )}
                {isSaleActive() ? "Grab Yours — ₹4,499" : "Add to Cart"}
              </Button>
              
              {isSaleActive() && (
                <p className="text-sm text-muted-foreground mt-4">
                  Offer expires Jan 26 — order today!
                </p>
              )}
              
              <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  7-Day Returns (Mfg. Defects)
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Questions? <Link to="/support#contact" className="text-primary hover:underline">Contact our team</Link>
            </p>
          </AnimatedSection>
        </div>
      </section>
      <StickyAddToCart
        productName="EasyTouch Rhythm"
        price={isSaleActive() ? "₹4,499 (10% OFF)" : "₹4,999"}
        onAddToCart={handleAddToCart}
        isLoading={loading}
        themeColor="primary"
      />
    </Layout>
  );
};

export default EasyTouchRhythmProduct;
