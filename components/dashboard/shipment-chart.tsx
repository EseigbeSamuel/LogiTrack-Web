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
import { Button } from "@/components/ui/button";
import type { ShipmentPoint } from "@/types/dashboard";

interface Props {
  data: ShipmentPoint[];
}

function tickFormatter(value: string, index: number) {
  return index % 5 === 0 ? value : "";
}

export function ShipmentChart({ data }: Props) {
  const chartData = useMemo(() => data.slice(-30), [data]);

  return (
    <div className="flex flex-col bg-card border border-border rounded-2xl shadow-sm p-6 flex-1 min-w-0 select-none">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Shipment Volume</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Last 30 days overview</p>
        </div>
        <Button className="h-8 px-3 text-xs shadow-sm cursor-pointer">
          Export
        </Button>
      </div>

      <div className="py-6 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradShipments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={tickFormatter}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              width={40}
            />

            <Tooltip
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: "0.8rem",
                color: "var(--foreground)",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ fontWeight: 700, marginBottom: 4 }}
            />

            <Area
              type="monotone"
              dataKey="shipments"
              name="Total"
              stroke="var(--primary)"
              strokeWidth={2}
              fill="url(#gradShipments)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="delivered"
              name="Delivered"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#gradDelivered)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--accent)", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex gap-5 px-2 mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-primary shadow-sm" />
          <span className="text-xs text-muted-foreground font-medium">Total Shipments</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded bg-accent shadow-sm" />
          <span className="text-xs text-muted-foreground font-medium">Delivered</span>
        </div>
      </div>
    </div>
  );
}
