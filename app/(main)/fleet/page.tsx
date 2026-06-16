"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Plus, Trash2, Eye, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Fleet } from "@/types/fleet";

export default function FleetPage() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFleet, setSelectedFleet] = useState<Fleet | null>(null);

  // New fleet form state
  const [newFleet, setNewFleet] = useState({
    plate: "",
    driver: "",
    route: "",
    status: "idle" as Fleet["status"],
    progress: 0,
    cargo: "—",
    eta: "—",
    fuelLevel: 100,
    speed: 0,
    lat: 9.076,
    lng: 7.398,
  });

  // Queries
  const { data: fleets = [], isLoading } = useQuery({
    queryKey: ["fleets"],
    queryFn: apiClient.getFleets,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: apiClient.addFleet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      toast.success("Fleet registered successfully.");
      setShowAddForm(false);
      setNewFleet({
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
    mutationFn: ({ id, status }: { id: string; status: Fleet["status"] }) =>
      apiClient.updateFleetStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      toast.success("Fleet status updated.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: apiClient.removeFleet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fleets"] });
      setSelectedFleet(null);
      toast.success("Fleet decommissioned.");
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFleet.plate || !newFleet.driver || !newFleet.route) {
      toast.error("Please fill in plate, driver, and route.");
      return;
    }
    // Set ETA based on status
    const eta = newFleet.status === "on-route" ? "4h 30m" : "—";
    addMutation.mutate({ ...newFleet, eta });
  };

  const handleStatusChange = (id: string, status: Fleet["status"]) => {
    statusMutation.mutate({ id, status });
  };

  const filteredFleets = fleets.filter((v) => {
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
          Register Fleet
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
                <Button
                  key={tab}
                  variant="ghost"
                  onClick={() => setFilterStatus(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer",
                    filterStatus === tab
                      ? "bg-card text-foreground shadow-sm hover:bg-card"
                      : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                  )}
                >
                  {tab.replace("-", " ")}
                </Button>
              ),
            )}
          </div>

          {/* Table Container */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-x-auto">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
                Loading fleets...
              </div>
            ) : filteredFleets.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No fleets registered in this state.
              </div>
            ) : (
              <Table className="w-full text-left text-xs select-none">
                <TableHeader>
                  <TableRow className="border-b border-border bg-accent/20 text-muted-foreground font-semibold hover:bg-accent/20">
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Plate</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Driver</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Route</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Cargo</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Status</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Fuel</TableHead>
                    <TableHead className="p-4 h-auto text-right text-muted-foreground font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {filteredFleets.map((v) => (
                    <TableRow
                      key={v.id}
                      onClick={() => setSelectedFleet(v)}
                      className={cn(
                        "hover:bg-accent/10 transition-colors cursor-pointer",
                        selectedFleet?.id === v.id && "bg-primary/5",
                      )}
                    >
                      <TableCell className="p-4 font-mono font-bold text-primary">
                        {v.plate}
                      </TableCell>
                      <TableCell className="p-4 font-medium">{v.driver}</TableCell>
                      <TableCell className="p-4 font-medium text-muted-foreground">
                        {v.route}
                      </TableCell>
                      <TableCell className="p-4 text-muted-foreground">{v.cargo}</TableCell>
                      <TableCell className="p-4">
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
                      </TableCell>
                      <TableCell className="p-4 font-medium">
                        <span
                          className={cn(
                            v.fuelLevel < 20
                              ? "text-destructive font-bold"
                              : "text-foreground",
                          )}
                        >
                          {v.fuelLevel}%
                        </span>
                      </TableCell>
                      <TableCell
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedFleet(v)}
                            className="w-8 h-8 rounded text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Inspect Details"
                          >
                            <Eye size={14} className="hover:text-primary" />
                          </Button>
                          <Select
                            value={v.status}
                            onValueChange={(val) =>
                              handleStatusChange(v.id, val as Fleet["status"])
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Floating Forms / Details cards */}
        {(showAddForm || selectedFleet) && (
          <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
            {/* Form layout */}
            {showAddForm && (
              <div className="p-5 border border-border bg-card rounded-2xl shadow-lg flex flex-col gap-4 animate-in slide-in-from-right-3 duration-200">
                <div className="flex items-center justify-between border-b border-border pb-3 select-none">
                  <h3 className="font-bold text-sm text-foreground">
                    Register Fleet
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddForm(false)}
                    className="w-8 h-8 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </Button>
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
                      value={newFleet.plate}
                      onChange={(e) =>
                        setNewFleet({ ...newFleet, plate: e.target.value })
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
                      value={newFleet.driver}
                      onChange={(e) =>
                        setNewFleet({ ...newFleet, driver: e.target.value })
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
                      value={newFleet.route}
                      onChange={(e) =>
                        setNewFleet({ ...newFleet, route: e.target.value })
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
                      value={newFleet.cargo}
                      onChange={(e) =>
                        setNewFleet({ ...newFleet, cargo: e.target.value })
                      }
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      Initial Status
                    </label>
                    <Select
                      value={newFleet.status}
                      onValueChange={(val) =>
                        setNewFleet({
                          ...newFleet,
                          status: val as Fleet["status"],
                        })
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
            {selectedFleet && !showAddForm && (
              <div className="p-5 border border-border bg-card rounded-2xl shadow-lg flex flex-col gap-4 animate-in slide-in-from-right-3 duration-200">
                <div className="flex items-center justify-between border-b border-border pb-3 select-none">
                  <h3 className="font-bold text-sm text-foreground">
                    Unit Telemetry
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedFleet(null)}
                    className="w-8 h-8 text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-accent/25 p-3 rounded-xl">
                    <span className="text-xs font-mono font-bold text-primary">
                      {selectedFleet.plate}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold",
                        selectedFleet.status === "on-route" &&
                          "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5",
                        selectedFleet.status === "idle" &&
                          "text-zinc-600 bg-zinc-500/10 dark:text-zinc-400 dark:bg-zinc-500/5",
                        selectedFleet.status === "delayed" &&
                          "text-destructive bg-destructive/10 dark:bg-destructive/5",
                        selectedFleet.status === "maintenance" &&
                          "text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/5",
                      )}
                    >
                      {selectedFleet.status.replace("-", " ")}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Driver Profile
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {selectedFleet.driver}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Assigned Cargo
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {selectedFleet.cargo}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">
                      Trip Progress
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {selectedFleet.route}
                    </span>
                    {selectedFleet.progress > 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${selectedFleet.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {selectedFleet.progress}%
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
                        {selectedFleet.speed} km/h
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">
                        Fuel Level
                      </p>
                      <p className="text-xs font-bold text-foreground mt-0.5">
                        {selectedFleet.fuelLevel}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/80">
                    <span>
                      ETA: <strong>{selectedFleet.eta}</strong>
                    </span>
                    <span>
                      Updated: <strong>{selectedFleet.lastUpdated}</strong>
                    </span>
                  </div>

                  <Button
                    onClick={() => deleteMutation.mutate(selectedFleet.id)}
                    disabled={deleteMutation.isPending}
                    variant="destructive"
                    className="w-full mt-2 h-9 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    Decommission Fleet
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
