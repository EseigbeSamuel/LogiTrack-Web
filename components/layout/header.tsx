"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Sun, Moon, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/context/sidebar-context";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":    "Dashboard",
  "/live-map":     "Live Map",
  "/vehicle":      "Fleet Management",
  "/scheduler":    "Scheduler",
  "/notification": "Notifications",
  "/settings":     "Settings",
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { collapsed, toggle } = useSidebarState();
  const [notifOpen, setNotifOpen] = useState(false);

  const title = PAGE_TITLES[pathname] ?? "LogiTrack";
  const isDark = theme === "dark";

  return (
    <header className="app-header">
      {/* Left */}
      <div className="header-left">
        {/* Mobile menu / desktop collapse shortcut */}
        <button
          className="header-icon-btn"
          onClick={toggle}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <Menu size={18} /> : <Menu size={18} />}
        </button>

        <div className="header-title-wrap">
          <h1 className="header-title">{title}</h1>
          <p className="header-subtitle">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="header-right">
        {/* Search */}
        <button className="header-icon-btn" aria-label="Search">
          <Search size={17} />
        </button>

        {/* Theme Toggle */}
        <button
          className="header-icon-btn"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className={cn("header-icon-btn", notifOpen && "header-icon-btn--active")}
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="header-notif-dot" aria-hidden="true" />
          </button>

          {notifOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setNotifOpen(false)}
              />
              <div className="header-notif-panel">
                <div className="header-notif-top">
                  <span className="header-notif-heading">Notifications</span>
                  <button
                    className="header-notif-clear"
                    onClick={() => setNotifOpen(false)}
                  >
                    <X size={14} />
                  </button>
                </div>
                {[
                  { icon: "🚨", text: "Delay alert — LGT-2290 on Lagos Expressway", time: "34 min" },
                  { icon: "⛽", text: "Fuel level critical — LGT-7701 at Kano depot", time: "4h" },
                  { icon: "✅", text: "Shipment #SHP-8821 delivered successfully", time: "2 min" },
                ].map((n, i) => (
                  <div key={i} className="header-notif-item">
                    <span className="header-notif-icon">{n.icon}</span>
                    <div className="header-notif-body">
                      <p className="header-notif-text">{n.text}</p>
                      <p className="header-notif-time">{n.time} ago</p>
                    </div>
                  </div>
                ))}
                <button className="header-notif-view-all">
                  View all notifications
                </button>
              </div>
            </>
          )}
        </div>

        {/* User Avatar */}
        <div className="header-avatar" aria-label="User profile">
          <span>AO</span>
        </div>
      </div>
    </header>
  );
}
