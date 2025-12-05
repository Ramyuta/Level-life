"use client";

import { AuthProvider } from "./features/auth/context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { UserProvider } from "./features/user/context/UserContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { LanguageProvider } from "./features/i18n/LanguageContext";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <UserProvider>
            <ToastProvider>
              <ConfirmProvider>{children}</ConfirmProvider>
            </ToastProvider>
          </UserProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
