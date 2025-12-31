"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Bell, Shield, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function SettingsPage() {
  const { user } = useAuthStore();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">No user data available</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-foreground">Name</label>
                  <input
                    type="text"
                    className="w-full mt-1 px-3 py-2 text-xs border border-input rounded-md bg-background"
                    defaultValue={user.name}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    className="w-full mt-1 px-3 py-2 text-xs border border-input rounded-md bg-background"
                    defaultValue={user.email}
                  />
                </div>
                <Button size="sm" className="text-xs h-7">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">Email Notifications</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">CO₂ Alerts</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground">Low Stock Alerts</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <Button size="sm" variant="outline" className="text-xs h-7 w-full">
                  Change Password
                </Button>
                <Button size="sm" variant="outline" className="text-xs h-7 w-full">
                  Two-Factor Authentication
                </Button>
              </div>
            </CardContent>
          </Card>

          {(user.role === "owner" || user.role === "admin") && (
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  System
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">System Version</p>
                    <p className="text-xs font-medium">v1.0.0</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Backup</p>
                    <p className="text-xs font-medium">2024-01-17 10:30 AM</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs h-7 w-full">
                    Backup Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

