import { create } from "zustand";
import {
  defaultProfileSettings,
  defaultSystemSettings,
  defaultFleetThresholds,
} from "@/mocks/setting-data";
import type { ProfileSettings, SystemSettings, FleetThresholds } from "@/types/settings";

interface SettingsState {
  profile: ProfileSettings;
  system: SystemSettings;
  thresholds: FleetThresholds;
  updateProfile: (profile: Partial<ProfileSettings>) => void;
  updateSystem: (system: Partial<SystemSettings>) => void;
  updateThresholds: (thresholds: Partial<FleetThresholds>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  profile: defaultProfileSettings,
  system: defaultSystemSettings,
  thresholds: defaultFleetThresholds,
  updateProfile: (updates) =>
    set((state) => ({ profile: { ...state.profile, ...updates } })),
  updateSystem: (updates) =>
    set((state) => ({ system: { ...state.system, ...updates } })),
  updateThresholds: (updates) =>
    set((state) => ({ thresholds: { ...state.thresholds, ...updates } })),
}));
