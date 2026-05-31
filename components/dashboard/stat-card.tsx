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

const ICON_MAP = {
  Package,
  Truck,
  CheckCircle,
  DollarSign,
} as Record<string, React.ElementType>;

const COLOR_CONFIG = {
  blue:    { glow: "#007AFF", icon: "rgba(0,122,255,0.18)",   text: "#60a5fa" },
  emerald: { glow: "#10b981", icon: "rgba(16,185,129,0.18)",  text: "#34d399" },
  violet:  { glow: "#8b5cf6", icon: "rgba(139,92,246,0.18)",  text: "#a78bfa" },
  amber:   { glow: "#f59e0b", icon: "rgba(245,158,11,0.18)",  text: "#fbbf24" },
};

interface StatCardProps {
  card: StatCard;
}

export function StatCardWidget({ card }: StatCardProps) {
  const Icon = ICON_MAP[card.icon] ?? Package;
  const cfg  = COLOR_CONFIG[card.color];
  const isUp = card.trend >= 0;

  return (
    <div className="stat-card">
      {/* Background glow orb */}
      <div
        className="stat-card-glow"
        style={{ background: cfg.glow }}
        aria-hidden="true"
      />

      {/* Top row: icon + trend */}
      <div className="stat-card-top">
        <div
          className="stat-card-icon"
          style={{ background: cfg.icon }}
        >
          <Icon size={18} color={cfg.text} strokeWidth={2.2} />
        </div>
        <div className={`stat-card-trend ${isUp ? "stat-card-trend--up" : "stat-card-trend--down"}`}>
          {isUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(card.trend)}%
        </div>
      </div>

      {/* Label */}
      <p className="stat-card-label">{card.label}</p>

      {/* Value */}
      <p className="stat-card-value">{card.value}</p>

      {/* Trend label */}
      <p className="stat-trend-label">{card.trendLabel}</p>
    </div>
  );
}
