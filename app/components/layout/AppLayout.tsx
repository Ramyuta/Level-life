"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  Trophy,
  Settings,
  Menu,
  X,
  BarChart2,
  Users,
  BookOpen,
  Swords,
  ShoppingBag,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "../../features/i18n/useTranslation";
import { useAuth } from "../../features/auth/context/AuthContext";
import { InstallPrompt } from "../pwa/InstallPrompt";
import { OfflineIndicator } from "../pwa/OfflineIndicator";
import BottomNav from "../mobile/BottomNav";
import Avatar from "../ui/Avatar";
import SyncStatusIndicator from "../sync/SyncStatusIndicator";
import { useNotificationTriggers } from "../../hooks/useNotificationTriggers";

const NAV_ITEMS = [
  {
    href: "/dashboard" as const,
    labelKey: "nav.dashboard" as const,
    icon: LayoutDashboard,
  },
  {
    href: "/quests" as const,
    labelKey: "nav.quests" as const,
    icon: CheckSquare,
  },
  {
    href: "/battle" as const,
    labelKey: "nav.battle" as const,
    icon: Swords,
  },
  {
    href: "/shop" as const,
    labelKey: "nav.shop" as const,
    icon: ShoppingBag,
  },
  {
    href: "/skills" as const,
    labelKey: "nav.skills" as const,
    icon: BookOpen,
  },
  {
    href: "/analytics" as const,
    labelKey: "nav.analytics" as const,
    icon: BarChart2,
  },
  {
    href: "/friends" as const,
    labelKey: "nav.friends" as const,
    icon: Users,
  },
  {
    href: "/achievements" as const,
    labelKey: "nav.achievements" as const,
    icon: Trophy,
  },
  {
    href: "/settings" as const,
    labelKey: "nav.settings" as const,
    icon: Settings,
  },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();
  const { userProfile } = useAuth();

  // Initialize notification triggers
  useNotificationTriggers();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl fixed inset-y-0 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Level-Life
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={20} />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {userProfile && (
          <div className="p-4 border-t border-border">
            <Link
              href="/settings"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all"
            >
              <Avatar
                customAvatar={userProfile.customAvatar}
                avatarId={userProfile.avatarId}
                photoURL={userProfile.photoURL}
                name={userProfile.displayName}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {userProfile.displayName || t("settings.guest")}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {t("nav.settings")}
                </p>
              </div>
            </Link>
          </div>
        )}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 border-b border-border bg-background/80 backdrop-blur-md z-40 flex items-center justify-between px-4">
        <span className="font-bold text-lg">Level-Life</span>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-64 bg-background border-l border-border z-50 p-6 md:hidden"
            >
              <div className="flex justify-end mb-8">
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X size={24} />
                </button>
              </div>
              <nav className="space-y-4">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-lg font-medium",
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon size={24} />
                    {t(item.labelKey)}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 pb-20 md:pb-0 min-h-screen">
        <div className="container max-w-5xl mx-auto p-4 md:p-8">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* PWA Components */}
      <OfflineIndicator />
      <InstallPrompt />

      {/* Sync Status Indicator */}
      <SyncStatusIndicator />
    </div>
  );
}
