"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { User, Bell, Shield, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import type { ProfileSettings, SystemSettings, FleetThresholds } from "@/types/settings";

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const updateAuthProfile = useAuthStore((state) => state.updateProfile);

  // Queries
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: apiClient.getSettings,
  });

  // Local state for forms (synced from query on load)
  const [profile, setProfile] = useState<ProfileSettings>({ fullName: "", email: "", role: "", phone: "" });
  const [system, setSystem] = useState<SystemSettings>({
    theme: "dark",
    emailNotifications: true,
    pushNotifications: true,
    smsAlerts: false,
    refreshInterval: 30,
    language: "en",
  });
  const [thresholds, setThresholds] = useState<FleetThresholds>({ speedLimit: 90, minFuelLevel: 15, maxDriveHours: 10 });

  useEffect(() => {
    if (settings) {
      const timer = setTimeout(() => {
        setProfile(settings.profile);
        setSystem(settings.system);
        setThresholds(settings.thresholds);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [settings]);

  // Mutations
  const updateProfileMutation = useMutation({
    mutationFn: apiClient.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      // Sync auth-store profile too!
      updateAuthProfile(profile);
      toast.success("Profile settings updated.");
    },
  });

  const updateSystemMutation = useMutation({
    mutationFn: apiClient.updateSystemSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("System configurations updated.");
    },
  });

  const updateThresholdsMutation = useMutation({
    mutationFn: apiClient.updateFleetThresholds,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Fleet thresholds updated.");
    },
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  const handleSystemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemMutation.mutate(system);
  };

  const handleThresholdsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateThresholdsMutation.mutate(thresholds);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-muted-foreground animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="flex flex-col gap-6 select-none max-w-4xl mx-auto">
      
      {/* Header section */}
      <div className="p-4 border border-border bg-card rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-foreground">App Configuration</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Customize user profiles, notification alerts, and safety parameters.</p>
      </div>

      {/* Grid forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Profile Settings */}
        <div className="p-5 border border-border bg-card rounded-2xl shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3 select-none">
            <User size={16} className="text-primary" />
            Profile settings
          </h3>
          <form onSubmit={handleProfileSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</label>
              <Input
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Email Address</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Role title</label>
                <Input value={profile.role} readOnly className="h-9 text-xs bg-accent/20 cursor-default" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase">Phone Number</label>
                <Input
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="h-9 text-xs"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="mt-2 h-9 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* System Settings */}
        <div className="p-5 border border-border bg-card rounded-2xl shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3 select-none">
            <Bell size={16} className="text-primary" />
            System Preferences
          </h3>
          <form onSubmit={handleSystemSubmit} className="flex flex-col gap-4">
            {/* Email Switch */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-muted-foreground">Email alert summaries</span>
              <Switch
                checked={system.emailNotifications}
                onCheckedChange={(checked) => setSystem({ ...system, emailNotifications: checked })}
              />
            </div>

            {/* Push Switch */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-muted-foreground">Browser Push alerts</span>
              <Switch
                checked={system.pushNotifications}
                onCheckedChange={(checked) => setSystem({ ...system, pushNotifications: checked })}
              />
            </div>

            {/* SMS Switch */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-muted-foreground">SMS emergency notifications</span>
              <Switch
                checked={system.smsAlerts}
                onCheckedChange={(checked) => setSystem({ ...system, smsAlerts: checked })}
              />
            </div>

            <Button
              type="submit"
              disabled={updateSystemMutation.isPending}
              className="mt-1 h-9 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              {updateSystemMutation.isPending ? "Saving..." : "Save Preferences"}
            </Button>
          </form>
        </div>

        {/* Fleet Safety Thresholds */}
        <div className="p-5 border border-border bg-card rounded-2xl shadow-sm flex flex-col gap-4 md:col-span-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2 border-b border-border pb-3 select-none">
            <Shield size={16} className="text-primary" />
            Safety & Threshold parameters
          </h3>
          <form onSubmit={handleThresholdsSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Speed limit alert (km/h)</label>
              <Input
                type="number"
                value={thresholds.speedLimit}
                onChange={(e) => setThresholds({ ...thresholds, speedLimit: Number(e.target.value) })}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Low fuel alarm warning (%)</label>
              <Input
                type="number"
                value={thresholds.minFuelLevel}
                onChange={(e) => setThresholds({ ...thresholds, minFuelLevel: Number(e.target.value) })}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Max driving shifts (hours)</label>
              <Input
                type="number"
                value={thresholds.maxDriveHours}
                onChange={(e) => setThresholds({ ...thresholds, maxDriveHours: Number(e.target.value) })}
                className="h-9 text-xs"
                required
              />
            </div>
            <div className="sm:col-span-3 flex justify-end">
              <Button
                type="submit"
                disabled={updateThresholdsMutation.isPending}
                className="w-full sm:w-auto h-9 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save size={14} />
                {updateThresholdsMutation.isPending ? "Saving..." : "Update Thresholds"}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
