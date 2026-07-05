"use client";

import { motion } from "framer-motion";

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Empieza invisible y un poco abajo
      animate={{ opacity: 1, y: 0 }} // Sube y se hace visible
      transition={{ duration: 0.5, ease: "easeOut" }} // Duración de medio segundo
      style={{ width: "100%", height: "100%" }}
    >
      {children}
    </motion.div>
  );
};
