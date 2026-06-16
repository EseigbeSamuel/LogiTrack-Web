import { useFleetStore } from "@/store/fleet-store";
import { useSchedulerStore } from "@/store/scheduler-store";
import { useNotificationStore } from "@/store/notification-store";
import { useSettingsStore } from "@/store/settings-store";
import { statCards, shipmentTrend } from "@/mocks/dashboard-data";
import { logisticHubs } from "@/mocks/live-map-data";
import type { StatCard, ShipmentPoint, DeliveryStatus as IDeliveryStatus } from "@/types/dashboard";
import type { Fleet } from "@/types/fleet";
import type { ShipmentSchedule } from "@/types/scheduler";
import type { NotificationItem } from "@/types/notification";
import type { LogisticHub } from "@/types/live-map";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiClient = {
  // ── Dashboard ──
  getDashboardStats: async (): Promise<StatCard[]> => {
    await delay(600);
    // Dynamically adjust active fleets stat based on the store
    const fleets = useFleetStore.getState().fleets;
    const activeCount = fleets.filter((v) => v.status !== "idle" && v.status !== "maintenance").length;
    return statCards.map((card) => {
      if (card.id === "fleets") {
        return {
          ...card,
          value: String(activeCount),
          rawValue: activeCount,
          trendLabel: `of ${fleets.length} fleet`,
        };
      }
      return card;
    });
  },

  getShipmentTrend: async (): Promise<ShipmentPoint[]> => {
    await delay(500);
    return shipmentTrend;
  },

  getDeliveryStatus: async (): Promise<IDeliveryStatus[]> => {
    await delay(400);
    // Dynamically build delivery breakdown from scheduler schedules
    const schedules = useSchedulerStore.getState().schedules;
    const deliveredCount = schedules.filter((s) => s.status === "completed").length;
    const transitCount = schedules.filter((s) => s.status === "in-transit").length;
    const pendingCount = schedules.filter((s) => s.status === "scheduled").length;
    const delayedCount = useFleetStore.getState().fleets.filter((v) => v.status === "delayed").length;

    return [
      { name: "Delivered", value: 840 + deliveredCount, color: "#10b981" },
      { name: "In Transit", value: 310 + transitCount, color: "#CCFF00" },
      { name: "Pending", value: 80 + pendingCount, color: "#71717A" },
      { name: "Delayed", value: 30 + delayedCount, color: "#EAB308" },
    ];
  },

  // ── Fleet (Fleets) ──
  getFleets: async (): Promise<Fleet[]> => {
    await delay(600);
    return useFleetStore.getState().fleets;
  },

  addFleet: async (fleet: Omit<Fleet, "id" | "lastUpdated">): Promise<Fleet> => {
    await delay(800);
    useFleetStore.getState().addFleet(fleet);
    return useFleetStore.getState().fleets[0];
  },

  updateFleetStatus: async (id: string, status: Fleet["status"]): Promise<void> => {
    await delay(400);
    useFleetStore.getState().updateFleetStatus(id, status);
  },

  updateFleetDetails: async (id: string, updates: Partial<Fleet>): Promise<void> => {
    await delay(500);
    useFleetStore.getState().updateFleetDetails(id, updates);
  },

  removeFleet: async (id: string): Promise<void> => {
    await delay(600);
    useFleetStore.getState().removeFleet(id);
  },

  // ── Live Map ──
  getHubs: async (): Promise<LogisticHub[]> => {
    await delay(500);
    return logisticHubs;
  },

  // ── Scheduler ──
  getSchedules: async (): Promise<ShipmentSchedule[]> => {
    await delay(700);
    return useSchedulerStore.getState().schedules;
  },

  addSchedule: async (schedule: Omit<ShipmentSchedule, "id">): Promise<ShipmentSchedule> => {
    await delay(800);
    useSchedulerStore.getState().addSchedule(schedule);
    return useSchedulerStore.getState().schedules[0];
  },

  updateScheduleStatus: async (id: string, status: ShipmentSchedule["status"]): Promise<void> => {
    await delay(400);
    useSchedulerStore.getState().updateScheduleStatus(id, status);
  },

  // ── Notifications ──
  getNotifications: async (): Promise<NotificationItem[]> => {
    await delay(300);
    return useNotificationStore.getState().notifications;
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await delay(200);
    useNotificationStore.getState().markRead(id);
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await delay(400);
    useNotificationStore.getState().markAllRead();
  },

  clearNotifications: async (): Promise<void> => {
    await delay(400);
    useNotificationStore.getState().clearNotifications();
  },

  // ── Settings ──
  getSettings: async () => {
    await delay(400);
    const state = useSettingsStore.getState();
    return {
      profile: state.profile,
      system: state.system,
      thresholds: state.thresholds,
    };
  },

  updateProfile: async (updates: Partial<typeof useSettingsStore.getState.prototype.profile>): Promise<void> => {
    await delay(600);
    useSettingsStore.getState().updateProfile(updates);
  },

  updateSystemSettings: async (updates: Partial<typeof useSettingsStore.getState.prototype.system>): Promise<void> => {
    await delay(500);
    useSettingsStore.getState().updateSystem(updates);
  },

  updateFleetThresholds: async (updates: Partial<typeof useSettingsStore.getState.prototype.thresholds>): Promise<void> => {
    await delay(500);
    useSettingsStore.getState().updateThresholds(updates);
  },
};
