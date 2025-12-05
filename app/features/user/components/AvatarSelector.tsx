"use client";

import { AVATARS, type AvatarId } from "../../../lib/types";
import Avatar from "../../../components/ui/Avatar";
import { motion } from "framer-motion";

interface AvatarSelectorProps {
  selectedId?: string;
  onSelect: (id: AvatarId) => void;
}

export default function AvatarSelector({
  selectedId,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
      {(Object.keys(AVATARS) as AvatarId[]).map((id) => {
        const isSelected = selectedId === id;
        return (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(id)}
            className={`group relative flex flex-col items-center gap-2 rounded-2xl p-2 transition-all ${
              isSelected
                ? "bg-indigo-500/20 ring-2 ring-indigo-500"
                : "bg-slate-800/50 hover:bg-slate-800"
            }`}
          >
            <Avatar avatarId={id} size="lg" />
            {isSelected && (
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs text-white shadow-lg">
                ✓
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
