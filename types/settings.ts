export interface ProfileSettings {
  fullName: string;
  email: string;
  role: string;
  phone: string;
  avatarUrl?: string;
}

export interface SystemSettings {
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  refreshInterval: number; // in seconds
  language: string;
}

export interface FleetThresholds {
  speedLimit: number;
  minFuelLevel: number;
  maxDriveHours: number;
}
