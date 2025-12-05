"use client";

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const themes = [
        { value: 'light', label: 'ライト', icon: Sun },
        { value: 'dark', label: 'ダーク', icon: Moon },
        { value: 'system', label: 'システム', icon: Monitor },
    ];

    return (
        <div className="grid grid-cols-3 gap-3">
            {themes.map(({ value, label, icon: Icon }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${theme === value
                            ? 'bg-indigo-500/20 ring-2 ring-indigo-500'
                            : 'bg-slate-800/50 hover:bg-slate-700/50 ring-1 ring-white/10'
                        }`}
                >
                    <Icon className={`h-6 w-6 ${theme === value ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${theme === value ? 'text-white' : 'text-slate-400'}`}>
                        {label}
                    </span>
                </button>
            ))}
        </div>
    );
}
