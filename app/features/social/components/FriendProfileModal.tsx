"use client";

import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../../../components/ui/Avatar';
import type { Friend } from '../../../lib/types';
import type { CustomAvatar } from '../../../lib/customAvatarTypes';

interface FriendProfileModalProps {
    friend: Friend | null;
    onClose: () => void;
}

export default function FriendProfileModal({ friend, onClose }: FriendProfileModalProps) {
    if (!friend) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl ring-1 ring-white/10"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 p-6">
                        <h2 className="text-2xl font-bold text-white">プロフィール</h2>
                        <button
                            onClick={onClose}
                            className="rounded-xl bg-slate-700 p-2 text-white transition-all hover:bg-slate-600"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Avatar and Basic Info */}
                        <div className="flex items-center gap-6">
                            <Avatar
                                customAvatar={(friend as any).customAvatar}
                                avatarId={friend.avatarId}
                                name={friend.displayName}
                                size="2xl"
                            />
                            <div className="flex-1">
                                <h3 className="text-3xl font-bold text-white">{friend.displayName}</h3>
                                <p className="text-slate-400">フレンドコード: {friend.friendCode}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${friend.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-slate-500/20 text-slate-400'
                                        }`}>
                                        <span className={`h-2 w-2 rounded-full ${friend.status === 'online' ? 'bg-green-400' : 'bg-slate-400'}`} />
                                        {friend.status === 'online' ? 'オンライン' : 'オフライン'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Level */}
                            <div className="rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-4 ring-1 ring-white/10">
                                <p className="text-sm text-slate-400">レベル</p>
                                <p className="text-3xl font-bold text-white">{friend.level}</p>
                            </div>

                            {/* Weekly XP */}
                            <div className="rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 p-4 ring-1 ring-white/10">
                                <p className="text-sm text-slate-400">週間XP</p>
                                <p className="text-3xl font-bold text-emerald-400">{(friend as any).weeklyXp || 0}</p>
                            </div>
                        </div>

                        {/* Last Active */}
                        <div className="rounded-2xl bg-slate-800/50 p-4">
                            <p className="text-sm text-slate-400">最終アクティブ</p>
                            <p className="text-white">{new Date(friend.lastActive).toLocaleString('ja-JP')}</p>
                        </div>

                        {/* Friend Code */}
                        <div className="rounded-2xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-4 ring-1 ring-indigo-500/30">
                            <p className="text-sm text-slate-400 mb-2">フレンドコード</p>
                            <div className="flex items-center justify-between">
                                <code className="text-2xl font-mono font-bold text-indigo-400">{friend.friendCode}</code>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(friend.friendCode);
                                    }}
                                    className="rounded-lg bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-400 transition-all hover:bg-indigo-500/30"
                                >
                                    コピー
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-white/10 p-6">
                        <button
                            onClick={onClose}
                            className="w-full rounded-xl bg-slate-700 px-6 py-3 font-semibold text-white transition-all hover:bg-slate-600"
                        >
                            閉じる
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
