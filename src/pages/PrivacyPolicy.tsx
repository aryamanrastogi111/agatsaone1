import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Shield, Database, Share2, Lock, Mail, MapPin } from "lucide-react";

const PrivacyPolicy = () => {
  useSEO({ title: "Privacy Policy — Agatsa One", description: "Read how Agatsa collects, uses, and protects your personal data. CDSCO-compliant medical device data handling." });

  return (
    <SiteLayout>
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
                <Shield className="h-4 w-4" />
                Your Privacy Matters
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                How Agatsa collects, uses, and protects your information
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
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    This Privacy Policy applies to all Agatsa websites, mobile applications, and devices—including CoreBalance BMI, EasyTouch Rhythm, SanketLife, and Zlu Sleep Aid.
                  </p>
                  <p className="text-muted-foreground">
                    At Agatsa, we are committed to protecting your privacy and ensuring the security of your personal and health-related information. This policy explains what data we collect, how we use it, and your rights regarding that data.
                  </p>
                </div>
              </motion.div>

              {/* Product Nature Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Important Disclaimer</h2>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    Agatsa products are designed to provide <strong className="text-foreground">wellness insights and health awareness</strong> only. Our devices and applications:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Do <strong>not</strong> diagnose, treat, cure, or prevent any diseases</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Do <strong>not</strong> replace professional medical advice, diagnosis, or treatment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Should be used as supplementary tools alongside regular healthcare consultations</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Information Collected */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Information We Collect</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Name, email address, phone number</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Shipping and billing addresses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Account credentials (encrypted)</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Device & App Usage Data</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>App usage patterns and feature interactions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Device model, operating system, and app version</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Technical and diagnostic data for troubleshooting</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Health-Related Data</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Measurements and readings generated by Agatsa devices (e.g., ECG, BMI, sleep data)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>User-entered health profile information</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Location Data</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Approximate location (only with your explicit permission, for features that require it)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Usage of Data */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">How We Use Your Data</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Device & App Operation:</strong> To enable the core functionality of our products and applications</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Reports & Insights:</strong> To generate health reports and personalized wellness insights</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Product Improvement:</strong> To improve accuracy, user experience, and develop new features</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Customer Support:</strong> To respond to your inquiries and provide technical assistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Order Fulfillment:</strong> To process orders, payments, and shipping</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Data Sharing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Data Sharing</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4 font-semibold">
                    We do <strong className="text-foreground">not sell or trade</strong> your personal or health data.
                  </p>
                  <p className="text-muted-foreground mb-4">We may share data only in the following circumstances:</p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Trusted Service Providers:</strong> With partners who help us operate our services (e.g., payment processors, shipping companies), under strict confidentiality agreements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Legal Requirements:</strong> When required by law, court order, or government request</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Corporate Restructuring:</strong> In the event of a merger, acquisition, or sale of assets, with prior notice to users</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Security & Retention */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Lock className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Security & Data Retention</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Security Measures</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Encrypted data transmission (SSL/TLS)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Secure data storage with industry-standard encryption</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Restricted access to personal data (need-to-know basis)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Regular security audits and updates</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Data is retained while your account is active</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Upon account deletion, personal data is removed within 90 days (except where legally required to retain)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>Anonymized/aggregated data may be retained for research and product improvement</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Your Rights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">You have the right to:</p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Access:</strong> Request a copy of your personal data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Correction:</strong> Request correction of inaccurate data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Deletion:</strong> Request deletion of your personal data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Opt-out:</strong> Unsubscribe from marketing communications</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4">
                    To exercise these rights, please contact us at <a href="mailto:info@agatsa.com" className="text-primary hover:underline">info@agatsa.com</a>.
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
                    <a href="mailto:info@agatsa.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                      info@agatsa.com
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
    </SiteLayout>
  );
};

export default PrivacyPolicy;
