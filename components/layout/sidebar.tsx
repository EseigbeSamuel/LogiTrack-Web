"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { useSidebarStore } from "@/store/sidebar-store";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStore } from "@/store/notification-store";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/live-map", icon: MapPin, label: "Live Map" },
  { href: "/vehicle", icon: Truck, label: "Fleet" },
  { href: "/scheduler", icon: CalendarClock, label: "Scheduler" },
  { href: "/notification", icon: Bell, label: "Notifications" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const { collapsed, toggle, setCollapsed } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const { notifications } = useNotificationStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname, setCollapsed]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out shadow-sm w-[280px]",
        collapsed
          ? "-translate-x-full lg:translate-x-0 lg:w-[80px]"
          : "translate-x-0 lg:w-[280px]",
      )}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-6 h-20 overflow-hidden whitespace-nowrap">
        <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-primary text-primary-foreground rounded-xl shadow-md">
          <Package size={20} strokeWidth={2.5} />
        </div>
        {(!isMobile ? !collapsed : true) && (
          <span className="text-xl font-bold tracking-tight text-foreground select-none">
            Logi<span className="text-primary">Track</span>
          </span>
        )}
      </div>

      <div className="mx-4 h-px bg-border" />

      {/* Nav Items */}
      <nav
        className="flex-1 flex flex-col gap-1.5 px-3 py-4 overflow-y-auto select-none"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group relative flex items-center gap-4 px-4 py-3 rounded-full text-[14px] font-medium transition-all duration-200 ease-in-out cursor-pointer",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
              title={collapsed ? label : undefined}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.3 : 1.8}
                className="shrink-0"
              />
              {!collapsed && <span className="flex-1 truncate">{label}</span>}
              {label === "Notifications" && unreadCount > 0 && (
                <span
                  className={cn(
                    "flex items-center justify-center text-[10px] font-semibold rounded-full",
                    collapsed
                      ? "absolute top-2 right-2 w-2 h-2 bg-destructive"
                      : "px-2 py-0.5 bg-destructive text-destructive-foreground",
                  )}
                >
                  {!collapsed && unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 h-px bg-border" />

      {/* User Card */}
      <div
        className={cn(
          "flex items-center gap-3 p-4",
          collapsed ? "justify-center" : "",
        )}
      >
        <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-[14px] border border-primary/20">
          {user?.fullName
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "AO"}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-foreground truncate">
              {user?.fullName || "Alex Obi"}
            </p>
            <p className="text-[12px] text-muted-foreground truncate">
              {user?.role || "Fleet Manager"}
            </p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={handleLogout}
            className="shrink-0 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={toggle}
        className="absolute bottom-20 -right-3.5 z-55 hidden lg:flex items-center justify-center w-7 h-7 bg-card border border-border text-foreground hover:bg-accent rounded-full shadow-md cursor-pointer transition-transform duration-200"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={14} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={14} strokeWidth={2.5} />
        )}
      </button>
    </aside>
  );
}
