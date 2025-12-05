"use client";

import Image from "next/image";
import { AVATARS, type AvatarId } from "../../lib/types";

interface AvatarProps {
  avatarId?: string;
  photoURL?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-20 w-20",
  xl: "h-32 w-32",
  "2xl": "h-40 w-40",
};

export default function Avatar({
  avatarId,
  photoURL,
  name,
  size = "md",
  className = "",
}: AvatarProps) {
  const sizeClass = SIZES[size];

  // 1. Priority: Selected Avatar
  if (avatarId && avatarId in AVATARS) {
    return (
      <div
        className={`relative overflow-hidden rounded-full bg-slate-700 ring-2 ring-white/10 ${sizeClass} ${className}`}
      >
        <Image
          src={AVATARS[avatarId as AvatarId]}
          alt={name || "Avatar"}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  // 2. Fallback: Google Photo URL
  if (photoURL) {
    return (
      <div
        className={`relative overflow-hidden rounded-full bg-slate-700 ring-2 ring-white/10 ${sizeClass} ${className}`}
      >
        <Image
          src={photoURL}
          alt={name || "Avatar"}
          fill
          className="object-cover"
        />
      </div>
    );
  }

  // 3. Fallback: Initials
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-indigo-600 font-bold text-white ring-2 ring-white/10 ${sizeClass} ${className}`}
    >
      {initials}
    </div>
  );
}
