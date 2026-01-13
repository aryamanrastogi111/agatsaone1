import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Lightbulb, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout";

const values = [
  {
    icon: Heart,
    title: "Health First",
    description: "Everything we do is driven by our commitment to improving people's health outcomes.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously push the boundaries of what's possible in home health monitoring.",
  },
  {
    icon: Users,
    title: "Accessibility",
    description: "We believe everyone deserves access to quality health monitoring tools.",
  },
  {
    icon: Target,
    title: "Accuracy",
    description: "Medical-grade precision is non-negotiable in everything we create.",
  },
];

const milestones = [
  { year: "2016", event: "Agatsa founded with a vision to democratize health monitoring" },
  { year: "2017", event: "Launched SanketLife, India's first pocket ECG device" },
  { year: "2018", event: "Received CE certification for European markets" },
  { year: "2019", event: "FDA registration completed for US market" },
  { year: "2020", event: "Crossed 100,000+ users across India" },
  { year: "2021", event: "Launched EasyTouch Rhythm wellness band" },
  { year: "2022", event: "Introduced Zlu Sleep Aid and CoreBalance BMI" },
  { year: "2023", event: "Expanded to enterprise and clinical solutions" },
  { year: "2024", event: "Serving 500,000+ users worldwide" },
];

const team = [
  { name: "Rahul Rastogi", role: "Founder & CEO", bio: "IIT Delhi graduate with 15+ years in medical devices" },
  { name: "Dr. Priya Mehta", role: "Chief Medical Officer", bio: "Cardiologist with expertise in preventive healthcare" },
  { name: "Vikram Sharma", role: "CTO", bio: "Former Google engineer specializing in health tech" },
  { name: "Anita Krishnamurthy", role: "Head of Product", bio: "Product leader with experience at Philips Healthcare" },
];

const About = () => {
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
              About Agatsa
            </h1>
            <p className="text-lg text-muted-foreground">
              We're on a mission to make health monitoring simple, accessible, and
              actionable for everyone — from your home to the clinic.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                To empower individuals with the tools and insights they need to
                understand and improve their health, without the barriers of
                traditional medical infrastructure.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe that everyone deserves access to medical-grade health
                monitoring. By bringing clinical-quality devices into homes, we're
                enabling early detection, better management of chronic conditions,
                and ultimately — healthier lives.
              </p>
              <Button asChild>
                <Link to="/products" className="flex items-center gap-2">
                  Explore our products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-primary/10 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">500K+</p>
                <p className="text-sm text-foreground">Users Worldwide</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">4</p>
                <p className="text-sm text-foreground">Product Lines</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">50+</p>
                <p className="text-sm text-foreground">Countries Served</p>
              </div>
              <div className="bg-primary/10 rounded-2xl p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">8</p>
                <p className="text-sm text-foreground">Years of Innovation</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do at Agatsa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From a small startup to a leading health tech company.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 mb-6"
              >
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-primary font-bold">{milestone.year}</span>
                </div>
                <div className="w-px bg-primary/30 relative">
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary" />
                </div>
                <div className="flex-1 pb-6">
                  <p className="text-foreground">{milestone.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="careers" className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Leadership Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the people driving innovation at Agatsa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.bio}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground mb-4">
              Interested in joining our team?
            </p>
            <Button asChild variant="outline">
              <a href="mailto:careers@agatsa.com">View open positions</a>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
