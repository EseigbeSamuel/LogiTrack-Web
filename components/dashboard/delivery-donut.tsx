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
    <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm p-6 w-full lg:w-[360px] select-none">
      <div className="pb-4 border-b border-border">
        <h3 className="text-[15px] font-bold text-foreground">
          Delivery Status
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Current state breakdown
        </p>
      </div>

      {/* Donut chart */}
      <div className="relative h-[200px] my-4 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="opacity-90 hover:opacity-100 transition-opacity duration-200"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: "0.8rem",
                color: "var(--foreground)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              formatter={(value: unknown) => {
                const val =
                  typeof value === "number" || typeof value === "string"
                    ? Number(value)
                    : 0;
                return [
                  `${val} (${((val / total) * 100).toFixed(1)}%)` as string,
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-bold tracking-tight text-foreground leading-none">
            {total.toLocaleString()}
          </p>
          <p className="text-[10px] font-bold text-muted-foreground/80 tracking-wider mt-1 uppercase">
            Total
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2.5 mt-auto">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{
                backgroundColor: item.color,
                boxShadow: `0 0 4px ${item.color}40`,
              }}
            />
            <span className="flex-1 text-xs text-muted-foreground font-medium truncate">
              {item.name}
            </span>
            <span className="text-xs font-semibold text-foreground">
              {item.value}
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground/80 w-8 text-right">
              {((item.value / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
