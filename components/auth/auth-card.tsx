import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div className={cn("glass-card", className)}>
      {/* Specular highlight — top edge */}
      <div className="glass-specular" aria-hidden="true" />
      {children}
    </div>
  );
}
