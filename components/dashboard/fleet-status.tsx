import React from "react";
import type { Vehicle } from "@/types/dashboard";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<Vehicle["status"], string> = {
  "on-route":    "On Route",
  "idle":        "Idle",
  "delayed":     "Delayed",
  "maintenance": "Service",
};

interface Props {
  vehicles: Vehicle[];
}

export function FleetStatus({ vehicles }: Props) {
  return (
    <div className="dash-panel" style={{ height: "100%" }}>
      <div className="dash-panel-header">
        <div>
          <p className="dash-panel-title">Fleet Status</p>
          <p className="dash-panel-subtitle">{vehicles.length} vehicles tracked</p>
        </div>
        <button className="dash-panel-action">Manage</button>
      </div>

      <div className="fleet-list">
        {vehicles.map((v) => (
          <div key={v.id} className="fleet-item">
            {/* Plate */}
            <span className="fleet-plate">{v.plate}</span>

            {/* Info */}
            <div className="fleet-info">
              <p className="fleet-driver">{v.driver}</p>
              <p className="fleet-route">{v.route}</p>
            </div>

            {/* Progress bar (only for active routes) */}
            {v.progress > 0 && (
              <div className="progress-bar-wrap" title={`${v.progress}% complete`}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${v.progress}%` }}
                />
              </div>
            )}

            {/* Status badge */}
            <span
              className={cn(
                "fleet-status-badge",
                `fleet-status--${v.status}`
              )}
            >
              {STATUS_LABELS[v.status]}
            </span>

            {/* ETA */}
            <span className="fleet-eta">{v.eta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
