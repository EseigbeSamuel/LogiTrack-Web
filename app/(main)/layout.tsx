import React from "react";
import { SidebarProvider } from "@/context/sidebar-context";
import { MainShell } from "@/components/layout/main-shell";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <MainShell>{children}</MainShell>
    </SidebarProvider>
  );
}
