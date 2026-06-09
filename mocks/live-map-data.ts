import type { LogisticHub } from "@/types/live-map";

export const logisticHubs: LogisticHub[] = [
  {
    id: "h-001",
    name: "Lagos Central Hub",
    lat: 6.5244,
    lng: 3.3792,
    status: "active",
    packagesCount: 1450,
  },
  {
    id: "h-002",
    name: "Abuja Depot",
    lat: 9.0765,
    lng: 7.3986,
    status: "active",
    packagesCount: 890,
  },
  {
    id: "h-003",
    name: "Kano Distribution Center",
    lat: 12.0022,
    lng: 8.5920,
    status: "full",
    packagesCount: 2200,
  },
  {
    id: "h-004",
    name: "Port Harcourt Terminal",
    lat: 4.8156,
    lng: 7.0498,
    status: "maintenance",
    packagesCount: 310,
  },
];
