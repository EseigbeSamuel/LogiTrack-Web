import React from "react";
import {
  Package,
  Truck,
  CheckCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import type { StatCard } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const ICON_MAP = {
  Package,
  Truck,
  CheckCircle,
  DollarSign,
} as Record<string, React.ElementType>;

const COLOR_CONFIG = {
  blue: {
    bg: "bg-blue-500/10 dark:bg-blue-500/5",
    border: "border-blue-500/20",
    text: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-500/20 dark:bg-blue-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/10 dark:bg-emerald-500/5",
    border: "border-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-500/20 dark:bg-emerald-500/10",
  },
  violet: {
    bg: "bg-violet-500/10 dark:bg-violet-500/5",
    border: "border-violet-500/20",
    text: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-500/20 dark:bg-violet-500/10",
  },
  amber: {
    bg: "bg-amber-500/10 dark:bg-amber-500/5",
    border: "border-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-500/20 dark:bg-amber-500/10",
  },
};

interface StatCardProps {
  card: StatCard;
}

export function StatCardWidget({ card }: StatCardProps) {
  const Icon = ICON_MAP[card.icon] ?? Package;
  const cfg = COLOR_CONFIG[card.color];
  const isUp = card.trend >= 0;

  return (
    <div className={cn(
      "relative overflow-hidden p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 group",
      cfg.bg
    )}>
      {/* Background glow orb */}
      <div className={cn(
        "absolute -right-10 -top-10 w-28 h-28 rounded-full blur-2xl opacity-20 dark:opacity-10 group-hover:scale-125 transition-transform duration-500",
        card.color === "blue" && "bg-blue-500",
        card.color === "emerald" && "bg-emerald-500",
        card.color === "violet" && "bg-violet-500",
        card.color === "amber" && "bg-amber-500"
      )} />

      {/* Top row: icon + trend */}
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl", cfg.iconBg)}>
          <Icon size={18} className={cfg.text} strokeWidth={2.3} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-[13px] font-semibold px-2 py-0.5 rounded-full select-none",
          isUp
            ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/5"
            : "text-destructive bg-destructive/10 dark:bg-destructive/5"
        )}>
          {isUp ? <TrendingUp size={13} strokeWidth={2.5} /> : <TrendingDown size={13} strokeWidth={2.5} />}
          {Math.abs(card.trend)}%
        </div>
      </div>

      {/* Content */}
      <div className="mt-4 select-none">
        <p className="text-[13px] font-medium text-muted-foreground">{card.label}</p>
        <p className="text-2xl font-bold tracking-tight text-foreground mt-1 select-all">{card.value}</p>
        <p className="text-[11px] font-medium text-muted-foreground/80 mt-1">{card.trendLabel}</p>
      </div>
    </div>
  );
}
