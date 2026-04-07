import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ramesh Iyer",
    location: "Chennai, Tamil Nadu",
    meta: "Nera AI Yearly",
    quote:
      "I had a silent heart attack scare last year. My cardiologist recommended SanketLife ECG and Agatsa One to monitor me at home. Nera AI caught an irregular pattern three weeks before my next scheduled appointment. I went in early, and my doctor said it was a critical catch. I genuinely believe this app saved my life.",
  },
  {
    name: "Dr. Priya Venkataraman",
    location: "Hyderabad, Telangana",
    meta: "Diabetologist",
    quote:
      "I recommend Agatsa One to all my diabetic patients with cardiac risk. The combined metabolic and ECG monitoring gives me a picture I simply can't get from quarterly HbA1c tests. My patients are more engaged with their health, and I can actually intervene early instead of reacting to crises.",
  },
  {
    name: "Sunita Mehta",
    location: "Mumbai, Maharashtra",
    meta: "Nera AI Monthly",
    quote:
      "I bought the Rhythm band and the scale together. I started the Hypertension Control programme after my doctor found my BP elevated. In 10 weeks, my systolic came down from 158 to 132. Nera's daily reminders, the DASH diet guidance, and just seeing the trend line going down every day — it kept me going. Best ₹599 I've ever spent.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
            What Users Say
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            50,000 users. Real stories. Real results.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-3xl border border-border p-6 flex flex-col"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.location} · {t.meta}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
