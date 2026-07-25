import { useSEO } from "@/hooks/useSEO";
import { SiteLayout } from "@/components/SiteLayout";
import { motion } from "framer-motion";
import { Truck, Clock, Globe, Package, MapPin, Mail, Phone } from "lucide-react";

const ShippingPolicy = () => {
  useSEO({ title: "Shipping Policy — Agatsa One", description: "Free shipping across India. Flat ₹3000 international shipping to all countries." });

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
                <Truck className="h-4 w-4" />
                Shipping Information
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Shipping Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Information about how we deliver Agatsa products to you
              </p>
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container">
            <div className="max-w-4xl mx-auto prose prose-lg">
              
              {/* Shipping Coverage */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground m-0">Shipping Coverage</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    Agatsa ships its range of health monitoring devices—including CoreBalance BMI, EasyTouch Rhythm, SanketLife, and Zlu Sleep Aid—across India and to selected international destinations.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>We deliver to all major cities and towns across India</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>International shipping available worldwide at a <strong>flat rate of ₹3000</strong> per order</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>If you're unsure whether we deliver to your location, please contact our support team</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Order Processing */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground m-0">Order Processing</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Orders are processed within <strong>2–3 business days</strong> after successful payment confirmation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Orders are not processed or dispatched on Sundays or public holidays</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Once your order is dispatched, you will receive tracking details via SMS and/or email</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Delivery Timelines - India */}
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
                  <h2 className="text-2xl font-bold text-foreground m-0">Delivery Timelines (India)</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <p className="font-semibold text-foreground">Metro Cities</p>
                      <p className="text-2xl font-bold text-primary">~3 days</p>
                      <p className="text-sm text-muted-foreground">business days</p>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <p className="font-semibold text-foreground">Tier 2/3 Cities</p>
                      <p className="text-2xl font-bold text-primary">~5 days</p>
                      <p className="text-sm text-muted-foreground">business days</p>
                    </div>
                    <div className="text-center p-4 bg-primary/5 rounded-lg">
                      <p className="font-semibold text-foreground">Remote Areas</p>
                      <p className="text-2xl font-bold text-primary">7–10 days</p>
                      <p className="text-sm text-muted-foreground">business days</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Note: These are estimated timelines and may vary depending on courier partner availability, weather conditions, or unforeseen circumstances.
                  </p>
                </div>
              </motion.div>

              {/* International Shipping */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground m-0">International Shipping</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>Flat shipping fee of ₹3000</strong> to all international destinations — no matter the country, weight or order size</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>The ₹3000 surcharge is added automatically at checkout when you select a country other than India</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Estimated delivery: <strong>7–14 business days</strong> after dispatch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Customs clearance may cause additional delays depending on destination country regulations</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Customs Disclaimer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Package className="h-6 w-6 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground m-0">Customs & Import Charges</h2>
                </div>
                <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Any customs duties, taxes, or import charges are the responsibility of the customer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Agatsa is not responsible for customs-related delays, package rejections, or additional fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>Orders returned due to customs issues or refusal to pay duties are non-refundable</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Shipping Charges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground m-0">Shipping Charges</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>India:</strong> Free shipping on all orders</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span><strong>International:</strong> Flat <strong>₹3000</strong> per order, applied automatically at checkout. Non-refundable on returns.</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Tracking & Delivery Issues */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground m-0">Tracking & Delivery Issues</h2>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Tracking information may take up to 24 hours to activate after dispatch</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Lost or delayed shipments will be handled on a case-by-case basis in coordination with our courier partners</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>Customers are responsible for providing accurate shipping addresses. Agatsa is not liable for delays or non-delivery due to incorrect address information</span>
                    </li>
                  </ul>
                </div>
              </motion.div>

              {/* Address Changes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Address Changes</h2>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-muted-foreground">
                    Address changes are only possible before the order has been dispatched. Once shipped, the delivery address cannot be modified. Please contact our support team immediately if you need to update your shipping address.
                  </p>
                </div>
              </motion.div>

              {/* Contact */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-12"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <p className="text-muted-foreground mb-4">
                    For any shipping-related queries, please reach out to our support team:
                  </p>
                  <div className="space-y-3">
                    <a href="mailto:info@agatsa.com" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                      <Mail className="h-5 w-5 text-primary" />
                      info@agatsa.com
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

export default ShippingPolicy;
