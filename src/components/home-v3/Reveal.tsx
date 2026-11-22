import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Thin animated ECG trace used as a quiet signature line. */
export function EcgLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 60" preserveAspectRatio="none" className={className} aria-hidden="true">
      <motion.path
        d="M0 30 H170 L185 30 L195 12 L205 48 L215 4 L228 56 L240 30 H330 L345 30 L355 20 L365 38 L375 30 H600"
        fill="none"
        stroke="hsl(var(--primary-glow))"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.6 }}
      />
    </svg>
  );
}
