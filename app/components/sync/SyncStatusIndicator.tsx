"use client";

import { useSyncManager, type SyncStatus } from '../../hooks/useSyncManager';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SyncStatusIndicator() {
    const { syncStatus, lastSyncTime, isOnline, triggerSync } = useSyncManager();

    const getStatusConfig = (status: SyncStatus) => {
        switch (status) {
            case 'syncing':
                return {
                    icon: RefreshCw,
                    text: '同期中...',
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/20',
                    ringColor: 'ring-blue-500/30',
                    animate: true,
                };
            case 'synced':
                return {
                    icon: CheckCircle,
                    text: '同期完了',
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/20',
                    ringColor: 'ring-green-500/30',
                    animate: false,
                };
            case 'error':
                return {
                    icon: AlertCircle,
                    text: '同期エラー',
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/20',
                    ringColor: 'ring-red-500/30',
                    animate: false,
                };
            case 'offline':
                return {
                    icon: CloudOff,
                    text: 'オフライン',
                    color: 'text-amber-400',
                    bgColor: 'bg-amber-500/20',
                    ringColor: 'ring-amber-500/30',
                    animate: false,
                };
            default:
                return {
                    icon: Cloud,
                    text: 'クラウド',
                    color: 'text-slate-400',
                    bgColor: 'bg-slate-500/20',
                    ringColor: 'ring-slate-500/30',
                    animate: false,
                };
        }
    };

    const config = getStatusConfig(syncStatus);
    const Icon = config.icon;

    const formatLastSync = () => {
        if (!lastSyncTime) return null;
        const now = new Date();
        const diff = now.getTime() - lastSyncTime.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return '今';
        if (minutes < 60) return `${minutes}分前`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}時間前`;
        return `${Math.floor(hours / 24)}日前`;
    };

    return (
        <div className="fixed bottom-24 md:bottom-6 right-6 z-40">
            <AnimatePresence>
                {(syncStatus !== 'idle' || !isOnline) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`flex items-center gap-3 rounded-2xl ${config.bgColor} px-4 py-3 ring-1 ${config.ringColor} backdrop-blur-sm shadow-lg`}
                    >
                        {/* Online/Offline indicator */}
                        <div className="flex items-center gap-2">
                            {isOnline ? (
                                <Wifi className="h-4 w-4 text-green-400" />
                            ) : (
                                <WifiOff className="h-4 w-4 text-amber-400" />
                            )}
                        </div>

                        {/* Sync status icon */}
                        <motion.div
                            animate={config.animate ? { rotate: 360 } : {}}
                            transition={config.animate ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
                        >
                            <Icon className={`h-5 w-5 ${config.color}`} />
                        </motion.div>

                        {/* Status text */}
                        <div className="flex flex-col">
                            <span className={`text-sm font-semibold ${config.color}`}>
                                {config.text}
                            </span>
                            {lastSyncTime && syncStatus === 'synced' && (
                                <span className="text-xs text-slate-400">
                                    最終同期: {formatLastSync()}
                                </span>
                            )}
                        </div>

                        {/* Retry button for errors */}
                        {syncStatus === 'error' && (
                            <button
                                onClick={triggerSync}
                                className="ml-2 rounded-lg bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-400 transition-all hover:bg-red-500/30"
                            >
                                再試行
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
