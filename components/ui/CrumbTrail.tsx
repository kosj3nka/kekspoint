"use client";

import { motion, type Variants } from "motion/react";

// Rough clip-path windows onto /assets/crumbs.png, ordered top-left to
// bottom-right to match the image's own whole-cookie-to-scattered-crumb layout.
const CELLS = [
  "inset(0% 62% 74% 0%)",
  "inset(16% 38% 60% 28%)",
  "inset(38% 65% 36% 2%)",
  "inset(46% 30% 28% 38%)",
  "inset(58% 42% 14% 22%)",
  "inset(66% 8% 0% 52%)",
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const cellVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0 },
  },
};

export default function CrumbTrail({ className }: { className?: string }) {
  return (
    <motion.div
      aria-hidden="true"
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {CELLS.map((clipPath, i) => (
        <motion.div
          key={i}
          variants={cellVariants}
          className="absolute inset-0 bg-[url('/assets/crumbs.png')] bg-cover bg-center"
          style={{ clipPath }}
        />
      ))}
    </motion.div>
  );
}
