"use client";

import { useSeasonEvents } from '../../hooks/useSeasonEvents';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SeasonalBanner() {
    const { currentEvent } = useSeasonEvents();

    if (!currentEvent) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${currentEvent.themeColor} p-4 shadow-lg`}
        >
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-white/20 blur-xl" />
            <div className="absolute left-0 bottom-0 -ml-4 -mb-4 h-20 w-20 rounded-full bg-black/10 blur-xl" />

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl backdrop-blur-sm">
                        {currentEvent.icon}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-white shadow-black/20 text-shadow-sm">
                                {currentEvent.name}
                            </h3>
                            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                                開催中
                            </span>
                        </div>
                        <p className="text-xs font-medium text-white/90">
                            {currentEvent.description}
                        </p>
                    </div>
                </div>

                <div className="hidden sm:block">
                    <button className="flex items-center gap-1 rounded-lg bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white/30">
                        <Sparkles className="h-3 w-3" />
                        詳細を見る
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
