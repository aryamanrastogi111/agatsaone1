import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, ChevronDown, ChevronUp, Shield, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout";

const faqs = [
  {
    question: "How accurate are Agatsa devices?",
    answer: "Our devices are designed to meet medical-grade accuracy standards. SanketLife, for example, has been clinically validated to match the accuracy of traditional 12-lead ECG machines. All our devices undergo rigorous testing and are certified by international regulatory bodies like CE and FDA."
  },
  {
    question: "Do I need a prescription to buy these devices?",
    answer: "No, our devices are designed for home use and do not require a prescription. However, we always recommend consulting with your healthcare provider about your health monitoring needs and sharing your device readings with them during checkups."
  },
  {
    question: "What is the warranty period?",
    answer: "All Agatsa devices come with a 1-year manufacturer's warranty covering defects in materials and workmanship. Extended warranty options are available for purchase. The warranty does not cover damage from misuse, accidents, or unauthorized modifications."
  },
  {
    question: "Can I share my readings with my doctor?",
    answer: "Yes! All our devices generate PDF reports that can be easily shared with your healthcare provider via email, WhatsApp, or other messaging apps. The reports are designed to be clear and informative for both patients and medical professionals."
  },
  {
    question: "What is the return policy?",
    answer: "We offer a 15-day return policy from the date of delivery. The product must be unused and in its original packaging. For hygiene reasons, once a device has been used, returns are only accepted if there's a manufacturing defect."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to over 50 countries worldwide. International shipping times and costs vary by location. Please check the shipping information at checkout for your specific country."
  },
];

const Support = () => {
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
    // Form submission logic would go here
    console.log("Form submitted:", formData);
    alert("Thank you for your message! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
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

      {/* Quick Links */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Warranty</h3>
              <p className="text-sm text-muted-foreground">
                Register your product and check warranty status
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Track Order</h3>
              <p className="text-sm text-muted-foreground">
                Check the status of your recent orders
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
            >
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
      <section id="faq" className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-foreground">{faq.question}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
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
                    <a href="mailto:support@agatsa.com" className="text-primary hover:underline">
                      support@agatsa.com
                    </a>
                    <p className="text-sm text-muted-foreground">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">Phone</h3>
                    <a href="tel:+911234567890" className="text-primary hover:underline">
                      +91 123 456 7890
                    </a>
                    <p className="text-sm text-muted-foreground">
                      Mon-Sat, 9 AM - 6 PM IST
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">WhatsApp</h3>
                    <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      +91 123 456 7890
                    </a>
                    <p className="text-sm text-muted-foreground">
                      Quick responses during business hours
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
                      Agatsa Healthcare Pvt. Ltd.<br />
                      New Delhi, India
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-2xl p-8 border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-6">
                  Send us a message
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-foreground mb-1 block">
                        Name
                      </label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-foreground mb-1 block">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="text-sm font-medium text-foreground mb-1 block">
                        Phone (optional)
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="text-sm font-medium text-foreground mb-1 block">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium text-foreground mb-1 block">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Warranty Section */}
      <section id="warranty" className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
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
    </Layout>
  );
};

export default Support;
