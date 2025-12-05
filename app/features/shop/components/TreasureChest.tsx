"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { Equipment } from "../../../lib/types";

interface TreasureChestProps {
  equipment: Equipment;
  onComplete: () => void;
}

const RARITY_COLORS: Record<Equipment["rarity"], string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-blue-600",
  epic: "from-purple-400 to-purple-600",
  legendary: "from-yellow-400 to-yellow-600",
};

export default function TreasureChest({
  equipment,
  onComplete,
}: TreasureChestProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Open chest after 1 second
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    // Complete animation after 4 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div className="flex flex-col items-center">
          {/* Chest Animation */}
          {!isOpen ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="text-9xl"
            >
              📦
            </motion.div>
          ) : (
            <>
              {/* Open Chest */}
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.2, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-9xl"
              >
                🎁
              </motion.div>

              {/* Item Reveal */}
              <motion.div
                initial={{ scale: 0, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="mt-8 flex flex-col items-center"
              >
                {/* Item Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="mb-4 text-8xl"
                >
                  {equipment.icon}
                </motion.div>

                {/* Item Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center"
                >
                  <div
                    className={`mb-2 bg-gradient-to-r ${
                      RARITY_COLORS[equipment.rarity]
                    } bg-clip-text text-2xl font-bold text-transparent`}
                  >
                    {equipment.rarity.toUpperCase()}
                  </div>
                  <h2 className="mb-2 text-4xl font-black text-white drop-shadow-lg">
                    {equipment.name}
                  </h2>
                  <p className="text-lg text-slate-300">
                    {equipment.description}
                  </p>
                </motion.div>

                {/* Sparkles */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-4xl"
                      initial={{
                        x: 0,
                        y: 0,
                        opacity: 1,
                        scale: 0,
                      }}
                      animate={{
                        x: Math.cos((i * Math.PI * 2) / 20) * 200,
                        y: Math.sin((i * Math.PI * 2) / 20) * 200,
                        opacity: 0,
                        scale: 1,
                      }}
                      transition={{
                        duration: 2,
                        delay: 0.3 + i * 0.05,
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </>
          )}

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isOpen ? 0.8 : 0.5 }}
            className="mt-8 text-center"
          >
            <p className="text-2xl font-bold text-yellow-400">
              {isOpen ? "🎉 レアアイテム獲得！" : "宝箱を発見！"}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
