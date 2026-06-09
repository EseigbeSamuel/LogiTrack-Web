"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Plus, Trash2, Eye, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/vehicle";

export default function FleetPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // New vehicle form state
  const [newVehicle, setNewVehicle] = useState({
    plate: "",
    driver: "",
    route: "",
    status: "idle" as Vehicle["status"],
    progress: 0,
    cargo: "—",
    eta: "—",
    fuelLevel: 100,
    speed: 0,
    lat: 9.076,
    lng: 7.398,
  });

  // Queries
  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: apiClient.getVehicles,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: apiClient.addVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle registered successfully.");
      setShowAddForm(false);
      setNewVehicle({
        plate: "",
        driver: "",
        route: "",
        status: "idle",
        progress: 0,
        cargo: "—",
        eta: "—",
        fuelLevel: 100,
        speed: 0,
        lat: 9.076,
        lng: 7.398,
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Vehicle["status"] }) =>
      apiClient.updateVehicleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle status updated.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiClient.removeVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      setSelectedVehicle(null);
      toast.success("Vehicle decommissioned.");
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.plate || !newVehicle.driver || !newVehicle.route) {
      toast.error("Please fill in plate, driver, and route.");
      return;
    }
    // Set ETA based on status
    const eta = newVehicle.status === "on-route" ? "4h 30m" : "—";
    addMutation.mutate({ ...newVehicle, eta });
  };

  const handleStatusChange = (id: string, status: Vehicle["status"]) => {
    statusMutation.mutate({ id, status });
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (filterStatus === "all") return true;
    return v.status === filterStatus;
  });

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-card rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Fleet Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Register, deploy, and inspect tracking details of fleet units.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-xl text-xs font-semibold px-4 py-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          Register Vehicle
        </Button>
      </div>

      {/* Main split dashboard view */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Table & filters list */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-accent/20 border border-border rounded-xl">
            {["all", "on-route", "idle", "maintenance", "delayed"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                    filterStatus === tab
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                  )}
                >
                  {tab.replace("-", " ")}
                </button>
              ),
            )}
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
                Loading vehicles...
              </div>
            ) : filteredVehicles.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No vehicles registered in this state.
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs select-none">
                <thead>
                  <tr className="border-b border-border bg-accent/20 text-muted-foreground font-semibold">
                    <th className="p-4">Plate</th>
                    <th className="p-4">Driver</th>
                    <th className="p-4">Route</th>
                    <th className="p-4">Cargo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Fuel</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredVehicles.map((v) => (
                    <tr
                      key={v.id}
                      onClick={() => setSelectedVehicle(v)}
                      className={cn(
                        "hover:bg-accent/10 transition-colors cursor-pointer",
                        selectedVehicle?.id === v.id && "bg-primary/5",
                      )}
                    >
                      <td className="p-4 font-mono font-bold text-primary">
                        {v.plate}
                      </td>
                      <td className="p-4 font-medium">{v.driver}</td>
                      <td className="p-4 font-medium text-muted-foreground">
                        {v.route}
                      </td>
                      <td className="p-4 text-muted-foreground">{v.cargo}</td>
                      <td className="p-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            v.status === "on-route" &&
                              "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5",
                            v.status === "idle" &&
                              "text-zinc-600 bg-zinc-500/10 dark:text-zinc-400 dark:bg-zinc-500/5",
                            v.status === "delayed" &&
                              "text-destructive bg-destructive/10 dark:bg-destructive/5",
                            v.status === "maintenance" &&
                              "text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/5",
                          )}
                        >
                          {v.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="p-4 font-medium">
                        <span
                          className={cn(
                            v.fuelLevel < 20
                              ? "text-destructive font-bold"
                              : "text-foreground",
                          )}
                        >
                          {v.fuelLevel}%
                        </span>
                      </td>
                      <td
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setSelectedVehicle(v)}
                            className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye size={14} />
                          </button>
                          <Select
                            value={v.status}
                            onValueChange={(val) =>
                              handleStatusChange(v.id, val as Vehicle["status"])
                            }
                          >
                            <SelectTrigger className="w-24 h-7 text-[10px] rounded-lg">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="on-route" className="text-xs">
                                On Route
                              </SelectItem>
                              <SelectItem value="idle" className="text-xs">
                                Idle
                              </SelectItem>
                              <SelectItem
                                value="maintenance"
                                className="text-xs"
                              >
                                Service
                              </SelectItem>
                              <SelectItem value="delayed" className="text-xs">
                                Delayed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Floating Forms / Details cards */}
        {(showAddForm || selectedVehicle) && (
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            {/* Form layout */}
            {showAddForm && (
              <div className="p-5 border border-border bg-card rounded-2xl shadow-lg flex flex-col gap-4 animate-in slide-in-from-right-3 duration-200">
                <div className="flex items-center justify-between border-b border-border pb-3 select-none">
                  <h3 className="font-bold text-sm text-foreground">
                    Register Vehicle
                  </h3>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>
                <form
                  onSubmit={handleAddSubmit}
                  className="flex flex-col gap-3"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Plate Number
                    </label>
                    <Input
                      placeholder="e.g. LGT-5022"
                      value={newVehicle.plate}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, plate: e.target.value })
                      }
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Driver Name
                    </label>
                    <Input
                      placeholder="e.g. Emeka Okafor"
                      value={newVehicle.driver}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, driver: e.target.value })
                      }
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Active Route
                    </label>
                    <Input
                      placeholder="e.g. Lagos → Kano"
                      value={newVehicle.route}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, route: e.target.value })
                      }
                      className="h-9 text-xs"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Cargo Cargo
                    </label>
                    <Input
                      placeholder="e.g. Construction Materials"
                      value={newVehicle.cargo}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, cargo: e.target.value })
                      }
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Initial Status
                    </label>
                    <Select
                      value={newVehicle.status}
                      onValueChange={(val) =>
                        setNewVehicle({ ...newVehicle, status: val as Vehicle["status"] })
                      }
                    >
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idle" className="text-xs">
                          Idle
                        </SelectItem>
                        <SelectItem value="on-route" className="text-xs">
                          On Route
                        </SelectItem>
                        <SelectItem value="maintenance" className="text-xs">
                          Service Bay
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    disabled={addMutation.isPending}
                    className="w-full mt-2 h-9 text-xs font-semibold cursor-pointer"
                  >
                    {addMutation.isPending
                      ? "Registering..."
                      : "Submit Registration"}
                  </Button>
                </form>
              </div>
            )}

            {/* Inspect Details panel */}
            {selectedVehicle && !showAddForm && (
              <div className="p-5 border border-border bg-card rounded-2xl shadow-lg flex flex-col gap-4 animate-in slide-in-from-right-3 duration-200">
                <div className="flex items-center justify-between border-b border-border pb-3 select-none">
                  <h3 className="font-bold text-sm text-foreground">
                    Unit Telemetry
                  </h3>
                  <button
                    onClick={() => setSelectedVehicle(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-accent/25 p-3 rounded-xl">
                    <span className="text-xs font-mono font-bold text-primary">
                      {selectedVehicle.plate}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        selectedVehicle.status === "on-route" &&
                          "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5",
                        selectedVehicle.status === "idle" &&
                          "text-zinc-600 bg-zinc-500/10 dark:text-zinc-400 dark:bg-zinc-500/5",
                        selectedVehicle.status === "delayed" &&
                          "text-destructive bg-destructive/10 dark:bg-destructive/5",
                        selectedVehicle.status === "maintenance" &&
                          "text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/5",
                      )}
                    >
                      {selectedVehicle.status.replace("-", " ")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Driver Profile
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {selectedVehicle.driver}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Assigned Cargo
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedVehicle.cargo}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Trip Progress
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {selectedVehicle.route}
                    </span>
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

                  <div className="grid grid-cols-2 gap-3 bg-accent/10 p-3 rounded-xl border border-border">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">
                        Speed
                      </p>
                      <p className="text-xs font-bold text-foreground mt-0.5">
                        {selectedVehicle.speed} km/h
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">
                        Fuel Level
                      </p>
                      <p className="text-xs font-bold text-foreground mt-0.5">
                        {selectedVehicle.fuelLevel}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/80">
                    <span>
                      ETA: <strong>{selectedVehicle.eta}</strong>
                    </span>
                    <span>
                      Updated: <strong>{selectedVehicle.lastUpdated}</strong>
                    </span>
                  </div>

                  <Button
                    onClick={() => deleteMutation.mutate(selectedVehicle.id)}
                    disabled={deleteMutation.isPending}
                    variant="destructive"
                    className="w-full mt-2 h-9 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Decommission Vehicle
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
