export interface StatCard {
  id: string;
  label: string;
  value: string;
  rawValue: number;
  trend: number; // percentage change, positive = up
  trendLabel: string;
  icon: string;
  color: "blue" | "emerald" | "violet" | "amber";
}

export interface ShipmentPoint {
  date: string;
  shipments: number;
  delivered: number;
  pending: number;
}

export interface DeliveryStatus {
  name: string;
  value: number;
  color: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  driver: string;
  route: string;
  status: "on-route" | "idle" | "maintenance" | "delayed";
  progress: number; // 0–100
  eta: string;
  cargo: string;
}

export interface ActivityEvent {
  id: string;
  type: "delivered" | "departed" | "delayed" | "assigned" | "alert" | "maintenance";
  title: string;
  description: string;
  timestamp: string;
  vehicle?: string;
}
