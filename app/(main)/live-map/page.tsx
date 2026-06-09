"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Filter, RefreshCcw, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";

// SVG coordinates mapping for main hubs
const HUB_COORDS: Record<string, { x: number; y: number }> = {
  "Lagos Hub": { x: 120, y: 410 },
  "Lagos Central Hub": { x: 120, y: 410 },
  "Abuja Depot": { x: 300, y: 250 },
  "Kano Distribution Center": { x: 380, y: 90 },
  "Kano Depot": { x: 380, y: 90 },
  "Port Harcourt Terminal": { x: 220, y: 450 },
  "Port Harcourt Depot": { x: 220, y: 450 },
  "Enugu Depot": { x: 250, y: 380 },
  "Enugu Terminal": { x: 250, y: 380 },
  "Ibadan Depot": { x: 140, y: 380 },
  "Kaduna Hub": { x: 320, y: 180 },
  "Warri Depot": { x: 180, y: 430 },
};

// Interpolates a coordinate between two points based on progress percentage
function getVehiclePosition(route: string, progress: number) {
  const [origin, dest] = route.split(" → ").map((r) => r.trim());
  const originCoord = HUB_COORDS[origin] ||
    HUB_COORDS[`${origin} Hub`] ||
    HUB_COORDS[`${origin} Depot`] ||
    HUB_COORDS[`${origin} Terminal`] || { x: 150, y: 150 };
  const destCoord = HUB_COORDS[dest] ||
    HUB_COORDS[`${dest} Hub`] ||
    HUB_COORDS[`${dest} Depot`] ||
    HUB_COORDS[`${dest} Terminal`] || { x: 200, y: 200 };

  const ratio = progress / 100;
  return {
    x: originCoord.x + (destCoord.x - originCoord.x) * ratio,
    y: originCoord.y + (destCoord.y - originCoord.y) * ratio,
  };
}

export default function LiveMapPage() {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "on-route" | "delayed" | "idle"
  >("all");

  const { data: vehicles = [], refetch: refetchVehicles } = useQuery({
    queryKey: ["vehicles"],
    queryFn: apiClient.getVehicles,
  });

  const { data: hubs = [], refetch: refetchHubs } = useQuery({
    queryKey: ["hubs"],
    queryFn: apiClient.getHubs,
  });

  const handleRefresh = () => {
    refetchVehicles();
    refetchHubs();
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (filterStatus === "all") return true;
    return v.status === filterStatus;
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)] select-none">
      {/* Sidebar Controls */}
      <div className="flex flex-col gap-4 w-full lg:w-80 shrink-0">
        {/* Header control */}
        <div className="p-4 border border-border bg-card rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Navigation size={16} className="text-primary animate-pulse" />
              Live Tracking Hub
            </h2>
            <button
              onClick={handleRefresh}
              className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
              title="Refresh Map"
            >
              <RefreshCcw size={14} />
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Real-time status coordinates across Nigeria
          </p>
        </div>

        {/* Filter Selection */}
        <div className="p-4 border border-border bg-card rounded-2xl shadow-sm flex flex-col gap-2">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Filter size={12} /> Filter Units
          </span>
          {[
            { id: "all", label: "Show All Vehicles" },
            { id: "on-route", label: "On Active Route" },
            { id: "delayed", label: "Delayed Alerts" },
            { id: "idle", label: "Idle in Depots" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as typeof filterStatus)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer",
                filterStatus === f.id
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-transparent border-transparent text-muted-foreground hover:bg-accent/40",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Selected Card details */}
        {selectedVehicle ? (
          <div className="p-5 border border-border bg-card rounded-2xl shadow-md flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/25 px-2.5 py-1 rounded-md font-mono uppercase">
                {selectedVehicle.plate}
              </span>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-muted-foreground hover:text-foreground text-[10px] font-bold"
              >
                Clear
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground">
                Assigned Driver
              </span>
              <span className="text-sm font-bold text-foreground">
                {selectedVehicle.driver}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 border-y border-border py-3">
              <div>
                <p className="text-[10px] text-muted-foreground">
                  Current Speed
                </p>
                <p className="text-xs font-bold text-foreground mt-0.5">
                  {selectedVehicle.speed} km/h
                </p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Fuel Level</p>
                <p
                  className={cn(
                    "text-xs font-bold mt-0.5",
                    selectedVehicle.fuelLevel < 20
                      ? "text-destructive"
                      : "text-foreground",
                  )}
                >
                  {selectedVehicle.fuelLevel}%
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-[10px] text-muted-foreground">Route Details</p>
              <p className="text-xs font-bold text-foreground mt-0.5">
                {selectedVehicle.route}
              </p>
              {selectedVehicle.progress > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${selectedVehicle.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground">
                    {selectedVehicle.progress}%
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
              <span>
                ETA: <strong>{selectedVehicle.eta}</strong>
              </span>
              <span>
                Updated: <strong>{selectedVehicle.lastUpdated}</strong>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 border border-border border-dashed bg-accent/5 rounded-2xl text-center select-none">
            <span className="text-3xl animate-bounce">🚛</span>
            <p className="text-xs text-muted-foreground font-semibold mt-2">
              Select a vehicle marker on the map to inspect details.
            </p>
          </div>
        )}
      </div>

      {/* Main Map Panel */}
      <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm p-4 relative overflow-hidden flex items-center justify-center min-h-[400px]">
        {/* Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.85_0.02_290/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.85_0.02_290/0.06)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

        {/* SVG Nigeria Route Visualization Map */}
        <svg
          viewBox="0 0 550 500"
          className="w-full h-full max-w-[500px] max-h-[460px] z-10"
        >
          {/* Active routes dotted paths */}
          {vehicles
            .filter((v) => v.status === "on-route" || v.status === "delayed")
            .map((v) => {
              const [origin, dest] = v.route.split(" → ").map((r) => r.trim());
              const start = HUB_COORDS[origin] ||
                HUB_COORDS[`${origin} Hub`] ||
                HUB_COORDS[`${origin} Depot`] ||
                HUB_COORDS[`${origin} Terminal`] || { x: 0, y: 0 };
              const end = HUB_COORDS[dest] ||
                HUB_COORDS[`${dest} Hub`] ||
                HUB_COORDS[`${dest} Depot`] ||
                HUB_COORDS[`${dest} Terminal`] || { x: 0, y: 0 };
              return (
                <g key={v.id}>
                  <line
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="var(--primary)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    className="opacity-40"
                  />
                </g>
              );
            })}

          {/* Hubs Markers */}
          {hubs.map((h) => {
            const coords = HUB_COORDS[h.name] || { x: 200, y: 200 };
            return (
              <g key={h.id} className="cursor-pointer group">
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={8}
                  className={cn(
                    "stroke-card stroke-2 transition-all duration-300",
                    h.status === "active" ? "fill-primary" : "",
                    h.status === "full" ? "fill-destructive" : "",
                    h.status === "maintenance" ? "fill-amber-500" : "",
                  )}
                />
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={14}
                  className="fill-transparent stroke-primary/10 group-hover:stroke-primary/30 transition-all duration-300"
                />
                <text
                  x={coords.x}
                  y={coords.y - 14}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-foreground select-none pointer-events-none drop-shadow-sm bg-card px-1"
                >
                  {h.name
                    .replace(" Hub", "")
                    .replace(" Terminal", "")
                    .replace(" Distribution Center", "")}
                </text>
              </g>
            );
          })}

          {/* Vehicle Markers */}
          {filteredVehicles.map((v) => {
            let x = 200;
            let y = 200;

            if (v.status === "on-route" || v.status === "delayed") {
              const pos = getVehiclePosition(v.route, v.progress);
              x = pos.x;
              y = pos.y;
            } else {
              // Idle or in maintenance, place at destination hub or origin depot
              const depot = v.route.split(" → ")[0] || v.route;
              const coords = HUB_COORDS[depot] ||
                HUB_COORDS[`${depot} Depot`] ||
                HUB_COORDS[`${depot} Depot`] ||
                HUB_COORDS[`${depot} Central Hub`] || { x: 200, y: 200 };
              x = coords.x + (v.id === "v-003" ? 12 : -12); // offset so they don't overlay
              y = coords.y + (v.id === "v-003" ? 12 : -12);
            }

            const isSelected = selectedVehicle?.id === v.id;

            return (
              <g
                key={v.id}
                className="cursor-pointer"
                onClick={() => setSelectedVehicle(v)}
              >
                {/* Active radar rings for selected or moving vehicles */}
                {(v.status === "on-route" || isSelected) && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 16 : 10}
                    className="fill-primary/20 stroke-primary/30 animate-ping opacity-75"
                  />
                )}
                <rect
                  x={x - 8}
                  y={y - 8}
                  width={16}
                  height={16}
                  rx={4}
                  className={cn(
                    "stroke-card stroke-2 shadow-sm transition-all duration-300",
                    v.status === "on-route" ? "fill-blue-500" : "",
                    v.status === "delayed" ? "fill-destructive" : "",
                    v.status === "idle" ? "fill-zinc-500" : "",
                    v.status === "maintenance" ? "fill-amber-500" : "",
                    isSelected && "stroke-primary stroke-2 scale-125",
                  )}
                />
                <text
                  x={x}
                  y={y + 3}
                  textAnchor="middle"
                  className="text-[8px] font-bold fill-white select-none pointer-events-none font-mono"
                >
                  v
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Map Info overlay */}
        <div className="absolute bottom-4 left-4 p-3 bg-card/90 backdrop-blur border border-border rounded-xl text-[10px] font-semibold text-muted-foreground flex flex-col gap-1.5 shadow select-none z-20">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-primary rounded-full" />
            <span>Active Depots / Hubs</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded" />
            <span>Moving Vehicle</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-destructive rounded" />
            <span>Delayed Unit Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
