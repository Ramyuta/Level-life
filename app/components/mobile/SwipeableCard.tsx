"use client";

import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { ReactNode, useState } from "react";
import { Check, Trash2, Edit } from "lucide-react";

interface SwipeAction {
  icon: ReactNode;
  color: string;
  onAction: () => void;
  label: string;
}

interface Props {
  children: ReactNode;
  leftAction?: SwipeAction;
  rightAction?: SwipeAction;
  threshold?: number;
}

export default function SwipeableCard({
  children,
  leftAction,
  rightAction,
  threshold = 80,
}: Props) {
  const x = useMotionValue(0);
  const [swiped, setSwiped] = useState(false);

  const leftBg = useTransform(
    x,
    [0, threshold],
    ["transparent", leftAction?.color || "transparent"]
  );
  const rightBg = useTransform(
    x,
    [-threshold, 0],
    [rightAction?.color || "transparent", "transparent"]
  );

  const handleDragEnd = (event: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > threshold || velocity > 500) {
      // Swipe right
      if (leftAction) {
        setSwiped(true);
        leftAction.onAction();
        setTimeout(() => {
          x.set(0);
          setSwiped(false);
        }, 300);
      } else {
        x.set(0);
      }
    } else if (offset < -threshold || velocity < -500) {
      // Swipe left
      if (rightAction) {
        setSwiped(true);
        rightAction.onAction();
        setTimeout(() => {
          x.set(0);
          setSwiped(false);
        }, 300);
      } else {
        x.set(0);
      }
    } else {
      x.set(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background actions */}
      {leftAction && (
        <motion.div
          style={{ backgroundColor: leftBg }}
          className="absolute inset-y-0 left-0 flex items-center justify-start px-6"
        >
          <div className="flex items-center gap-2 text-white">
            {leftAction.icon}
            <span className="text-sm font-medium">{leftAction.label}</span>
          </div>
        </motion.div>
      )}

      {rightAction && (
        <motion.div
          style={{ backgroundColor: rightBg }}
          className="absolute inset-y-0 right-0 flex items-center justify-end px-6"
        >
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm font-medium">{rightAction.label}</span>
            {rightAction.icon}
          </div>
        </motion.div>
      )}

      {/* Swipeable content */}
      <motion.div
        drag="x"
        dragConstraints={{
          left: rightAction ? -150 : 0,
          right: leftAction ? 150 : 0,
        }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="relative z-10 bg-background"
      >
        {children}
      </motion.div>
    </div>
  );
}

// Pre-defined action configurations
export const SwipeActions = {
  complete: (onComplete: () => void): SwipeAction => ({
    icon: <Check className="h-5 w-5" />,
    color: "#10b981",
    onAction: onComplete,
    label: "Complete",
  }),
  delete: (onDelete: () => void): SwipeAction => ({
    icon: <Trash2 className="h-5 w-5" />,
    color: "#ef4444",
    onAction: onDelete,
    label: "Delete",
  }),
  edit: (onEdit: () => void): SwipeAction => ({
    icon: <Edit className="h-5 w-5" />,
    color: "#6366f1",
    onAction: onEdit,
    label: "Edit",
  }),
};
