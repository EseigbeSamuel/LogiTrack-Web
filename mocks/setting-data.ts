import type { ProfileSettings, SystemSettings, FleetThresholds } from "@/types/settings";

export const defaultProfileSettings: ProfileSettings = {
  fullName: "Alex Obi",
  email: "alex.obi@logitrack.com",
  role: "Fleet Manager",
  phone: "+234 812 345 6789",
  avatarUrl: "",
};

export const defaultSystemSettings: SystemSettings = {
  theme: "dark",
  emailNotifications: true,
  pushNotifications: true,
  smsAlerts: false,
  refreshInterval: 30,
  language: "en",
};

export const defaultFleetThresholds: FleetThresholds = {
  speedLimit: 90,
  minFuelLevel: 15,
  maxDriveHours: 10,
};
