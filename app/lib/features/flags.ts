"use client";

import { useState, useEffect } from "react";

// Define available feature flags
export type FeatureFlag =
  | "new_dashboard"
  | "premium_features"
  | "advanced_analytics"
  | "social_features";

// Default values for flags
const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  new_dashboard: true,
  premium_features: true,
  advanced_analytics: true,
  social_features: true,
};

export function useFeatureFlag(flag: FeatureFlag): boolean {
  // In a real app, this would fetch from a remote config service (e.g. Firebase Remote Config, LaunchDarkly)
  // For now, we use local defaults or local storage overrides
  const [isEnabled, setIsEnabled] = useState(DEFAULT_FLAGS[flag]);

  useEffect(() => {
    // Allow overriding via localStorage for testing
    // e.g. window.localStorage.setItem('flag_new_dashboard', 'false')
    const localOverride = window.localStorage.getItem(`flag_${flag}`);
    if (localOverride !== null) {
      setIsEnabled(localOverride === "true");
    }
  }, [flag]);

  return isEnabled;
}
