import { Link } from "react-router-dom";
import { motion, useInView, animate } from "framer-motion";
import { 
  Heart, 
  Shield, 
  ShoppingCart, 
  ArrowRight, 
  Check, 
  Play, 
  Award, 
  Globe, 
  Truck, 
  ShieldCheck, 
  RefreshCw,
  Phone,
  Smartphone,
  Share2,
  FileText,
  AlertTriangle,
  Activity,
  Zap,
  Clock,
  Users,
  Star,
  ChevronRight,
  BadgeCheck,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";
import { useRef, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShopifyProduct } from "@/hooks/useShopifyProduct";

// Image imports
import sanketlifeHeroV2 from "@/assets/sanketlife-device-app.png";
import sanketlifeGallery from "@/assets/sanketlife-2.0-display.png";
import sanketlifeHand from "@/assets/sanketlife-hand.jpg";
import sanketlife2Product from "@/assets/sanketlife-2-product-new.jpg";
import sanketlifeProplus from "@/assets/sanketlife-proplus-new.jpg";
import sanketlifeCombo from "@/assets/sanketlife-combo.png";
import sanketlifeComparison from "@/assets/sanketlife-comparison.png";
import hospitalEcg from "@/assets/hospital-ecg.png";
import smartwatchComparison from "@/assets/smartwatch-comparison.png";
import awardMbillionth from "@/assets/award-mbillionth.png";
import awardAegisGrahambell from "@/assets/award-aegis-grahambell.png";
import awardAnjaniMashelkar from "@/assets/award-anjani-mashelkar.png";

// Counting number animation component
const CountingNumber = ({ value, suffix = "", delay = 0, className = "" }: { value: number; suffix?: string; delay?: number; className?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        const controls = animate(0, value, {
          duration: 2,
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
      {displayValue}{suffix}
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

// Data
const heroStats = [
  { value: "50L+", label: "ECGs Recorded" },
  { value: "100+", label: "Countries" },
  { value: "10+", label: "Medical Trials" },
  { value: "CDSCO", label: "Certified" },
];

const problemStats = [
  { value: 32, suffix: "%", label: "of heart attacks happen at home", icon: AlertTriangle },
  { value: 60, suffix: " min", label: "golden hour for cardiac treatment", icon: Clock },
  { value: 25, suffix: "%", label: "of deaths in India are cardiac-related", icon: Heart },
  { value: 80, suffix: "%", label: "could be prevented with early detection", icon: Shield },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Place Your Fingers",
    description: "Simply place your fingertips on the device sensors. No gel, no electrodes, no preparation needed.",
    icon: Smartphone,
  },
  {
    step: 2,
    title: "Capture ECG",
    description: "In just 15 seconds, SanketLife captures a complete 12-lead ECG equivalent to hospital-grade machines.",
    icon: Activity,
  },
  {
    step: 3,
    title: "View Results",
    description: "Instantly view your ECG waveform on the mobile app with AI-powered analysis highlighting any abnormalities.",
    icon: FileText,
  },
  {
    step: 4,
    title: "Share with Doctor",
    description: "Generate a PDF report and share it directly with your cardiologist for professional review.",
    icon: Share2,
  },
];

const detectableConditions = [
  { name: "STEMI", description: "ST-segment Elevation Myocardial Infarction", critical: true },
  { name: "Heart Attack", description: "Myocardial Infarction", critical: false },
  { name: "Atrial Fibrillation", description: "Irregular Heartbeat", critical: false },
  { name: "Bradycardia", description: "Abnormally Slow Heart Rate", critical: false },
  { name: "Tachycardia", description: "Abnormally Fast Heart Rate", critical: false },
  { name: "Heart Blocks", description: "Electrical Conduction Disorders", critical: false },
  { name: "Arrhythmias", description: "Irregular Heart Rhythms", critical: false },
  { name: "Ischemia", description: "Reduced Blood Flow", critical: false },
  { name: "Enlarged Heart", description: "Chamber Enlargement", critical: false },
  { name: "Silent Heart Attacks", description: "Previous Undetected Events", critical: false },
  { name: "Electrolyte Imbalance", description: "Mineral Level Issues", critical: false },
];

const products = [
  {
    id: "sanketlife-2",
    name: "SanketLife 2.0",
    price: "₹4,999",
    originalPrice: "₹7,999",
    image: sanketlife2Product,
    description: "Perfect for individuals and families wanting to monitor heart health at home.",
    benefits: [
      "12-Lead ECG in 15 seconds",
      "25+ disease detection",
      "Unlimited cloud storage",
      "Family profiles supported",
    ],
    badge: "Best Seller",
  },
  {
    id: "sanketlife-proplus",
    name: "SanketLife Pro+",
    price: "₹7,999",
    originalPrice: "₹12,999",
    image: sanketlifeProplus,
    description: "Advanced features for professionals and clinics with enhanced reporting.",
    benefits: [
      "Everything in SanketLife 2.0",
      "Advanced analytics dashboard",
      "Multi-patient management",
      "Priority support",
    ],
    badge: "Professional",
  },
  {
    id: "combo",
    name: "Pro-Plus Combo",
    price: "₹14,999",
    originalPrice: "₹20,999",
    image: sanketlifeCombo,
    description: "Complete package with devices for both home and professional use.",
    benefits: [
      "SanketLife 2.0 + Pro+",
      "Best value package",
      "Extended warranty",
      "Premium support",
    ],
    badge: "Best Value",
  },
];

const awards = [
  { name: "Aegis Graham Bell Award 2022", image: awardAegisGrahambell },
  { name: "mBillionth Award 2017", image: awardMbillionth },
  { name: "Anjani Mashelkar Prize 2025", image: awardAnjaniMashelkar, recent: true },
];

const medicalTrials = [
  { title: "Indian Pacing and Electrophysiology Journal", year: "2018" },
  { title: "Journal of Practice of Cardiovascular Sciences", year: "2019" },
  { title: "Advanced Research Publication", year: "2016" },
  { title: "ACC Research Study", year: "2020" },
];

const comparisonFeatures = [
  { feature: "Regulatory Approval", sanketlife: true, hospital: true, smartwatch: false, others: "Limited" },
  { feature: "25+ Condition Detection", sanketlife: true, hospital: true, smartwatch: false, others: false },
  { feature: "12-Lead ECG Analysis", sanketlife: true, hospital: true, smartwatch: false, others: true },
  { feature: "Medical-Grade ECG", sanketlife: true, hospital: true, smartwatch: false, others: "Varies" },
  { feature: "Early Detection Alerts", sanketlife: true, hospital: false, smartwatch: "Limited", others: "Limited" },
  { feature: "Always Available", sanketlife: true, hospital: false, smartwatch: true, others: true },
  { feature: "No Appointments", sanketlife: true, hospital: false, smartwatch: true, others: true },
  { feature: "Instant Results", sanketlife: true, hospital: false, smartwatch: true, others: true },
  { feature: "Doctor Sharing", sanketlife: true, hospital: true, smartwatch: "Limited", others: "Limited" },
  { feature: "Portability", sanketlife: true, hospital: false, smartwatch: true, others: true },
  { feature: "Cost per ECG", sanketlife: "₹0", hospital: "₹500-2000", smartwatch: "N/A", others: "₹0" },
];

const testimonials = [
  {
    quote: "SanketLife detected my irregular heartbeat before any symptoms appeared. My cardiologist was amazed by the report quality.",
    name: "Rajesh Kumar",
    location: "Mumbai",
    age: "58 years",
  },
  {
    quote: "As a working mother, I couldn't keep visiting hospitals. Now I monitor my parents' heart health from my phone daily.",
    name: "Priya Sharma",
    location: "Delhi",
    age: "42 years",
  },
  {
    quote: "I recommend SanketLife to all my patients for home monitoring. The 12-lead accuracy rivals hospital equipment.",
    name: "Dr. Anand Mehta",
    location: "Cardiologist, Chennai",
    age: "",
  },
  {
    quote: "After my husband's heart attack, we bought SanketLife. It gives us peace of mind knowing we can check anytime.",
    name: "Sunita Patel",
    location: "Ahmedabad",
    age: "55 years",
  },
];

const SanketLifeProduct = () => {
  const { products: shopifyProducts, loading, findProductByTitle, addToCart } = useShopifyProduct();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (searchTitle: string) => {
    const product = findProductByTitle(searchTitle);
    if (product) {
      setAddingToCart(true);
      addToCart(product);
      setTimeout(() => setAddingToCart(false), 500);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center bg-gradient-to-b from-cyan-50/50 via-background to-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-6 border border-cyan-200">
                <Heart className="h-4 w-4" />
                12-Lead ECG Technology
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4">
                Your Heart Speaks{" "}
                <span className="text-cyan-600">Before</span> an Attack.
              </h1>
              
              <p className="text-xl text-cyan-600 font-semibold mb-4">
                We Have Helped 4 Million People Listen.
              </p>
              
              <div className="text-3xl font-bold text-foreground mb-4 tracking-wide">
                SANKET<span className="text-cyan-600">LIFE</span>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                The world's smallest touch-based 12-lead ECG device that fits in your pocket. 
                Detect 25+ heart conditions at home, anytime—no training required.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                  onClick={() => handleAddToCart("Sanket life 2.0")}
                  disabled={addingToCart || loading}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  Add to Cart — ₹4,999
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-cyan-200 text-cyan-700 hover:bg-cyan-50" asChild>
                  <Link to="/products">View All Products</Link>
                </Button>
              </div>
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border">
                {heroStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-cyan-600">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-200/40 via-transparent to-blue-200/40 rounded-3xl blur-3xl" />
                <img
                  src={sanketlifeHeroV2}
                  alt="SanketLife ECG Device with App"
                  className="relative w-full max-w-lg mx-auto"
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                />
              </div>
              
              {/* Best Seller Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="absolute top-4 right-4 lg:right-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
              >
                ⭐ Best Seller
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Every Minute Counts When Your{" "}
                <span className="text-cyan-600">Heart is at Risk</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Heart disease remains the #1 killer globally. Yet most cardiac events happen suddenly, 
                at home, when help is far away. The warning signs are there—if only we could detect them early.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {problemStats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-cyan-600" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    <CountingNumber value={stat.value} suffix={stat.suffix} delay={i * 0.2} />
                  </div>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
            
            <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 border border-cyan-200 rounded-2xl p-8 text-center">
              <p className="text-xl md:text-2xl text-foreground font-medium">
                What if you could{" "}
                <span className="text-cyan-600">monitor your heart health</span>{" "}
                anytime, anywhere?
              </p>
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="mt-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <img
                  src={sanketlifeGallery}
                  alt="SanketLife device variants"
                  className="w-full rounded-2xl shadow-lg"
                  onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Hospital-Grade ECG in Your Pocket
                </h3>
                <p className="text-muted-foreground mb-6">
                  SanketLife brings clinical-quality cardiac monitoring to your fingertips. 
                  No appointments. No waiting. Just place your fingers and know your heart's health in 15 seconds.
                </p>
                <ul className="space-y-4">
                  {[
                    "Detect heart attacks BEFORE they become emergencies",
                    "Monitor post-cardiac event recovery at home",
                    "Track the effects of heart medications",
                    "Peace of mind for your entire family",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-6">
                Simple Process
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Medical-Grade ECG in{" "}
                <span className="text-cyan-600">4 Simple Steps</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                No training required. No appointments needed. Just your fingertips and 15 seconds.
              </p>
            </div>
            
            {/* YouTube Video Embed */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden border border-border shadow-lg">
                <iframe
                  src="https://www.youtube.com/embed/qAZYI6VCq0Q"
                  title="How to Use Agatsa SanketLife 2.0 | Step-by-Step ECG Device Guide for Home Use"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorksSteps.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-card border border-border rounded-2xl p-6 h-full hover:border-cyan-300 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                  {i < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ChevronRight className="h-8 w-8 text-cyan-300" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Disease Detection Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <AnimatedSection>
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium mb-6">
                  <Heart className="h-4 w-4" />
                  Early Detection Saves Lives
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                  Detect{" "}
                  <span className="text-cyan-600">25+ Heart Diseases</span>{" "}
                  Early
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Your heart's electrical signals tell a story. SanketLife's advanced algorithms 
                  analyze these signals to detect abnormalities before they become emergencies.
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {detectableConditions.map((condition, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className={`p-3 rounded-lg border ${
                        condition.critical 
                          ? "bg-red-50 border-red-200" 
                          : "bg-card border-border"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {condition.critical && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded font-medium">
                            Critical
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-foreground text-sm mt-1">{condition.name}</div>
                      <div className="text-xs text-muted-foreground">{condition.description}</div>
                    </motion.div>
                  ))}
                </div>
                
                <p className="text-muted-foreground text-sm italic">...and many more cardiac conditions</p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    Why Early ECG Monitoring Matters
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Heart attacks often have warning signs hours or days before",
                      "Silent heart attacks affect 45% of all cardiac events",
                      "Early detection can reduce mortality by up to 80%",
                      "Many arrhythmias are symptom-free until it's too late",
                      "Regular monitoring catches issues between doctor visits",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-8 text-center">
                  <div className="text-5xl md:text-6xl font-bold text-cyan-600 mb-2">
                    <CountingNumber value={50000} suffix="+" delay={0.3} />
                  </div>
                  <div className="text-xl text-foreground font-medium mb-1">Lives Protected</div>
                  <div className="text-muted-foreground text-sm">Through early detection with SanketLife</div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Product Selection Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Choose Your{" "}
                <span className="text-cyan-600">SanketLife</span>{" "}
                Device
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                SanketLife adapts to different needs—whether you're monitoring at home or in a clinical setting.
              </p>
            </div>
            
            <Tabs defaultValue="individual" className="w-full">
              <TabsList className="w-full max-w-md mx-auto mb-12 bg-muted border border-border">
                <TabsTrigger value="individual" className="flex-1 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  For Individual Use
                </TabsTrigger>
                <TabsTrigger value="professional" className="flex-1 data-[state=active]:bg-cyan-600 data-[state=active]:text-white">
                  For Professional Use
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="individual">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.slice(0, 2).map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      viewport={{ once: true }}
                      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-cyan-300 hover:shadow-lg transition-all group"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                        />
                        {product.badge && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {product.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-cyan-600">{product.price}</span>
                          <span className="text-muted-foreground line-through">{product.originalPrice}</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {product.benefits.map((benefit, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-cyan-600" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-3">
                          <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="professional">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.slice(1).map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      viewport={{ once: true }}
                      className="bg-card border border-border rounded-2xl overflow-hidden hover:border-cyan-300 hover:shadow-lg transition-all group"
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                        />
                        {product.badge && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {product.badge}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-foreground mb-2">{product.name}</h3>
                        <p className="text-muted-foreground text-sm mb-4">{product.description}</p>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-2xl font-bold text-cyan-600">{product.price}</span>
                          <span className="text-muted-foreground line-through">{product.originalPrice}</span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          {product.benefits.map((benefit, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-cyan-600" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-3">
                          <Button className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button variant="outline" className="border-border text-foreground hover:bg-muted">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </AnimatedSection>
        </div>
      </section>


      {/* Comparison Table Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                How We Are{" "}
                <span className="text-cyan-600">Unlike</span>{" "}
                Any Other Heart Monitoring Solution
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-muted-foreground font-medium">Feature</th>
                    <th className="py-4 px-4">
                      <span className="text-cyan-600 font-semibold">SanketLife</span>
                    </th>
                    <th className="py-4 px-4">
                      <span className="text-foreground font-medium">Hospital ECG</span>
                    </th>
                    <th className="py-4 px-4">
                      <span className="text-foreground font-medium">Smartwatch</span>
                    </th>
                    <th className="py-4 px-4 text-foreground font-medium">Other Home 12-Lead</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((row, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-4 px-4 text-foreground">{row.feature}</td>
                      <td className="py-4 px-4 text-center">
                        {row.sanketlife === true ? (
                          <Check className="h-5 w-5 text-cyan-600 mx-auto" />
                        ) : (
                          <span className="text-cyan-600 font-medium">{row.sanketlife}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.hospital === true ? (
                          <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : row.hospital === false ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-muted-foreground">{row.hospital}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.smartwatch === true ? (
                          <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : row.smartwatch === false ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-muted-foreground">{row.smartwatch}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {row.others === true ? (
                          <Check className="h-5 w-5 text-muted-foreground mx-auto" />
                        ) : row.others === false ? (
                          <span className="text-muted-foreground">—</span>
                        ) : (
                          <span className="text-muted-foreground">{row.others}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <p className="text-center text-muted-foreground text-sm mt-6">
              * SanketLife is CDSCO approved as a Class B medical device in India
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 lg:py-32 bg-muted/30">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Lives Protected.{" "}
                <span className="text-cyan-600">Hearts Saved.</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of families who've taken control of their heart health with SanketLife.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-6 italic">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.location}{testimonial.age && ` • ${testimonial.age}`}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trust & Certifications Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                Trusted by{" "}
                <span className="text-cyan-600">Millions</span>{" "}
                Worldwide
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                { value: "50 Lakh+", label: "ECGs Recorded", icon: Activity },
                { value: "100+", label: "Countries", icon: Globe },
                { value: "CDSCO", label: "Certified", icon: BadgeCheck },
                { value: "🇮🇳", label: "Made in India", icon: Shield },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm"
                >
                  <div className="text-3xl font-bold text-cyan-600 mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-8">
              {[
                { label: "CDSCO Approved", sublabel: "Class B Medical Device" },
                { label: "ISO 13485", sublabel: "Certified" },
                { label: "Made in India", sublabel: "Designed & Manufactured" },
              ].map((cert, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-4 bg-card rounded-xl border border-border shadow-sm">
                  <Shield className="h-8 w-8 text-cyan-600" />
                  <div>
                    <div className="font-semibold text-foreground">{cert.label}</div>
                    <div className="text-xs text-muted-foreground">{cert.sublabel}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 lg:py-32 bg-gradient-to-b from-cyan-50/50 via-background to-background">
        <div className="container">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
                <Zap className="h-4 w-4" />
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Don't Wait for Symptoms.{" "}
                <span className="text-cyan-600">Start Monitoring Today.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Your heart deserves the same attention you give to the rest of your health. 
                With SanketLife, protecting your heart is as simple as a 15-second check.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 gap-2 bg-cyan-600 hover:bg-cyan-700 text-white"
                  onClick={() => handleAddToCart("Sanket life 2.0")}
                  disabled={addingToCart || loading}
                >
                  {addingToCart ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-5 w-5" />
                  )}
                  Add to Cart — ₹4,999
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-cyan-200 text-cyan-700 hover:bg-cyan-50 gap-2">
                  <Phone className="h-5 w-5" />
                  Talk to an Expert
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-cyan-600" />
                  Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-cyan-600" />
                  30-Day Money-Back Guarantee
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-600" />
                  1-Year Warranty
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container">
          <AnimatedSection>
            <div className="bg-gradient-to-r from-cyan-50 via-blue-50 to-cyan-50 border border-cyan-200 rounded-3xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium mb-6">
                    <Smartphone className="h-4 w-4" />
                    Get The App
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Download SanketLife App
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    View your ECG results, track heart health trends over time, share reports with doctors, 
                    and manage multiple family member profiles—all from your smartphone.
                  </p>
                  
                  <div className="flex flex-wrap gap-4">
                    <a
                      href="https://apps.apple.com/app/sanketlife"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-foreground rounded-xl hover:bg-foreground/90 transition-colors"
                    >
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="white">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-xs text-gray-400">Download on the</div>
                        <div className="text-sm font-semibold text-white">App Store</div>
                      </div>
                    </a>
                    <a
                      href="https://play.google.com/store/apps/details?id=com.sanketlife"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-foreground rounded-xl hover:bg-foreground/90 transition-colors"
                    >
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="white">
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-xs text-gray-400">Get it on</div>
                        <div className="text-sm font-semibold text-white">Google Play</div>
                      </div>
                    </a>
                  </div>
                </div>
                
                <div className="relative">
                  <img
                    src={sanketlifeHeroV2}
                    alt="SanketLife App"
                    className="w-full max-w-sm mx-auto"
                    onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};

export default SanketLifeProduct;
