"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Bell, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORY_TABS = [
  { id: "all", label: "All Alerts" },
  { id: "system", label: "System Logs" },
  { id: "fleet", label: "Fleet Telemetry" },
  { id: "delivery", label: "Delivery Dispatch" },
];

export default function NotificationPage() {
  const queryClient = useQueryClient();
  const [filterCategory, setFilterCategory] = useState("all");

  // Queries
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: apiClient.getNotifications,
  });

  // Mutations
  const readMutation = useMutation({
    mutationFn: apiClient.markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const readAllMutation = useMutation({
    mutationFn: apiClient.markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read.");
    },
  });

  const clearMutation = useMutation({
    mutationFn: apiClient.clearNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification logs cleared.");
    },
  });

  const filteredNotifs = notifications.filter((n) => {
    if (filterCategory === "all") return true;
    return n.category === filterCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-6 select-none max-w-4xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-card rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Bell size={20} className="text-primary" />
            Notification Logs
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            You have {unreadCount} unread system notifications and updates.
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              onClick={() => readAllMutation.mutate()}
              variant="outline"
              className="flex items-center gap-1.5 h-9 rounded-xl text-xs font-semibold px-3 cursor-pointer"
            >
              <Check size={14} />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              onClick={() => clearMutation.mutate()}
              variant="destructive"
              className="flex items-center gap-1.5 h-9 rounded-xl text-xs font-semibold px-3 cursor-pointer"
            >
              <Trash2 size={14} />
              Clear logs
            </Button>
          )}
        </div>
      </div>

      {/* Main Panel */}
      <div className="flex flex-col gap-4">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-accent/25 border border-border rounded-xl self-start">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer",
                filterCategory === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="bg-card border border-border rounded-2xl shadow-sm divide-y divide-border overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
              Loading notifications...
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div className="p-16 text-center select-none flex flex-col items-center justify-center">
              <span className="text-4xl mb-2">🔔</span>
              <p className="text-sm font-semibold text-foreground">
                All alerts clear
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                No notifications recorded in this category.
              </p>
            </div>
          ) : (
            filteredNotifs.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) readMutation.mutate(n.id);
                }}
                className={cn(
                  "flex gap-4 p-4 items-start hover:bg-accent/10 transition-colors cursor-pointer",
                  !n.read && "bg-primary/5",
                )}
              >
                {/* Icon mapping */}
                <div className="shrink-0 mt-0.5 select-none text-xl">
                  {n.type === "success" && (
                    <span className="text-emerald-600 dark:text-emerald-400">
                      ✅
                    </span>
                  )}
                  {n.type === "warning" && (
                    <span className="text-amber-500">⚠️</span>
                  )}
                  {n.type === "error" && (
                    <span className="text-destructive">🚨</span>
                  )}
                  {n.type === "info" && (
                    <span className="text-blue-500">ℹ️</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        "text-sm text-foreground font-semibold",
                        !n.read && "font-bold text-primary",
                      )}
                    >
                      {n.title}
                    </h4>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider bg-accent px-1.5 py-0.5 rounded">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 font-medium mt-1">
                    {n.timestamp}
                  </p>
                </div>

                {!n.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      readMutation.mutate(n.id);
                    }}
                    className="shrink-0 p-1 hover:bg-accent rounded text-primary hover:text-foreground transition-colors cursor-pointer"
                    title="Mark read"
                  >
                    <Check size={14} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
