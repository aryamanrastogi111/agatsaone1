import { useSEO } from "@/hooks/useSEO";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, ChevronDown, ChevronUp, Shield, Package, RefreshCw, Home, HomeIcon, Building2, Briefcase, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SiteLayout } from "@/components/SiteLayout";
const faqs = [{
  question: "How accurate are Agatsa devices?",
  answer: "Our devices are designed to meet medical-grade accuracy standards. SanketLife, for example, has been clinically validated to match the accuracy of traditional 12-lead ECG machines. All our devices undergo rigorous testing and are certified by regulatory bodies including ISO 13485, BIS, and CDSCO."
}, {
  question: "Do I need a prescription to buy these devices?",
  answer: "No, our devices are designed for home use and do not require a prescription. However, we always recommend consulting with your healthcare provider about your health monitoring needs and sharing your device readings with them during checkups."
}, {
  question: "What is the warranty period?",
  answer: "All Agatsa devices come with a 1-year manufacturer's warranty covering defects in materials and workmanship. Extended warranty options are available for purchase. The warranty does not cover damage from misuse, accidents, or unauthorized modifications."
}, {
  question: "Can I share my readings with my doctor?",
  answer: "Yes! All our devices generate PDF reports that can be easily shared with your healthcare provider via email, WhatsApp, or other messaging apps. The reports are designed to be clear and informative for both patients and medical professionals."
}, {
  question: "What is the return policy?",
  answer: "We offer a 15-day return policy from the date of delivery. The product must be unused and in its original packaging. For hygiene reasons, once a device has been used, returns are only accepted if there's a manufacturing defect."
}, {
  question: "Do you ship internationally?",
  answer: "Yes, we ship to over 50 countries worldwide. International shipping times and costs vary by location. Please check the shipping information at checkout for your specific country."
}];
const solutions = [{
  id: "home",
  icon: HomeIcon,
  title: "For Home Users",
  subtitle: "Personal Health Monitoring",
  description: "Take charge of your health from the comfort of your home. Our devices are designed to be easy to use, with clear results you can understand and share with your doctor.",
  benefits: ["Monitor your health daily without clinic visits", "Easy-to-read reports you can share with doctors", "Peace of mind for you and your family", "Track trends over time to catch issues early"],
  products: [{
    name: "SanketLife",
    link: "/products/sanketlife"
  }, {
    name: "EasyTouch Rhythm",
    link: "/products/easytouch-rhythm"
  }, {
    name: "Zlu – Sleep Aid",
    link: "/products/zlu"
  }, {
    name: "CoreBalance BMI",
    link: "/products/corebalance"
  }],
  cta: "Explore Home Products",
  link: "/products"
}, {
  id: "clinics",
  icon: Building2,
  title: "For Clinics & Hospitals",
  subtitle: "Healthcare Facility Integration",
  description: "Enhance your practice with medical-grade monitoring devices that integrate seamlessly into your workflow. Provide better care with accurate, instant results.",
  benefits: ["Medical-grade accuracy certified for clinical use", "Quick screening for high patient volumes", "Digital records for easy documentation", "Cost-effective compared to traditional equipment"],
  products: [{
    name: "SanketLife Pro",
    link: "/products/sanketlife"
  }, {
    name: "CoreBalance Clinical",
    link: "/products/corebalance"
  }, {
    name: "Multi-device licensing",
    link: "/support#contact"
  }],
  cta: "Request Demo",
  link: "/support#contact"
}, {
  id: "enterprise",
  icon: Briefcase,
  title: "For Enterprises",
  subtitle: "Corporate Wellness Programs",
  description: "Invest in your team's health with comprehensive wellness solutions. Our enterprise packages help you build a healthier, more productive workforce.",
  benefits: ["Bulk device procurement with volume discounts", "Custom wellness program design", "Employee health analytics dashboard", "Dedicated support and training"],
  products: [{
    name: "Custom device bundles",
    link: "/support#contact"
  }, {
    name: "Health screening camps",
    link: "/support#contact"
  }, {
    name: "API integration",
    link: "/support#contact"
  }],
  cta: "Contact Sales",
  link: "/support#contact"
}];
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0
  }
};
const Support = () => {
  useSEO({ title: "Help & Support — Agatsa One", description: "Get help with Agatsa One devices and app. FAQs, warranty info, and contact support." });

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
  };
  return <SiteLayout>
      {/* Hero */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center max-w-3xl mx-auto">
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              How Can We Help?
            </h1>
            <p className="text-lg text-muted-foreground">
              Our support team is here to assist you with any questions about
              our products, orders, or technical issues.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-16 bg-background">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Solutions for Everyone
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're monitoring your health at home, running a clinic,
              or building a corporate wellness program — we have solutions
              tailored for you.
            </p>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true
        }} className="space-y-16">
            {solutions.map((solution, index) => {
            const Icon = solution.icon;
            const isReversed = index % 2 === 1;
            const isEnterprise = solution.id === "enterprise";
            return <motion.div key={solution.id} id={solution.id} variants={itemVariants} className={`${isEnterprise ? "max-w-2xl mx-auto" : "grid lg:grid-cols-2 gap-12 items-center"} ${isReversed && !isEnterprise ? "lg:flex-row-reverse" : ""}`}>
                  <div className={isReversed && !isEnterprise ? "lg:order-2" : ""}>
                    <div className={`flex items-center gap-3 mb-4 ${isEnterprise ? "justify-center" : ""}`}>
                      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className={isEnterprise ? "text-center" : ""}>
                        <p className="text-sm text-primary font-medium">
                          {solution.subtitle}
                        </p>
                        <h2 className="text-3xl font-bold text-foreground">
                          {solution.title}
                        </h2>
                      </div>
                    </div>
                    <p className={`text-muted-foreground text-lg mb-6 ${isEnterprise ? "text-center" : ""}`}>
                      {solution.description}
                    </p>
                    <ul className={`space-y-3 mb-8 ${isEnterprise ? "max-w-md mx-auto" : ""}`}>
                      {solution.benefits.map((benefit, i) => <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{benefit}</span>
                        </li>)}
                    </ul>
                    <div className={isEnterprise ? "text-center" : ""}>
                      <Button asChild size="lg">
                        <Link to={solution.link} className="flex items-center gap-2">
                          {solution.cta}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                  {!isEnterprise && <div className={`${isReversed ? "lg:order-1" : ""}`}>
                      <div className="bg-muted/50 rounded-2xl p-8">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                          Recommended Products
                        </h3>
                        <div className="space-y-3">
                          {solution.products.map((product, i) => <Link key={i} to={product.link} className="bg-background rounded-xl p-4 flex items-center justify-between group hover:shadow-md transition-shadow cursor-pointer block">
                              <span className="font-medium text-foreground">
                                {product.name}
                              </span>
                              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </Link>)}
                        </div>
                      </div>
                    </div>}
                </motion.div>;
          })}
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Warranty</h3>
              <p className="text-sm text-muted-foreground">
                Register your product and check warranty status
              </p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1
          }} className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Track Order</h3>
              <p className="text-sm text-muted-foreground">
                Check the status of your recent orders
              </p>
            </motion.div>

            <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2
          }} className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Returns</h3>
              <p className="text-sm text-muted-foreground">
                Initiate a return or exchange request
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-background">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => <motion.div key={index} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.05
          }} className="bg-card rounded-xl border border-border overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-foreground">{faq.question}</span>
                  {openFaq === index ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </button>
                {openFaq === index && <div className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>}
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }}>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Get in Touch
              </h2>
              <p className="text-muted-foreground mb-8">
                Have a question or need assistance? Our team is here to help.
                Reach out to us through any of these channels.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Email</h3>
                    <a href="mailto:info@agatsa.com" className="text-primary hover:underline">
                      info@agatsa.com
                    </a>
                    <p className="text-sm text-muted-foreground">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>


                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Office</h3>
                    <p className="text-muted-foreground">
                      Agatsa Software Pvt. Ltd.<br />
                      New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section id="warranty" className="py-16 bg-background">
        <div className="container">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Warranty Information
            </h2>
            <p className="text-muted-foreground mb-8">
              All Agatsa devices come with a comprehensive 1-year warranty. Extended
              warranty options are available for additional peace of mind.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Standard Warranty</h3>
                <p className="text-sm text-muted-foreground">
                  1 year coverage for manufacturing defects
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Extended Warranty</h3>
                <p className="text-sm text-muted-foreground">
                  Optional 2-year extension available at purchase
                </p>
              </div>
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-2">Claim Process</h3>
                <p className="text-sm text-muted-foreground">
                  Easy online claims with doorstep pickup
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </SiteLayout>;
};
export default Support;