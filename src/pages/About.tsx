import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Lightbulb, Heart, ArrowRight, Home, Award, ShieldCheck, Star, Newspaper, CheckCircle2 } from "lucide-react";
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
  { year: "2018", event: "Received ISO 13485 certification for medical devices" },
  { year: "2019", event: "CDSCO licensing completed for Indian market" },
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

const awards = [
  { title: "Best Health Tech Startup", year: "2023", org: "India Health Awards" },
  { title: "Innovation Excellence", year: "2022", org: "Medical Device Summit" },
  { title: "Make in India Champion", year: "2023", org: "Govt. of India" },
  { title: "Top 50 Healthcare Startups", year: "2023", org: "HealthTech India" },
  { title: "Digital Health Pioneer", year: "2022", org: "NASSCOM" },
  { title: "Best ECG Innovation", year: "2021", org: "CardioTech Awards" },
];

const certifications = [
  { name: "ISO 13485:2016", description: "Medical Device Quality", details: "Certified quality management system for medical devices" },
  { name: "BIS Approved", description: "Bureau of Indian Standards", details: "Meets Indian safety and quality standards" },
  { name: "CDSCO Licensed", description: "Central Drugs Standard Control", details: "Licensed for manufacture and sale in India" },
  { name: "ISO 9001:2015", description: "Quality Management", details: "International standard for quality management systems" },
];

const testimonials = [
  {
    quote: "SanketLife has transformed how I monitor my heart health. The reports are so detailed and easy to share with my doctor.",
    author: "Dr. Rajesh Kumar",
    role: "Cardiologist, Delhi",
    rating: 5,
  },
  {
    quote: "As a busy professional, the EasyTouch Rhythm helps me stay on top of my wellness goals without any hassle.",
    author: "Priya Sharma",
    role: "IT Manager, Bangalore",
    rating: 5,
  },
  {
    quote: "The Zlu Sleep Aid has genuinely improved my sleep quality. I wake up feeling refreshed now.",
    author: "Amit Patel",
    role: "Entrepreneur, Mumbai",
    rating: 5,
  },
  {
    quote: "We've integrated SanketLife into our clinic workflow. The accuracy matches our traditional ECG machines.",
    author: "Dr. Sunita Reddy",
    role: "General Physician, Hyderabad",
    rating: 5,
  },
  {
    quote: "CoreBalance BMI gives such detailed body composition data. Perfect for tracking my fitness journey.",
    author: "Vikram Singh",
    role: "Fitness Enthusiast, Jaipur",
    rating: 5,
  },
  {
    quote: "The customer support team is exceptional. They helped us set up our corporate wellness program seamlessly.",
    author: "Meera Krishnan",
    role: "HR Director, Chennai",
    rating: 5,
  },
];

const mediaLogos = [
  "The Economic Times",
  "YourStory",
  "Inc42",
  "TechCrunch",
  "The Hindu",
  "Mint",
  "Business Standard",
  "Forbes India",
];

const qualityCommitments = [
  "100% tested before shipping",
  "Medical-grade component sourcing",
  "Continuous clinical validation",
  "Regular software updates",
  "Dedicated quality control team",
  "Traceable manufacturing process",
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
            <Button asChild variant="ghost" size="sm" className="mb-6">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                <Home className="h-4 w-4" /> Back to Home
              </Link>
            </Button>
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

      {/* Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center gap-2 justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Certifications</h2>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our devices meet the highest international standards for medical device
              manufacturing and quality assurance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">
                  {cert.name}
                </h3>
                <p className="text-sm text-primary font-medium mb-2">
                  {cert.description}
                </p>
                <p className="text-sm text-muted-foreground">{cert.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Our Quality Commitment
              </h2>
              <p className="text-muted-foreground mb-8">
                Every Agatsa device goes through rigorous quality control
                processes to ensure you receive a product that meets the highest
                standards of accuracy and reliability.
              </p>
              <ul className="space-y-4">
                {qualityCommitments.map((commitment, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span className="text-foreground">{commitment}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <div className="text-center">
                <p className="text-6xl font-bold text-primary mb-2">99.8%</p>
                <p className="text-lg text-foreground font-medium mb-4">
                  Accuracy Rate
                </p>
                <p className="text-muted-foreground">
                  Our devices consistently deliver results that match
                  professional medical equipment in clinical validation studies.
                </p>
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

      {/* Awards */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center gap-2 justify-center mb-4">
              <Award className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">Awards & Recognition</h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{award.title}</h3>
                <p className="text-sm text-muted-foreground">{award.org}</p>
                <p className="text-xs text-primary mt-2 font-medium">{award.year}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center gap-2 justify-center mb-4">
              <Star className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">What People Say</h2>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Mentions */}
      <section className="py-16 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center gap-2 justify-center mb-4">
              <Newspaper className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">As Seen In</h2>
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {mediaLogos.map((logo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="text-muted-foreground font-semibold text-lg hover:text-foreground transition-colors"
              >
                {logo}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-muted/30">
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
      <section id="careers" className="py-16 bg-background">
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
