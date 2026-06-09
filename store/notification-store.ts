import { create } from "zustand";
import { recentNotifications } from "@/mocks/notification-data";
import type { NotificationItem } from "@/types/notification";

interface NotificationState {
  notifications: NotificationItem[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (notification: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: recentNotifications,
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  addNotification: (newNotif) =>
    set((state) => {
      const id = `n-${String(state.notifications.length + 1).padStart(3, "0")}`;
      const notif: NotificationItem = {
        ...newNotif,
        id,
        timestamp: "Just now",
        read: false,
      };
      return { notifications: [notif, ...state.notifications] };
    }),
  clearNotifications: () => set({ notifications: [] }),
}));
