import { create } from "zustand";
import { fleetVehicles } from "@/mocks/vehicle-data";
import type { Vehicle } from "@/types/vehicle";

interface FleetState {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, "id" | "lastUpdated">) => void;
  updateVehicleStatus: (id: string, status: Vehicle["status"]) => void;
  updateVehicleDetails: (id: string, updates: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
}

export const useFleetStore = create<FleetState>((set) => ({
  vehicles: fleetVehicles,
  addVehicle: (newVehicle) =>
    set((state) => {
      const id = `v-${String(state.vehicles.length + 1).padStart(3, "0")}`;
      const vehicle: Vehicle = {
        ...newVehicle,
        id,
        lastUpdated: "Just now",
      };
      return { vehicles: [vehicle, ...state.vehicles] };
    }),
  updateVehicleStatus: (id, status) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, status, lastUpdated: "Just now" } : v
      ),
    })),
  updateVehicleDetails: (id, updates) =>
    set((state) => ({
      vehicles: state.vehicles.map((v) =>
        v.id === id ? { ...v, ...updates, lastUpdated: "Just now" } : v
      ),
    })),
  removeVehicle: (id) =>
    set((state) => ({
      vehicles: state.vehicles.filter((v) => v.id !== id),
    })),
}));
