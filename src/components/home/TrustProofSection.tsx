import { motion } from "framer-motion";
import { Award, ShieldCheck, Star, Newspaper } from "lucide-react";

const awards = [
  { title: "Best Health Tech Startup", year: "2023", org: "India Health Awards" },
  { title: "Innovation Excellence", year: "2022", org: "Medical Device Summit" },
  { title: "Make in India Champion", year: "2023", org: "Govt. of India" },
];

const certifications = [
  { name: "ISO 13485", description: "Medical Device Quality" },
  { name: "BIS Approved", description: "Bureau of Indian Standards" },
  { name: "CDSCO Licensed", description: "Central Drugs Standard Control" },
  { name: "ISO 9001:2015", description: "Quality Management" },
];

const testimonials = [
  {
    quote: "SanketLife has transformed how I monitor my heart health. The reports are so detailed and easy to share with my doctor.",
    author: "Dr. Rajesh Kumar",
    role: "Cardiologist, Delhi",
  },
  {
    quote: "As a busy professional, the EasyTouch Rhythm helps me stay on top of my wellness goals without any hassle.",
    author: "Priya Sharma",
    role: "IT Manager, Bangalore",
  },
  {
    quote: "The Zlu Sleep Aid has genuinely improved my sleep quality. I wake up feeling refreshed now.",
    author: "Amit Patel",
    role: "Entrepreneur, Mumbai",
  },
];

const mediaLogos = [
  "The Economic Times",
  "YourStory",
  "Inc42",
  "TechCrunch",
  "The Hindu",
];

export function TrustProofSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our commitment to quality and innovation has earned us recognition
            from industry leaders and healthcare professionals.
          </p>
        </motion.div>

        {/* Awards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 justify-center mb-8">
            <Award className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Awards & Recognition</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {awards.map((award, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">{award.title}</h4>
                <p className="text-sm text-muted-foreground">{award.org}</p>
                <p className="text-xs text-primary mt-2">{award.year}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 justify-center mb-8">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Certifications</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-muted/50 rounded-xl p-4 text-center"
              >
                <p className="font-semibold text-foreground">{cert.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{cert.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 justify-center mb-8">
            <Star className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">What People Say</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Media Mentions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 justify-center mb-8">
            <Newspaper className="h-6 w-6 text-primary" />
            <h3 className="text-xl font-semibold text-foreground">As Seen In</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            {mediaLogos.map((logo, index) => (
              <div
                key={index}
                className="text-muted-foreground font-semibold text-lg hover:text-foreground transition-colors"
              >
                {logo}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
