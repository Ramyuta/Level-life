import React from "react";
import { cn } from "../../lib/utils";

interface PageSectionCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageSectionCard({
  children,
  className,
  title,
  subtitle,
  action,
}: PageSectionCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-slate-800/80 p-6 ring-1 ring-white/10 backdrop-blur-sm",
        className
      )}
    >
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {title && <h2 className="text-xl font-bold text-white">{title}</h2>}
            {subtitle && (
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
