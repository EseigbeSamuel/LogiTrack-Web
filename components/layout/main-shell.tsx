"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useSidebarState } from "@/context/sidebar-context";
import { cn } from "@/lib/utils";

export function MainShell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebarState();

  return (
    <div className="app-shell">
      <Sidebar />
      <div className={cn("app-body", collapsed && "app-body--collapsed")}>
        <Header />
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
}
