import { create } from "zustand";
import { shipmentSchedules } from "@/mocks/scheduler-data";
import type { ShipmentSchedule } from "@/types/scheduler";

interface SchedulerState {
  schedules: ShipmentSchedule[];
  addSchedule: (schedule: Omit<ShipmentSchedule, "id">) => void;
  updateScheduleStatus: (id: string, status: ShipmentSchedule["status"]) => void;
  removeSchedule: (id: string) => void;
}

export const useSchedulerStore = create<SchedulerState>((set) => ({
  schedules: shipmentSchedules,
  addSchedule: (newSchedule) =>
    set((state) => {
      const id = `s-${String(state.schedules.length + 1).padStart(3, "0")}`;
      const schedule: ShipmentSchedule = {
        ...newSchedule,
        id,
      };
      return { schedules: [schedule, ...state.schedules] };
    }),
  updateScheduleStatus: (id, status) =>
    set((state) => ({
      schedules: state.schedules.map((s) =>
        s.id === id ? { ...s, status } : s
      ),
    })),
  removeSchedule: (id) =>
    set((state) => ({
      schedules: state.schedules.filter((s) => s.id !== id),
    })),
}));
