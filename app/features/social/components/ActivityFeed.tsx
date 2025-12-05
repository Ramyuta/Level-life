"use client";

import { motion } from "framer-motion";
import { Heart, Trophy, Zap, Gift, Award, Flame } from "lucide-react";
import Avatar from "../../../components/ui/Avatar";
import type { FriendActivity } from "../../../lib/types";

interface ActivityFeedProps {
  activities: FriendActivity[];
}

const ACTIVITY_ICONS = {
  levelup: Trophy,
  quest_complete: Zap,
  boss_defeat: Award,
  item_get: Gift,
  achievement: Award,
  streak_milestone: Flame,
};

const ACTIVITY_COLORS = {
  levelup: "text-yellow-400",
  quest_complete: "text-blue-400",
  boss_defeat: "text-red-400",
  item_get: "text-purple-400",
  achievement: "text-green-400",
  streak_milestone: "text-orange-400",
};

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/50 p-12 text-center ring-1 ring-white/5">
        <p className="text-lg text-slate-400">まだアクティビティがありません</p>
        <p className="mt-2 text-sm text-slate-500">
          フレンドの活動がここに表示されます
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = ACTIVITY_ICONS[activity.type];
        const colorClass = ACTIVITY_COLORS[activity.type];
        const timeAgo = getTimeAgo(activity.timestamp);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-4 rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/5 transition-all hover:bg-slate-800/60"
          >
            {/* Avatar */}
            <Avatar
              avatarId={activity.userAvatarId}
              name={activity.userDisplayName}
              size="md"
            />

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">
                  {activity.userDisplayName}
                </span>
                <Icon className={`h-4 w-4 ${colorClass}`} />
              </div>
              <p className="mt-1 text-sm text-slate-300">{activity.detail}</p>
              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                <span>{timeAgo}</span>
                <button className="flex items-center gap-1 transition-colors hover:text-rose-400">
                  <Heart className="h-3 w-3" />
                  {activity.likes > 0 && <span>{activity.likes}</span>}
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  if (hours < 24) return `${hours}時間前`;
  return `${days}日前`;
}
