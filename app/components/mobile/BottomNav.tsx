"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart2,
  Users,
  Trophy,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../features/i18n/useTranslation";

const NAV_ITEMS = [
  {
    href: "/dashboard",
    labelKey: "nav.dashboard" as const,
    icon: LayoutDashboard,
  },
  { href: "/quests", labelKey: "nav.quests" as const, icon: CheckSquare },
  { href: "/analytics", labelKey: "nav.analytics" as const, icon: BarChart2 },
  { href: "/friends", labelKey: "nav.friends" as const, icon: Users },
  {
    href: "/achievements",
    labelKey: "nav.achievements" as const,
    icon: Trophy,
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-all min-w-[60px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:bg-muted"
              )}
            >
              <Icon
                size={20}
                className={cn("transition-transform", isActive && "scale-110")}
              />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  isActive && "font-bold"
                )}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
