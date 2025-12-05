"use client";

import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { useFriends } from "../hooks/useFriends";
import { UserMinus, Loader2, Users } from "lucide-react";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import Avatar from "../../../components/ui/Avatar";

export default function FriendList() {
  const { t } = useTranslation();
  const { friends, isLoading, removeFriend } = useFriends();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const handleRemove = async (friendId: string) => {
    try {
      setRemovingId(friendId);
      await removeFriend(friendId);
      setConfirmRemove(null);
    } catch (err) {
      console.error("Failed to remove friend:", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl bg-slate-900/60 ring-1 ring-white/5">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/60 p-12 text-center ring-1 ring-white/5">
        <div className="mb-4 rounded-full bg-slate-800/50 p-4">
          <Users className="h-8 w-8 text-slate-500" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-white">
          {t("social.noFriends")}
        </h3>
        <p className="text-sm text-slate-400">{t("social.noFriendsDesc")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {friends.map((friend) => (
          <div
            key={friend.uid}
            className="flex items-center justify-between rounded-xl bg-slate-900/60 p-4 ring-1 ring-white/5 transition-all hover:bg-slate-800/60"
          >
            <div className="flex items-center gap-4">
              <Avatar
                avatarId={friend.avatarId}
                name={friend.displayName}
                size="md"
              />
              <div>
                <h4 className="font-bold text-white">{friend.displayName}</h4>
                <p className="text-sm text-slate-400">
                  {t("social.friendCode")}: {friend.friendCode}
                </p>
              </div>
            </div>

            <button
              onClick={() => setConfirmRemove(friend.uid)}
              disabled={removingId === friend.uid}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-500 disabled:opacity-50"
              aria-label="Remove friend"
            >
              {removingId === friend.uid ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <UserMinus className="h-5 w-5" />
              )}
            </button>
          </div>
        ))}
      </div>

      {confirmRemove && (
        <ConfirmDialog
          isOpen={true}
          title={t("social.removeFriendConfirm")}
          message={t("social.removeFriendMessage")}
          onConfirm={() => handleRemove(confirmRemove)}
          onCancel={() => setConfirmRemove(null)}
          confirmText={t("social.remove")}
          cancelText={t("common.cancel")}
          isDangerous={true}
        />
      )}
    </>
  );
}
