/**
 * Design System Constants
 * Centralized design tokens for Level-Life
 */

// Typography Scale
export const typography = {
  // Page titles
  h1: "text-3xl md:text-4xl font-bold",
  // Section titles
  h2: "text-2xl md:text-3xl font-bold",
  // Subsection titles
  h3: "text-xl md:text-2xl font-semibold",
  // Card titles
  h4: "text-lg md:text-xl font-semibold",
  // Body text
  body: "text-base",
  // Small text
  small: "text-sm",
  // Extra small text
  xs: "text-xs",
} as const;

// Spacing Scale (consistent with Tailwind)
export const spacing = {
  // Component padding
  cardPadding: "p-6",
  cardPaddingMobile: "p-4",
  // Section gaps
  sectionGap: "space-y-6",
  sectionGapMobile: "space-y-4",
  // Grid gaps
  gridGap: "gap-6",
  gridGapMobile: "gap-4",
  // Button padding
  buttonPadding: "px-6 py-3",
  buttonPaddingSmall: "px-4 py-2",
} as const;

// Color Palette
export const colors = {
  // Primary colors (indigo/purple theme)
  primary: {
    DEFAULT: "#6366f1", // indigo-500
    light: "#818cf8", // indigo-400
    dark: "#4f46e5", // indigo-600
    glow: "rgba(99, 102, 241, 0.3)",
  },
  // Accent colors (emerald for success/XP)
  accent: {
    DEFAULT: "#10b981", // emerald-500
    light: "#34d399", // emerald-400
    dark: "#059669", // emerald-600
    glow: "rgba(16, 185, 129, 0.3)",
  },
  // Warning/streak colors (amber)
  warning: {
    DEFAULT: "#f59e0b", // amber-500
    light: "#fbbf24", // amber-400
    dark: "#d97706", // amber-600
  },
  // Danger colors (rose)
  danger: {
    DEFAULT: "#ef4444", // rose-500
    light: "#f87171", // rose-400
    dark: "#dc2626", // rose-600
  },
  // Background colors
  background: {
    primary: "#0f172a", // slate-900
    secondary: "#1e293b", // slate-800
    tertiary: "#334155", // slate-700
    card: "rgba(30, 41, 59, 0.6)", // slate-800 with opacity
  },
  // Text colors
  text: {
    primary: "#f1f5f9", // slate-100
    secondary: "#cbd5e1", // slate-300
    muted: "#94a3b8", // slate-400
    disabled: "#64748b", // slate-500
  },
} as const;

// Border Radius
export const borderRadius = {
  small: "rounded-lg",
  medium: "rounded-xl",
  large: "rounded-2xl",
  full: "rounded-full",
} as const;

// Shadows
export const shadows = {
  small: "shadow-sm",
  medium: "shadow-md",
  large: "shadow-lg",
  xl: "shadow-xl",
  glow: "shadow-2xl",
} as const;

// Transitions
export const transitions = {
  fast: "transition-all duration-150",
  normal: "transition-all duration-300",
  slow: "transition-all duration-500",
} as const;

// Animation Timings (for framer-motion)
export const animations = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  },
  // Slide up
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  },
  // Scale
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.2 },
  },
  // Spring
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  },
} as const;

// Z-Index Scale
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  modal: 30,
  popover: 40,
  tooltip: 50,
} as const;

// Breakpoints (matches Tailwind defaults)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;
