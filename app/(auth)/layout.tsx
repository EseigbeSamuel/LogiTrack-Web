"use client";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-root">
      {/* Atmospheric background */}
      <div className="auth-bg" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="orb orb-4" />
        {/* Grid overlay */}
        <div className="auth-grid" />
      </div>

      {/* Page content */}
      <main className="auth-main">{children}</main>
    </div>
  );
}
