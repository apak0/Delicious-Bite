import React from "react";
import { motion } from "framer-motion";
import { useScrollToTop } from "../../hooks/useScrollToTop";

// Animation variants for page transitions
const pageVariants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: 20,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3,
};

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  // Apply smooth scroll to top on route changes
  useScrollToTop();

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-full w-full"
    >
      {children}
    </motion.div>
  );
}
