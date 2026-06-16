import { create } from "zustand";
import { fleetFleets } from "@/mocks/fleet-data";
import type { Fleet } from "@/types/fleet";

interface FleetState {
  fleets: Fleet[];
  addFleet: (fleet: Omit<Fleet, "id" | "lastUpdated">) => void;
  updateFleetStatus: (id: string, status: Fleet["status"]) => void;
  updateFleetDetails: (id: string, updates: Partial<Fleet>) => void;
  removeFleet: (id: string) => void;
}

export const useFleetStore = create<FleetState>((set) => ({
  fleets: fleetFleets,
  addFleet: (newFleet) =>
    set((state) => {
      const id = `v-${String(state.fleets.length + 1).padStart(3, "0")}`;
      const fleet: Fleet = {
        ...newFleet,
        id,
        lastUpdated: "Just now",
      };
      return { fleets: [fleet, ...state.fleets] };
    }),
  updateFleetStatus: (id, status) =>
    set((state) => ({
      fleets: state.fleets.map((v) =>
        v.id === id ? { ...v, status, lastUpdated: "Just now" } : v
      ),
    })),
  updateFleetDetails: (id, updates) =>
    set((state) => ({
      fleets: state.fleets.map((v) =>
        v.id === id ? { ...v, ...updates, lastUpdated: "Just now" } : v
      ),
    })),
  removeFleet: (id) =>
    set((state) => ({
      fleets: state.fleets.filter((v) => v.id !== id),
    })),
}));
