"use client";

/**
 * ハプティックフィードバックを提供するフック
 * Vibration API をサポートするデバイスで振動を発生させる
 */
export function useHaptic() {
  const vibrate = (pattern: number | number[] = 10) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        console.warn("Haptic feedback not supported:", error);
      }
    }
  };

  const light = () => vibrate(10);
  const medium = () => vibrate(20);
  const heavy = () => vibrate(30);
  const success = () => vibrate([10, 50, 10]);
  const error = () => vibrate([20, 100, 20, 100, 20]);
  const warning = () => vibrate([10, 50, 10, 50, 10]);

  return {
    vibrate,
    light,
    medium,
    heavy,
    success,
    error,
    warning,
  };
}
