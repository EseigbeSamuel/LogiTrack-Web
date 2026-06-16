import React from "react";
import type { ActivityEvent } from "@/types/dashboard";
import { Button } from "@/components/ui/button";

const EVENT_ICONS: Record<
  ActivityEvent["type"],
  { emoji: string; bg: string }
> = {
  delivered: {
    emoji: "✅",
    bg: "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  },
  departed: {
    emoji: "🚛",
    bg: "bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400",
  },
  delayed: {
    emoji: "⚠️",
    bg: "bg-destructive/10 dark:bg-destructive/5 text-destructive",
  },
  assigned: {
    emoji: "📋",
    bg: "bg-violet-500/10 dark:bg-violet-500/5 text-violet-600 dark:text-violet-400",
  },
  alert: {
    emoji: "⛽",
    bg: "bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400",
  },
  maintenance: {
    emoji: "🔧",
    bg: "bg-zinc-500/15 dark:bg-zinc-500/10 text-muted-foreground",
  },
};

interface Props {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: Props) {
  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm p-6 flex-1 min-w-0 select-none">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">
            Recent Activity
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live logistics and fleet logs
          </p>
        </div>
        <Button
          onClick={() => (window.location.href = "/notification")}
          className="h-8 px-3 text-xs shadow-sm cursor-pointer"
        >
          View all
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-4 mt-6 overflow-y-auto max-h-[360px] pr-1">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <span className="text-xl">📋</span>
            <p className="text-xs text-muted-foreground mt-1">
              No recent events
            </p>
          </div>
        ) : (
          events.map((event) => {
            const cfg = EVENT_ICONS[event.type];
            return (
              <div
                key={event.id}
                className="flex gap-4 items-start p-1.5 rounded-xl hover:bg-accent/20 transition-colors"
              >
                <div
                  className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm ${cfg.bg}`}
                >
                  {cfg.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">
                    {event.title}
                  </p>
                  <p className="text-[12px] text-muted-foreground mt-0.5 leading-normal">
                    {event.description}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground/80 font-medium self-start mt-0.5">
                  {event.timestamp}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
