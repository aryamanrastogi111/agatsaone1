import { Layout } from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { FileText, User, ShoppingCart, Shield, Scale, Mail, MapPin } from "lucide-react";

const TermsOfService = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <FileText className="h-4 w-4" />
                Legal Agreement
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Please read these terms carefully before using Agatsa products and services
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Introduction</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    These Terms of Service ("Terms") govern your use of all Agatsa websites, mobile applications, devices, and related services. This includes all Agatsa products such as CoreBalance BMI, EasyTouch Rhythm, SanketLife, and Zlu Sleep Aid.
                  </p>
                  <p className="text-muted-foreground">
                    By accessing or using any Agatsa product or service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our products or services.
                  </p>
                </div>
              </motion.div>

              {/* Eligibility */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Eligibility</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You must be at least <strong>18 years of age</strong> to use Agatsa products and services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>If you are under 18, you may only use our products under the supervision of a parent or legal guardian who agrees to these Terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>By using our services, you represent that you have the legal capacity to enter into a binding agreement</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Wellness Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Wellness Disclaimer</h2>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6">
                  <p className="text-muted-foreground mb-4 font-semibold">
                    Agatsa products are intended for <strong className="text-foreground">health awareness and monitoring purposes only</strong>.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Our devices provide wellness insights and are <strong>not</strong> medical diagnostic tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Readings and data should <strong>not</strong> be used as a substitute for professional medical advice, diagnosis, or treatment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Always consult with qualified healthcare professionals for medical concerns</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>In case of emergency, contact emergency services immediately—do not rely solely on device readings</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Orders & Payments */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Orders & Payments</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>All prices are subject to change without prior notice</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Product availability may vary and is not guaranteed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Agatsa reserves the right to limit quantities or cancel orders at its discretion</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Payment must be completed before order processing begins</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>We accept major credit cards, debit cards, UPI, and other payment methods as displayed at checkout</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* User Accounts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">User Accounts</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You are responsible for maintaining the confidentiality of your account credentials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You are responsible for all activities that occur under your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Notify us immediately if you suspect unauthorized access to your account</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>One account per person; sharing accounts is not permitted</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Acceptable Use */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Acceptable Use</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">You agree <strong>not</strong> to:</p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Misuse, tamper with, or modify our products or services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Interfere with the proper functioning of our websites, apps, or devices</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Reverse engineer, decompile, or disassemble any Agatsa software or hardware</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Use our products for any unlawful purpose</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Attempt to gain unauthorized access to our systems or other users' data</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Intellectual Property */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Intellectual Property</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>All content, trademarks, logos, software, and designs are owned by Agatsa Software Pvt Ltd</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You may not copy, reproduce, distribute, or create derivative works without written permission</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>The Agatsa name, product names, and logos are registered trademarks</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Warranty Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Warranty Disclaimer</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    Agatsa products are provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, except as expressly stated in our product warranty documentation.
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>We warrant against verified manufacturing defects as per our Return & Refund Policy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>We do not warrant uninterrupted or error-free operation of our apps or services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Health readings are for wellness purposes and accuracy may vary based on usage conditions</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Limitation of Liability */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Scale className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Limitation of Liability</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>To the maximum extent permitted by law, Agatsa's liability is limited to the <strong>amount paid for the product</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Agatsa is not liable for indirect, incidental, consequential, or punitive damages</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Agatsa is not liable for any medical decisions made based on device readings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Agatsa is not liable for data loss, service interruptions, or third-party actions</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Governing Law */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Governing Law</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground">
                    These Terms are governed by and construed in accordance with the laws of <strong>India</strong>. Any disputes arising from these Terms or your use of Agatsa products and services shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
                  </p>
                </div>
              </motion.div>

              {/* Changes to Terms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground">
                    Agatsa reserves the right to modify these Terms at any time. Changes will be posted on our website with an updated "Last Modified" date. Continued use of our products and services after changes constitutes acceptance of the new Terms.
                  </p>
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Information</h2>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <p className="font-semibold text-foreground mb-4">Agatsa Software Pvt Ltd</p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-muted-foreground">
                      <MapPin className="h-5 w-5 text-primary mt-0.5" />
                      <span>New Delhi, India</span>
                    </div>
                    <a href="mailto:care@agatsa.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                      care@agatsa.com
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground mt-6">
                    Last updated: January 2026
                  </p>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default TermsOfService;
