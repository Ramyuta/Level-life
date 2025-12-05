"use client";

import { useState } from "react";
import { useTranslation } from "../../i18n/useTranslation";
import { useFriends } from "../hooks/useFriends";
import { X, UserPlus, Loader2 } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFriendDialog({ isOpen, onClose }: Props) {
  const { t } = useTranslation();
  const { addFriend } = useFriends();
  const [friendCode, setFriendCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCode.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await addFriend(friendCode.trim());
      setSuccess(true);
      setFriendCode("");
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(t("errors.generic")); // TODO: Add specific error messages
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <h3 className="text-lg font-bold text-white">
            {t("social.addFriend")}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 rounded-full bg-emerald-500/20 p-4 text-emerald-500">
                <UserPlus className="h-8 w-8" />
              </div>
              <h4 className="text-xl font-bold text-white">
                {t("social.friendAdded")}
              </h4>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-400">
                  {t("social.friendCode")}
                </label>
                <input
                  type="text"
                  value={friendCode}
                  onChange={(e) => setFriendCode(e.target.value)}
                  placeholder="e.g. 1234-5678"
                  className="w-full rounded-xl bg-slate-950 px-4 py-3 text-white placeholder-slate-600 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !friendCode.trim()}
                  className="flex items-center gap-2 rounded-xl bg-indigo-500 px-6 py-2 font-bold text-white transition-all hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t("social.add")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
