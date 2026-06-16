"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Menu, X, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/sidebar-store";
import { useNotificationStore } from "@/store/notification-store";
import { useAuthStore } from "@/store/auth-store";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/live-map": "Live Map",
  "/vehicle": "Fleet Management",
  "/scheduler": "Scheduler",
  "/notification": "Notifications",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { toggle } = useSidebarStore();
  const { user } = useAuthStore();
  const { notifications, markRead, markAllRead, clearNotifications } =
    useNotificationStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const title = PAGE_TITLES[pathname] ?? "LogiTrack";
  const unreadNotifications = notifications.filter((n) => !n.read);
  const unreadCount = unreadNotifications.length;

  return (
    <header className="sticky top-0 z-40 h-20 flex items-center justify-between px-6 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-accent rounded-full cursor-pointer"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </Button>

        <div className="min-w-0 select-none">
          <h1 className="text-lg font-semibold text-foreground truncate leading-snug">
            {title}
          </h1>
          <p className="text-xs text-muted-foreground font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-primary rounded-full cursor-pointer"
          aria-label="Search"
        >
          <Search size={18} />
        </Button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative text-muted-foreground hover:text-foreground hover:bg-primary rounded-full cursor-pointer",
              notifOpen && "bg-accent text-foreground",
            )}
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full" />
            )}
          </Button>

          {notifOpen && (
            <>
              {/* Overlay click catcher */}
              <div
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setNotifOpen(false)}
              />

              <div className="absolute right-0 mt-3 w-80 max-h-[460px] flex flex-col bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-50 slide-in-from-top-3 duration-200">
                {/* Notification Panel Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/40 select-none">
                  <span className="font-semibold text-sm">
                    Notifications ({unreadCount})
                  </span>
                  <div className="flex items-center gap-1">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => markAllRead()}
                        className="w-8 h-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-primary cursor-pointer"
                        title="Mark all as read"
                      >
                        <Check size={14} />
                      </Button>
                    )}
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => clearNotifications()}
                        className="w-8 h-8 text-muted-foreground hover:text-destructive rounded-full hover:bg-primary cursor-pointer"
                        title="Clear all"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setNotifOpen(false)}
                      className="w-8 h-8 text-muted-foreground hover:text-foreground rounded-full hover:bg-primary cursor-pointer"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto divide-y divide-border">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center select-none">
                      <span className="text-2xl mb-1">🔔</span>
                      <p className="text-xs text-muted-foreground font-medium">
                        All caught up!
                      </p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markRead(n.id);
                        }}
                        className={cn(
                          "flex gap-3 p-3.5 text-left hover:bg-accent/40 transition-colors cursor-pointer",
                          !n.read && "bg-primary/5",
                        )}
                      >
                        <span className="text-lg select-none">
                          {n.type === "success" && "✅"}
                          {n.type === "warning" && "⚠️"}
                          {n.type === "error" && "🚨"}
                          {n.type === "info" && "ℹ️"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-[13px] text-foreground font-medium truncate",
                              !n.read && "font-semibold",
                            )}
                          >
                            {n.title}
                          </p>
                          <p className="text-[12px] text-muted-foreground line-clamp-2 mt-0.5">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/80 font-medium mt-1">
                            {n.timestamp}
                          </p>
                        </div>
                        {!n.read && (
                          <div className="shrink-0 w-2 h-2 bg-primary rounded-full mt-2 self-start" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Footer view link */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    setNotifOpen(false);
                    // navigate to notifications
                    window.location.href = "/notification";
                  }}
                  className="w-full text-center py-5 bg-accent/30 text-xs font-semibold text-primary hover:bg-accent/50 border-t border-border rounded-none cursor-pointer"
                >
                  View all notifications
                </Button>
              </div>
            </>
          )}
        </div>

        {/* User Info Avatar */}
        <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-[13px] border border-primary/20 select-none">
          {user?.fullName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "AO"}
        </div>
      </div>
    </header>
  );
}
