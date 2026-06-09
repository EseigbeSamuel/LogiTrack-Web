export interface ShipmentSchedule {
  id: string;
  shipmentNumber: string;
  client: string;
  origin: string;
  destination: string;
  departureTime: string;
  estimatedDelivery: string;
  assignedVehicle: string;
  status: "scheduled" | "in-transit" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
}
