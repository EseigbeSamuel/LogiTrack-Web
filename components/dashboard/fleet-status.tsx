import React from "react";
import type { Vehicle } from "@/types/vehicle";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<Vehicle["status"], string> = {
  "on-route": "On Route",
  idle: "Idle",
  delayed: "Delayed",
  maintenance: "Service",
};

const STATUS_CLASSES: Record<Vehicle["status"], string> = {
  "on-route": "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5",
  idle: "text-zinc-600 bg-zinc-500/10 dark:text-zinc-400 dark:bg-zinc-500/5",
  delayed: "text-destructive bg-destructive/10 dark:bg-destructive/5",
  maintenance: "text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/5",
};

interface Props {
  vehicles: Vehicle[];
}

export function FleetStatus({ vehicles }: Props) {
  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm p-6 flex-1 min-w-0 select-none">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Fleet Status</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{vehicles.length} active units tracked</p>
        </div>
        <button
          onClick={() => (window.location.href = "/vehicle")}
          className="px-3 py-1.5 text-xs font-semibold bg-accent hover:bg-accent/80 text-foreground border border-border rounded-lg transition-colors cursor-pointer"
        >
          Manage
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-6 overflow-y-auto max-h-[360px] pr-1">
        {vehicles.map((v) => (
          <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-accent/10 hover:bg-accent/20 transition-colors">
            {/* Left: Plate + Driver info */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 px-2 py-1 rounded-md uppercase font-mono">
                {v.plate}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-foreground truncate">{v.driver}</p>
                <p className="text-[11px] text-muted-foreground truncate">{v.route}</p>
              </div>
            </div>

            {/* Middle: Progress bar (only for active routes) */}
            <div className="flex-1 max-w-[200px] flex items-center gap-2">
              {v.progress > 0 ? (
                <>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden" title={`${v.progress}% complete`}>
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${v.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground w-6 text-right">
                    {v.progress}%
                  </span>
                </>
              ) : (
                <span className="text-[11px] text-muted-foreground/60 italic">—</span>
              )}
            </div>

            {/* Right: Status badge + ETA */}
            <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto border-t sm:border-0 border-border pt-2 sm:pt-0">
              <span className={cn(
                "text-[11px] font-bold px-2 py-0.5 rounded-full select-none",
                STATUS_CLASSES[v.status]
              )}>
                {STATUS_LABELS[v.status]}
              </span>
              <span className="text-[11px] font-mono font-medium text-muted-foreground/90 w-16 text-right">
                {v.eta}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
