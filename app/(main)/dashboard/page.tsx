"use client";

import { Activity, Plus, Truck, MapPin, BarChart3 } from "lucide-react";
import { StatCardWidget } from "@/components/dashboard/stat-card";
import { ShipmentChart } from "@/components/dashboard/shipment-chart";
import { DeliveryDonut } from "@/components/dashboard/delivery-donut";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { FleetStatus } from "@/components/dashboard/fleet-status";
import { apiClient } from "@/lib/api-client";
import { useQuery } from "@tanstack/react-query";
import type { ActivityEvent } from "@/types/dashboard";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  // ── Queries ──
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: apiClient.getDashboardStats,
  });

  const { data: trend = [], isLoading: trendLoading } = useQuery({
    queryKey: ["shipment-trend"],
    queryFn: apiClient.getShipmentTrend,
  });

  const { data: statusBreakdown = [], isLoading: statusLoading } = useQuery({
    queryKey: ["delivery-status"],
    queryFn: apiClient.getDeliveryStatus,
  });

  const { data: fleets = [], isLoading: fleetsLoading } = useQuery({
    queryKey: ["fleets"],
    queryFn: apiClient.getFleets,
  });

  const { data: notifications = [], isLoading: notifsLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiClient.getNotifications,
  });

  // Map notifications to ActivityEvents for the feed
  const activityFeed: ActivityEvent[] = notifications.map((n) => {
    let type: ActivityEvent["type"] = "alert";
    if (n.type === "success") type = "delivered";
    else if (n.type === "warning") type = "alert";
    else if (n.type === "error") type = "delayed";
    else if (n.title.toLowerCase().includes("assign")) type = "assigned";
    else if (n.title.toLowerCase().includes("depart")) type = "departed";
    else if (n.title.toLowerCase().includes("maintenance")) type = "maintenance";

    return {
      id: n.id,
      type,
      title: n.title,
      description: n.message,
      timestamp: n.timestamp,
    };
  });

  const isPageLoading = statsLoading || trendLoading || statusLoading || fleetsLoading || notifsLoading;

  if (isPageLoading) {
    return (
      <div className="flex flex-col gap-6 select-none animate-pulse">
        {/* Welcome skeleton */}
        <div className="h-14 bg-accent/30 rounded-2xl w-1/3" />
        {/* KPIs skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-accent/20 border border-border/50 rounded-2xl" />
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="h-80 bg-accent/20 border border-border/50 rounded-2xl flex-1" />
          <div className="h-80 bg-accent/20 border border-border/50 rounded-2xl w-full lg:w-[360px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-card rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">Good evening, Alex 👋</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Here is what is happening across your fleet today.</p>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 select-none animate-pulse">
          <Activity size={12} strokeWidth={2.5} />
          Live Fleet Active
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((card) => (
          <StatCardWidget key={card.id} card={card} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <ShipmentChart data={trend} />
        <DeliveryDonut data={statusBreakdown} />
      </div>

      {/* Bottom Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed events={activityFeed} />
        <FleetStatus fleets={fleets} />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 p-4 border border-border bg-card rounded-2xl shadow-sm">
        {[
          { icon: <Plus size={16} />, label: "New Shipment", href: "/scheduler", color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30 text-blue-600 dark:text-blue-400" },
          { icon: <Truck size={16} />, label: "Assign Fleet", href: "/fleet", color: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
          { icon: <MapPin size={16} />, label: "Track Fleet", href: "/live-map", color: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-600 dark:text-violet-400" },
          { icon: <BarChart3 size={16} />, label: "Run Report", href: "/settings", color: "bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-600 dark:text-amber-400" },
        ].map((action) => (
          <Button
            key={action.label}
            variant="outline"
            onClick={() => (window.location.href = action.href)}
            className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-xs font-semibold cursor-pointer ${action.color}`}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
