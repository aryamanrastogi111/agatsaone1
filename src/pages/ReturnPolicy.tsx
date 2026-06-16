import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { RefreshCw, CheckCircle, XCircle, Clock, Mail, Phone } from "lucide-react";

const ReturnPolicy = () => {
  useSEO({ title: "Return & Refund Policy — Agatsa One", description: "7-day return policy for verified manufacturing defects. Products must be returned in original packaging and pass technical inspection." });

  return (
    <SiteLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-6 md:py-10">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <RefreshCw className="h-4 w-4" />
                Returns & Refunds
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Return & Refund Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Our commitment to your satisfaction with Agatsa products
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              
              {/* Return Window */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Return Window</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground">
                    Returns are accepted within <strong className="text-foreground">7 days</strong> of delivery for all Agatsa products, including CoreBalance BMI, EasyTouch Rhythm, SanketLife, and Zlu Sleep Aid.
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
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Eligibility for Returns</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    Returns are accepted <strong className="text-foreground">only for verified manufacturing defects</strong>. This includes:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Hardware malfunctions not caused by user damage</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Defective components identified upon first use</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Missing parts or accessories from the original package</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Conditions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Return Conditions</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>The product must be returned in its <strong>original packaging</strong> with all accessories, manuals, and components included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>The device will undergo a <strong>technical inspection</strong> by our quality team to verify the manufacturing defect</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Returns initiated without prior approval from our support team may not be processed</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Non-Eligible Returns */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <XCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Non-Eligible for Returns</h2>
                </div>
                <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">The following situations are <strong className="text-foreground">not eligible</strong> for returns or refunds:</p>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Normal variations</strong> in health readings or results (this is not a defect)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Incorrect usage</strong> or improper calibration of the device</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Physical damage</strong> including drops, cracks, or bent components</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span><strong>Water or liquid damage</strong> unless the product is rated for water resistance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Return requests made <strong>after the 7-day window</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Products purchased from <strong>unauthorized resellers</strong></span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Refund Processing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <RefreshCw className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Refund Processing</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Once a return is approved after inspection, refunds are processed within <strong>7–10 business days</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Refunds will be credited to the <strong>original payment method</strong> used during purchase</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You will receive an email confirmation once the refund has been initiated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>International orders:</strong> The flat <strong>₹2,000 international shipping fee is non-refundable</strong>, and return shipping costs are borne by the customer</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* How to Initiate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">How to Initiate a Return</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ol className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">1</span>
                      <span>Contact our support team at <a href="mailto:info@agatsa.com" className="text-primary hover:underline">info@agatsa.com</a> with your order details and description of the issue</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">2</span>
                      <span>Our team will review your request and provide a Return Authorization if eligible</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">3</span>
                      <span>Pack the product securely in its original packaging and ship it to the address provided</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">4</span>
                      <span>Once received and inspected, we will process your refund or replacement</span>
                    </li>
                  </ol>
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    For return or refund inquiries, please contact our support team:
                  </p>
                  <div className="space-y-3">
                    <a href="mailto:info@agatsa.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                      info@agatsa.com
                    </a>
                    <a href="tel:08069289999" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                      <Phone className="h-5 w-5 text-primary" />
                      08069289999
                    </a>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>
      </div>
    </SiteLayout>
  );
};

export default ReturnPolicy;
