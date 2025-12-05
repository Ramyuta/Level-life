"use client";

import { useUser } from "../features/user/context/UserContext";

export const FREE_TIER_LIMITS = {
  maxCategories: 3,
  maxQuestsPerDay: 10, // Optional limit
};

export function usePremium() {
  const { user, updateUser } = useUser();

  const isPremium =
    user.subscription?.tier === "premium" &&
    user.subscription?.status === "active";

  const canAddCategory = (currentCategoryCount: number) => {
    if (isPremium) return true;
    return currentCategoryCount < FREE_TIER_LIMITS.maxCategories;
  };

  const canViewAdvancedAnalytics = () => {
    return isPremium;
  };

  const canUsePremiumTheme = () => {
    return isPremium;
  };

  const upgradeToPremium = async () => {
    // Mock payment flow
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        updateUser({
          subscription: {
            tier: "premium",
            status: "active",
            validUntil: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // 30 days
          },
        });
        resolve();
      }, 1500);
    });
  };

  return {
    isPremium,
    canAddCategory,
    canViewAdvancedAnalytics,
    canUsePremiumTheme,
    upgradeToPremium,
    limits: FREE_TIER_LIMITS,
  };
}
