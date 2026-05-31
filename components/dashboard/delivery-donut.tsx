"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { DeliveryStatus } from "@/types/dashboard";

interface Props {
  data: DeliveryStatus[];
}

export function DeliveryDonut({ data }: Props) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="dash-panel" style={{ height: "100%" }}>
      <div className="dash-panel-header">
        <div>
          <p className="dash-panel-title">Delivery Status</p>
          <p className="dash-panel-subtitle">Current period breakdown</p>
        </div>
      </div>

      {/* Donut chart */}
      <div style={{ position: "relative", height: 200, padding: "8px 0" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={0.9}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(14,18,34,0.95)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 10,
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.88)",
              }}
              formatter={(value: number) => [
                `${value} (${((value / total) * 100).toFixed(1)}%)`,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "rgba(255,255,255,0.92)",
              margin: 0,
              letterSpacing: "-0.03em",
            }}
          >
            {total.toLocaleString()}
          </p>
          <p
            style={{
              fontSize: "0.7rem",
              color: "rgba(255,255,255,0.40)",
              margin: 0,
            }}
          >
            TOTAL
          </p>
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          padding: "4px 20px 18px",
        }}
      >
        {data.map((item) => (
          <div
            key={item.name}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: item.color,
                flexShrink: 0,
                boxShadow: `0 0 6px ${item.color}70`,
              }}
            />
            <span
              style={{
                flex: 1,
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,0.60)",
              }}
            >
              {item.name}
            </span>
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 700,
                color: "rgba(255,255,255,0.88)",
              }}
            >
              {item.value}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.35)",
                width: 40,
                textAlign: "right",
              }}
            >
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
