"use client";

import { Activity, Zap } from "lucide-react";
import { StatCardWidget } from "@/components/dashboard/stat-card";
import { ShipmentChart } from "@/components/dashboard/shipment-chart";
import { DeliveryDonut } from "@/components/dashboard/delivery-donut";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { FleetStatus } from "@/components/dashboard/fleet-status";
import {
  statCards,
  shipmentTrend,
  deliveryStatus,
  fleetVehicles,
  activityFeed,
} from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="dash-page">

      {/* ── Welcome bar ── */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h2>Good evening, Alex 👋</h2>
          <p>Here&apos;s what&apos;s happening across your fleet today.</p>
        </div>
        <div className="dash-welcome-badge">
          <Activity size={14} />
          Live
        </div>
      </div>

      {/* ── KPI Stat Cards ── */}
      <div className="dash-kpi-grid">
        {statCards.map((card) => (
          <StatCardWidget key={card.id} card={card} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="dash-charts-row">
        <ShipmentChart data={shipmentTrend} />
        <DeliveryDonut data={deliveryStatus} />
      </div>

      {/* ── Bottom Row ── */}
      <div className="dash-bottom-row">
        <ActivityFeed events={activityFeed} />
        <FleetStatus vehicles={fleetVehicles} />
      </div>

      {/* ── Quick Actions ── */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          padding: "4px 0 8px",
        }}
      >
        {[
          { icon: "📦", label: "New Shipment",  color: "#007AFF" },
          { icon: "🚛", label: "Assign Vehicle", color: "#10b981" },
          { icon: "📍", label: "Track Order",    color: "#8b5cf6" },
          { icon: "📊", label: "Run Report",     color: "#f59e0b" },
        ].map((action) => (
          <button
            key={action.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 18px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.88)",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              backdropFilter: "blur(12px)",
              transition: "background 0.2s, border-color 0.2s, transform 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = `${action.color}18`;
              (e.currentTarget as HTMLButtonElement).style.borderColor = `${action.color}40`;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.10)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <span>{action.icon}</span>
            {action.label}
          </button>
        ))}
      </div>

    </div>
  );
}
