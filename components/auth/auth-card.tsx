import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-card/70 backdrop-blur-md border border-border shadow-xl rounded-2xl w-full",
        className,
      )}
    >
      {/* Top specular highlight line */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] bg-linear-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
