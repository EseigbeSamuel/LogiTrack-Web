"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ShipmentPoint } from "@/types/dashboard";

interface Props {
  data: ShipmentPoint[];
}

/* Show every 5th label so they don't overlap */
function tickFormatter(value: string, index: number) {
  return index % 5 === 0 ? value : "";
}

export function ShipmentChart({ data }: Props) {
  /* Only use the last 30 entries */
  const chartData = useMemo(() => data.slice(-30), [data]);

  return (
    <div className="dash-panel" style={{ height: "100%", minHeight: 300 }}>
      <div className="dash-panel-header">
        <div>
          <p className="dash-panel-title">Shipment Volume</p>
          <p className="dash-panel-subtitle">Last 30 days</p>
        </div>
        <button className="dash-panel-action">Export</button>
      </div>

      <div style={{ padding: "16px 8px 8px 0", height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 16, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradShipments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#007AFF" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#007AFF" stopOpacity={0}    />
              </linearGradient>
              <linearGradient id="gradDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.30} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}    />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={tickFormatter}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={36}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(14,18,34,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.88)",
              }}
              labelStyle={{ fontWeight: 700, marginBottom: 4 }}
            />

            <Area
              type="monotone"
              dataKey="shipments"
              name="Total"
              stroke="#007AFF"
              strokeWidth={2}
              fill="url(#gradShipments)"
              dot={false}
              activeDot={{ r: 4, fill: "#007AFF", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="delivered"
              name="Delivered"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#gradDelivered)"
              dot={false}
              activeDot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: "0 20px 16px",
        }}
      >
        {[
          { color: "#007AFF", label: "Total Shipments" },
          { color: "#10b981", label: "Delivered" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: l.color,
                boxShadow: `0 0 6px ${l.color}80`,
              }}
            />
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.50)" }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
