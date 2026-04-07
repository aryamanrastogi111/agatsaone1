import { motion } from "framer-motion";
import { Apple, Play } from "lucide-react";

const iosUrl = import.meta.env.VITE_IOS_APP_STORE_URL || "https://apps.apple.com/in/app/agatsa-one/id6760245564";
const androidUrl = import.meta.env.VITE_ANDROID_PLAY_URL || "https://play.google.com/store/apps/details?id=com.agatsakone";

export function FinalCTASection() {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-r from-primary to-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Your health isn't a quarterly checkup.
            <br className="hidden md:block" /> It's a daily conversation.
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Start monitoring with Agatsa One today. Free download. Free basic monitoring.
            AI insights from ₹599/month. Your Nera AI health companion is ready.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a
              href={iosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-primary rounded-full px-8 py-4 font-semibold hover:opacity-90 transition-opacity"
            >
              <Apple className="h-5 w-5" />
              Download for iOS
            </a>
            <a
              href={androidUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border-2 border-white text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 transition-colors"
            >
              <Play className="h-5 w-5 fill-current" />
              Download for Android
            </a>
          </div>

          <p className="text-sm text-white/60 pt-2">
            No credit card required · Free plan available · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
