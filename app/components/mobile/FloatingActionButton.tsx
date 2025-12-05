"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onClick: () => void;
  icon?: React.ReactNode;
  label?: string;
}

export default function FloatingActionButton({ onClick, icon, label }: Props) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-20 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg md:hidden"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      aria-label={label || "Quick action"}
    >
      {icon || <Plus className="h-6 w-6" />}
    </motion.button>
  );
}
