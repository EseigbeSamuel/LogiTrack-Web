export interface LogisticHub {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "active" | "full" | "maintenance";
  packagesCount: number;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  type: "fleet" | "hub";
  status?: string;
  details?: string;
}
