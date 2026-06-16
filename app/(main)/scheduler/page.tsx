"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Plus, X } from "lucide-react";
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
import type { ShipmentSchedule } from "@/types/scheduler";

export default function SchedulerPage() {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Form State
  const [newSchedule, setNewSchedule] = useState({
    shipmentNumber: "",
    client: "",
    origin: "",
    destination: "",
    departureTime: "",
    estimatedDelivery: "",
    assignedFleet: "",
    status: "scheduled" as ShipmentSchedule["status"],
    priority: "medium" as ShipmentSchedule["priority"],
  });

  // Queries
  const { data: schedules = [], isLoading: schedulesLoading } = useQuery({
    queryKey: ["schedules"],
    queryFn: apiClient.getSchedules,
  });

  const { data: fleets = [], isLoading: fleetsLoading } = useQuery({
    queryKey: ["fleets"],
    queryFn: apiClient.getFleets,
  });

  // Mutations
  const addScheduleMutation = useMutation({
    mutationFn: apiClient.addSchedule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Shipment route scheduled successfully.");
      setShowAddForm(false);
      setNewSchedule({
        shipmentNumber: "",
        client: "",
        origin: "",
        destination: "",
        departureTime: "",
        estimatedDelivery: "",
        assignedFleet: "",
        status: "scheduled",
        priority: "medium",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ShipmentSchedule["status"];
    }) => apiClient.updateScheduleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
      toast.success("Schedule status updated.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !newSchedule.client ||
      !newSchedule.origin ||
      !newSchedule.destination ||
      !newSchedule.departureTime ||
      !newSchedule.assignedFleet
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // Generate shipment number
    const shpNumber = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;
    addScheduleMutation.mutate({
      ...newSchedule,
      shipmentNumber: shpNumber,
    });
  };

  const handleStatusChange = (
    id: string,
    status: ShipmentSchedule["status"],
  ) => {
    statusMutation.mutate({ id, status });
  };

  // Filtered schedules
  const filteredSchedules = schedules.filter((s) => {
    const priorityMatch =
      filterPriority === "all" || s.priority === filterPriority;
    const statusMatch = filterStatus === "all" || s.status === filterStatus;
    return priorityMatch && statusMatch;
  });

  const isPageLoading = schedulesLoading || fleetsLoading;

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-card rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Shipment Scheduler
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize dispatch times, select route destinations, and assign fleet
            vehicles.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 rounded-xl text-xs font-semibold px-4 py-2 cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          Schedule Route
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Main schedule table and filters */}
        <div className="flex-1 flex flex-col gap-4 w-full">
          {/* Dual filters selectors */}
          <div className="flex flex-wrap gap-4 items-center justify-between p-4 border border-border bg-card rounded-2xl shadow-sm">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Status Select */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  Status:
                </span>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32 h-8 text-[11px] rounded-lg">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      All States
                    </SelectItem>
                    <SelectItem value="scheduled" className="text-xs">
                      Scheduled
                    </SelectItem>
                    <SelectItem value="in-transit" className="text-xs">
                      In Transit
                    </SelectItem>
                    <SelectItem value="completed" className="text-xs">
                      Completed
                    </SelectItem>
                    <SelectItem value="cancelled" className="text-xs">
                      Cancelled
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Select */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase">
                  Priority:
                </span>
                <Select
                  value={filterPriority}
                  onValueChange={setFilterPriority}
                >
                  <SelectTrigger className="w-32 h-8 text-[11px] rounded-lg">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      All Priority
                    </SelectItem>
                    <SelectItem value="high" className="text-xs">
                      High
                    </SelectItem>
                    <SelectItem value="medium" className="text-xs">
                      Medium
                    </SelectItem>
                    <SelectItem value="low" className="text-xs">
                      Low
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-muted-foreground">
              {filteredSchedules.length} routes matching
            </span>
          </div>

          {/* Schedules Table */}
          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-x-auto">
            {isPageLoading ? (
              <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">
                Loading schedules...
              </div>
            ) : filteredSchedules.length === 0 ? (
              <div className="p-12 text-center text-xs text-muted-foreground">
                No shipments match these filters.
              </div>
            ) : (
              <Table className="w-full text-left text-xs select-none">
                <TableHeader>
                  <TableRow className="border-b border-border bg-accent/20 text-muted-foreground font-semibold hover:bg-accent/20">
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Shipment</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Client</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Route</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Fleet</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Priority</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Schedule Date</TableHead>
                    <TableHead className="p-4 h-auto text-muted-foreground font-semibold">Status</TableHead>
                    <TableHead className="p-4 h-auto text-right text-muted-foreground font-semibold">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                  {filteredSchedules.map((s) => (
                    <TableRow
                      key={s.id}
                      className="hover:bg-accent/10 transition-colors"
                    >
                      <TableCell className="p-4 font-mono font-bold text-primary">
                        {s.shipmentNumber}
                      </TableCell>
                      <TableCell className="p-4 font-medium">{s.client}</TableCell>
                      <TableCell className="p-4 font-medium text-muted-foreground">
                        {s.origin} → {s.destination}
                      </TableCell>
                      <TableCell className="p-4 font-mono font-semibold text-muted-foreground">
                        {s.assignedFleet}
                      </TableCell>
                      <TableCell className="p-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                            s.priority === "high" &&
                              "text-destructive bg-destructive/10 dark:bg-destructive/5",
                            s.priority === "medium" &&
                              "text-amber-600 bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/5",
                            s.priority === "low" &&
                              "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5",
                          )}
                        >
                          {s.priority}
                        </span>
                      </TableCell>
                      <TableCell className="p-4 text-muted-foreground font-medium">
                        {new Date(s.departureTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="p-4">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold",
                            s.status === "scheduled" &&
                              "text-zinc-600 bg-zinc-500/10 dark:text-zinc-400 dark:bg-zinc-500/5",
                            s.status === "in-transit" &&
                              "text-blue-600 bg-blue-500/10 dark:text-blue-400 dark:bg-blue-500/5",
                            s.status === "completed" &&
                              "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/5",
                            s.status === "cancelled" &&
                              "text-destructive bg-destructive/10 dark:bg-destructive/5",
                          )}
                        >
                          {s.status.replace("-", " ")}
                        </span>
                      </TableCell>
                      <TableCell
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Select
                          value={s.status}
                          onValueChange={(val) =>
                            handleStatusChange(
                              s.id,
                              val as ShipmentSchedule["status"],
                            )
                          }
                        >
                          <SelectTrigger className="w-24 h-7 text-[10px] rounded-lg ml-auto">
                            <SelectValue placeholder="Update" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled" className="text-xs">
                              Scheduled
                            </SelectItem>
                            <SelectItem value="in-transit" className="text-xs">
                              In Transit
                            </SelectItem>
                            <SelectItem value="completed" className="text-xs">
                              Completed
                            </SelectItem>
                            <SelectItem value="cancelled" className="text-xs">
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Schedule form popup */}
        {showAddForm && (
          <div className="w-full lg:w-80 shrink-0 p-5 border border-border bg-card rounded-2xl shadow-lg flex flex-col gap-4 animate-in slide-in-from-right-3 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3 select-none">
              <h3 className="font-bold text-sm text-foreground">
                Schedule Shipment
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

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Client Name
                </label>
                <Input
                  placeholder="e.g. Shoprite Logistics"
                  value={newSchedule.client}
                  onChange={(e) =>
                    setNewSchedule({ ...newSchedule, client: e.target.value })
                  }
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Origin
                  </label>
                  <Input
                    placeholder="Lagos Hub"
                    value={newSchedule.origin}
                    onChange={(e) =>
                      setNewSchedule({ ...newSchedule, origin: e.target.value })
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Destination
                  </label>
                  <Input
                    placeholder="Abuja Depot"
                    value={newSchedule.destination}
                    onChange={(e) =>
                      setNewSchedule({
                        ...newSchedule,
                        destination: e.target.value,
                      })
                    }
                    className="h-9 text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Departure Time
                </label>
                <Input
                  type="datetime-local"
                  value={newSchedule.departureTime}
                  onChange={(e) =>
                    setNewSchedule({
                      ...newSchedule,
                      departureTime: e.target.value,
                    })
                  }
                  className="h-9 text-xs"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">
                  Assign Fleet
                </label>
                <Select
                  value={newSchedule.assignedFleet}
                  onValueChange={(val) =>
                    setNewSchedule({ ...newSchedule, assignedFleet: val })
                  }
                >
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select Fleet Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {fleets.map((v) => (
                      <SelectItem
                        key={v.id}
                        value={v.plate}
                        className="text-xs"
                      >
                        {v.plate} — {v.driver} ({v.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    Priority
                  </label>
                  <Select
                    value={newSchedule.priority}
                    onValueChange={(val) =>
                      setNewSchedule({
                        ...newSchedule,
                        priority: val as ShipmentSchedule["priority"],
                      })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="text-xs">
                        Low
                      </SelectItem>
                      <SelectItem value="medium" className="text-xs">
                        Medium
                      </SelectItem>
                      <SelectItem value="high" className="text-xs">
                        High
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    State
                  </label>
                  <Select
                    value={newSchedule.status}
                    onValueChange={(val) =>
                      setNewSchedule({
                        ...newSchedule,
                        status: val as ShipmentSchedule["status"],
                      })
                    }
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled" className="text-xs">
                        Scheduled
                      </SelectItem>
                      <SelectItem value="in-transit" className="text-xs">
                        In Transit
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={addScheduleMutation.isPending}
                className="w-full mt-2 h-9 text-xs font-semibold cursor-pointer"
              >
                {addScheduleMutation.isPending
                  ? "Scheduling..."
                  : "Dispatch Schedule"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
