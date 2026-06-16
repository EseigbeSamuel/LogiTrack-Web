import type {
  StatCard,
  ShipmentPoint,
  DeliveryStatus,
  Fleet,
  ActivityEvent,
} from "@/types/dashboard";

/* ── KPI Stat Cards ── */
export const statCards: StatCard[] = [
  {
    id: "shipments",
    label: "Total Shipments",
    value: "1,284",
    rawValue: 1284,
    trend: 12.4,
    trendLabel: "vs last month",
    icon: "Package",
    color: "blue",
  },
  {
    id: "fleets",
    label: "Active Fleets",
    value: "47",
    rawValue: 47,
    trend: 3.2,
    trendLabel: "of 52 fleet",
    icon: "Truck",
    color: "emerald",
  },
  {
    id: "on-time",
    label: "On-Time Delivery",
    value: "94.2%",
    rawValue: 94.2,
    trend: 1.8,
    trendLabel: "vs last month",
    icon: "CheckCircle",
    color: "violet",
  },
  {
    id: "revenue",
    label: "Revenue MTD",
    value: "$2.41M",
    rawValue: 2410000,
    trend: -2.3,
    trendLabel: "vs last month",
    icon: "DollarSign",
    color: "amber",
  },
];

/* ── 30-day Shipment Trend ── */
function generateShipmentData(): ShipmentPoint[] {
  const data: ShipmentPoint[] = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const total = 35 + Math.floor(Math.random() * 25) + Math.round(Math.sin(i / 4) * 8);
    const delivered = Math.floor(total * (0.88 + Math.random() * 0.10));
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      shipments: total,
      delivered,
      pending: total - delivered,
    });
  }
  return data;
}

export const shipmentTrend: ShipmentPoint[] = generateShipmentData();

/* ── Delivery Status Donut ── */
export const deliveryStatus: DeliveryStatus[] = [
  { name: "Delivered",    value: 847, color: "#10b981" },
  { name: "In Transit",  value: 312, color: "#007AFF" },
  { name: "Pending",     value: 89,  color: "#f59e0b" },
  { name: "Delayed",     value: 36,  color: "#ef4444" },
];

/* ── Fleet Fleets ── */
export const fleetFleets: Fleet[] = [
  {
    id: "v-001",
    plate: "LGT-4821",
    driver: "Marcus Webb",
    route: "Lagos → Abuja",
    status: "on-route",
    progress: 68,
    eta: "2h 14m",
    cargo: "Electronics",
  },
  {
    id: "v-002",
    plate: "LGT-3344",
    driver: "Aisha Bello",
    route: "Port Harcourt → Enugu",
    status: "on-route",
    progress: 42,
    eta: "3h 55m",
    cargo: "FMCG",
  },
  {
    id: "v-003",
    plate: "LGT-7701",
    driver: "Chidi Okafor",
    route: "Kano Depot",
    status: "idle",
    progress: 0,
    eta: "—",
    cargo: "—",
  },
  {
    id: "v-004",
    plate: "LGT-2290",
    driver: "Funke Adeyemi",
    route: "Ibadan → Lagos",
    status: "delayed",
    progress: 55,
    eta: "+1h 20m",
    cargo: "Perishables",
  },
  {
    id: "v-005",
    plate: "LGT-5512",
    driver: "Emeka Eze",
    route: "Service Bay",
    status: "maintenance",
    progress: 0,
    eta: "—",
    cargo: "—",
  },
];

/* ── Recent Activity Feed ── */
export const activityFeed: ActivityEvent[] = [
  {
    id: "a-001",
    type: "delivered",
    title: "Shipment #SHP-8821 delivered",
    description: "Electronics order delivered to Abuja hub",
    timestamp: "2 min ago",
    fleet: "LGT-4821",
  },
  {
    id: "a-002",
    type: "departed",
    title: "LGT-3344 departed Port Harcourt",
    description: "En route to Enugu, ETA 3h 55m",
    timestamp: "18 min ago",
    fleet: "LGT-3344",
  },
  {
    id: "a-003",
    type: "delayed",
    title: "Delay alert — LGT-2290",
    description: "Traffic incident on Lagos–Ibadan Expressway",
    timestamp: "34 min ago",
    fleet: "LGT-2290",
  },
  {
    id: "a-004",
    type: "assigned",
    title: "New shipment #SHP-8922 assigned",
    description: "Perishable cargo assigned to Marcus Webb",
    timestamp: "1h ago",
  },
  {
    id: "a-005",
    type: "maintenance",
    title: "LGT-5512 sent to service bay",
    description: "Routine 10,000km maintenance check",
    timestamp: "2h ago",
    fleet: "LGT-5512",
  },
  {
    id: "a-006",
    type: "delivered",
    title: "Shipment #SHP-8800 delivered",
    description: "FMCG batch delivered to Kano distribution",
    timestamp: "3h ago",
  },
  {
    id: "a-007",
    type: "alert",
    title: "Fuel level low — LGT-7701",
    description: "Fleet at Kano depot, below 15% fuel",
    timestamp: "4h ago",
    fleet: "LGT-7701",
  },
  {
    id: "a-008",
    type: "departed",
    title: "LGT-1120 departed Lagos hub",
    description: "Carrying 2.4 tonnes of construction materials",
    timestamp: "5h ago",
  },
];
