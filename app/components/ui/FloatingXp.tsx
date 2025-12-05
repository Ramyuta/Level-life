"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface FloatingXpProps {
  xp: number;
  onComplete?: () => void;
}

export default function FloatingXp({ xp, onComplete }: FloatingXpProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.5 }}
        animate={{ opacity: 1, y: -50, scale: 1.2 }}
        exit={{ opacity: 0, y: -100, scale: 1.5 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <span
            className="text-6xl font-black text-amber-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]"
            style={{ textShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
          >
            +{xp}
          </span>
          <span className="text-2xl font-bold text-amber-200">XP GAINED!</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
