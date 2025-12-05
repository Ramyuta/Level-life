"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "../features/i18n/useTranslation";
import { useUser } from "../features/user/context/UserContext";
import SectionHeader from "../components/ui/SectionHeader";
import FriendCodeCard from "../features/social/components/FriendCodeCard";
import AddFriendDialog from "../features/social/components/AddFriendDialog";
import FriendList from "../features/social/components/FriendList";
import Leaderboard from "../features/social/components/Leaderboard";
import ActivityFeed from "../features/social/components/ActivityFeed";
import { useSocialSimulation } from "../features/social/hooks/useSocialSimulation";
import { UserPlus, Users, Activity } from "lucide-react";

type Tab = "friends" | "activity";

export default function FriendsPage() {
  const { t } = useTranslation();
  const { user } = useUser() as any;
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("friends");

  const {
    npcFriends,
    activities,
    leaderboard,
    updateLeaderboard,
    addPlayerActivity,
  } = useSocialSimulation();

  // Update leaderboard when user stats change
  useEffect(() => {
    updateLeaderboard(
      user.stats.totalXp || 0,
      user.level,
      "あなた",
      user.settings.avatarId || "warrior"
    );
  }, [
    user.stats.totalXp,
    user.level,
    user.settings.avatarId,
    updateLeaderboard,
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 sm:px-6 lg:px-8 pb-20">
      <SectionHeader
        title={t("social.friends")}
        subtitle={t("social.friendsSubtitle")}
      />

      {/* Friend Code Card */}
      <FriendCodeCard />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10">
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
            activeTab === "friends"
              ? "border-b-2 border-indigo-500 text-white"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Users className="h-5 w-5" />
          {t("social.friendsAndLeaderboard")}
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
            activeTab === "activity"
              ? "border-b-2 border-indigo-500 text-white"
              : "text-slate-400 hover:text-slate-300"
          }`}
        >
          <Activity className="h-5 w-5" />
          {t("social.activityFeed")}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "friends" ? (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Friends List */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                {t("social.friends")}
              </h3>
              <button
                onClick={() => setShowAddDialog(true)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-indigo-500"
              >
                <UserPlus className="h-4 w-4" />
                {t("social.addFriend")}
              </button>
            </div>
            <FriendList />

            {/* NPC Friends */}
            {npcFriends.length > 0 && (
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-bold text-slate-400">
                  NPCフレンド
                </h4>
                <div className="space-y-3">
                  {npcFriends.map((friend) => (
                    <div
                      key={friend.uid}
                      className="flex items-center gap-4 rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-2xl">
                        {friend.avatarId === "warrior" && "⚔️"}
                        {friend.avatarId === "mage" && "🔮"}
                        {friend.avatarId === "villager" && "👨"}
                        {friend.avatarId === "rogue" && "🗡️"}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">
                          {friend.displayName}
                        </h4>
                        <p className="text-sm text-slate-400">
                          Lv {friend.level}
                        </p>
                      </div>
                      <div
                        className={`rounded-full px-2 py-1 text-xs font-bold ${
                          friend.status === "online"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-slate-700 text-slate-500"
                        }`}
                      >
                        {friend.status === "online"
                          ? "オンライン"
                          : "オフライン"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div>
            <Leaderboard entries={leaderboard} />
          </div>
        </div>
      ) : (
        <ActivityFeed activities={activities} />
      )}

      {/* Add Friend Dialog */}
      {showAddDialog && (
        <AddFriendDialog
          isOpen={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
}
