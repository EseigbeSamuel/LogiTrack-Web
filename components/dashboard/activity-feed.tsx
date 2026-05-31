import React from "react";
import type { ActivityEvent } from "@/types/dashboard";

const EVENT_ICONS: Record<ActivityEvent["type"], { emoji: string; bg: string }> = {
  delivered:   { emoji: "✅", bg: "rgba(16,185,129,0.15)"  },
  departed:    { emoji: "🚛", bg: "rgba(0,122,255,0.15)"   },
  delayed:     { emoji: "⚠️", bg: "rgba(239,68,68,0.15)"   },
  assigned:    { emoji: "📋", bg: "rgba(139,92,246,0.15)"  },
  alert:       { emoji: "⛽", bg: "rgba(245,158,11,0.15)"  },
  maintenance: { emoji: "🔧", bg: "rgba(107,114,128,0.20)" },
};

interface Props {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: Props) {
  return (
    <div className="dash-panel" style={{ height: "100%" }}>
      <div className="dash-panel-header">
        <div>
          <p className="dash-panel-title">Recent Activity</p>
          <p className="dash-panel-subtitle">Live logistics events</p>
        </div>
        <button className="dash-panel-action">View all</button>
      </div>

      <div className="activity-list">
        {events.map((event) => {
          const cfg = EVENT_ICONS[event.type];
          return (
            <div key={event.id} className="activity-item">
              <div className="activity-icon" style={{ background: cfg.bg }}>
                {cfg.emoji}
              </div>
              <div className="activity-body">
                <p className="activity-title">{event.title}</p>
                <p className="activity-desc">{event.description}</p>
              </div>
              <span className="activity-time">{event.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
