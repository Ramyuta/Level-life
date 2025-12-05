"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import PricingCard from "./PricingCard";
import { usePremium } from "../../../hooks/usePremium";
import { useTranslation } from "../../i18n/useTranslation";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PremiumModal({ isOpen, onClose }: PremiumModalProps) {
  const { upgradeToPremium, isPremium } = usePremium();
  const { t } = useTranslation(); // Assuming we'll add translations later
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await upgradeToPremium();
      onClose();
    } catch (error) {
      console.error("Upgrade failed:", error);
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          open={isOpen}
          onClose={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
        >
          <Dialog.Panel
            as={motion.div}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-white/10"
          >
            {/* Background Effects */}
            <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative z-0 p-8 md:p-12">
              <div className="mb-12 text-center">
                <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 px-4 py-1.5 ring-1 ring-indigo-500/30">
                  <Sparkles className="mr-2 h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-bold text-indigo-300">
                    Level Up Your Life
                  </span>
                </div>
                <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl">
                  Unlock Premium Features
                </h2>
                <p className="mx-auto max-w-xl text-lg text-slate-400">
                  Get unlimited access to all features and take your
                  productivity to the next level.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:gap-12">
                <PricingCard
                  tier="free"
                  price="Free"
                  features={[
                    "3 Categories Limit",
                    "Basic Analytics",
                    "Standard Themes",
                    "Daily Quests",
                  ]}
                  isCurrent={!isPremium}
                />
                <PricingCard
                  tier="premium"
                  price="$4.99"
                  features={[
                    "Unlimited Categories",
                    "Advanced Analytics & Heatmaps",
                    "Premium Themes",
                    "Priority Support",
                    "Early Access to New Features",
                  ]}
                  recommended
                  isCurrent={isPremium}
                  onSelect={handleUpgrade}
                />
              </div>
            </div>

            {/* Loading Overlay */}
            {isUpgrading && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm">
                <Loader2 className="mb-4 h-12 w-12 animate-spin text-indigo-500" />
                <p className="text-lg font-bold text-white">Upgrading...</p>
              </div>
            )}
          </Dialog.Panel>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
