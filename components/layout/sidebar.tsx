"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Truck,
  CalendarClock,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/context/sidebar-context";

const NAV_ITEMS = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard"     },
  { href: "/live-map",      icon: MapPin,           label: "Live Map"      },
  { href: "/vehicle",       icon: Truck,            label: "Fleet"         },
  { href: "/scheduler",     icon: CalendarClock,    label: "Scheduler"     },
  { href: "/notification",  icon: Bell,             label: "Notifications" },
  { href: "/settings",      icon: Settings,         label: "Settings"      },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebarState();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sidebar-root",
        collapsed && "sidebar-collapsed"
      )}
    >
      {/* ── Logo ── */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Package size={20} color="#fff" strokeWidth={2.3} />
        </div>
        {!collapsed && (
          <span className="sidebar-brand">
            Logi<span>Track</span>
          </span>
        )}
      </div>

      {/* ── Divider ── */}
      <div className="sidebar-divider" />

      {/* ── Nav Items ── */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn("sidebar-nav-item", isActive && "sidebar-nav-item--active")}
              title={collapsed ? label : undefined}
            >
              {isActive && <span className="sidebar-active-bar" aria-hidden="true" />}
              <Icon
                size={19}
                strokeWidth={isActive ? 2.2 : 1.8}
                className="sidebar-nav-icon"
              />
              {!collapsed && (
                <span className="sidebar-nav-label">{label}</span>
              )}
              {/* notification dot for Notifications */}
              {label === "Notifications" && (
                <span className="sidebar-badge" aria-label="3 unread" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Spacer ── */}
      <div className="flex-1" />

      {/* ── Divider ── */}
      <div className="sidebar-divider" />

      {/* ── User Section ── */}
      <div className={cn("sidebar-user", collapsed && "sidebar-user--collapsed")}>
        <div className="sidebar-avatar" aria-hidden="true">
          <span>AO</span>
        </div>
        {!collapsed && (
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">Alex Obi</p>
            <p className="sidebar-user-role">Fleet Manager</p>
          </div>
        )}
        {!collapsed && (
          <button
            className="sidebar-logout-btn"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>

      {/* ── Collapse Toggle ── */}
      <button
        onClick={toggle}
        className="sidebar-toggle"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={15} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={15} strokeWidth={2.5} />
        )}
      </button>
    </aside>
  );
}
