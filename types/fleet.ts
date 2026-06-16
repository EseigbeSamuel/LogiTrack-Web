export interface Fleet {
  id: string;
  plate: string;
  driver: string;
  route: string;
  status: "on-route" | "idle" | "maintenance" | "delayed";
  progress: number; // 0–100
  eta: string;
  cargo: string;
  lat: number;
  lng: number;
  fuelLevel: number; // percentage 0-100
  speed: number; // km/h
  lastUpdated: string;
}
