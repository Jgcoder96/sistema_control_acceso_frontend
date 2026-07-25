"use client";
import { motion } from "framer-motion";

/**
 * Envoltorio animado para las transiciones entre páginas del dashboard.
 * Provee un efecto de desvanecimiento (fade in) y deslizamiento hacia arriba fluido.
 */
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
