"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Building2, Calendar, Phone, MapPin } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { ROLE_LABELS } from "@/utils/constants";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user } = useAuthStore();

  // Mock profile data based on role
  const getProfileData = () => {
    if (!user) return null;

    const baseData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      roleLabel: ROLE_LABELS[user.role] || user.role,
      vineyardId: user.vineyardId,
      joinedDate: "2020-01-15",
      phone: "+91 98765 43210",
      location: "Maharashtra, India",
    };

    // Role-specific additional data
    const roleSpecificData: Record<string, any> = {
      owner: {
        ...baseData,
        phone: "+91 98765 43211",
        location: "Mumbai, Maharashtra",
        department: "Management",
        reportsTo: null,
        teamSize: 50,
        permissions: ["Full Access"],
      },
      hr: {
        ...baseData,
        phone: "+91 98765 43212",
        location: "Pune, Maharashtra",
        department: "Human Resources",
        reportsTo: "Vineyard Owner",
        teamSize: 5,
        permissions: ["Staff Management", "Attendance", "Leave Management"],
      },
      admin: {
        ...baseData,
        phone: "+91 98765 43213",
        location: "Mumbai, Maharashtra",
        department: "IT & Administration",
        reportsTo: "Vineyard Owner",
        teamSize: 3,
        permissions: ["System Administration", "User Management", "Settings"],
      },
      gm: {
        ...baseData,
        phone: "+91 98765 43214",
        location: "Sukhri Vineyard",
        department: "Operations",
        reportsTo: "Vineyard Owner",
        teamSize: 25,
        permissions: ["Operations Management", "CO₂ Management", "Inventory"],
      },
      vendor: {
        ...baseData,
        phone: "+91 98765 43215",
        location: "Delhi, India",
        department: "Procurement",
        reportsTo: "General Manager",
        company: "AgriSupply Co.",
        permissions: ["Purchase Orders", "Delivery Updates"],
      },
      cleaner: {
        ...baseData,
        phone: "+91 98765 43216",
        location: "Sukhri Vineyard",
        department: "Maintenance",
        reportsTo: "General Manager",
        shift: "Morning (7 AM - 3 PM)",
        permissions: ["Task Management"],
      },
      caretaker: {
        ...baseData,
        phone: "+91 98765 43217",
        location: "Sukhri Vineyard",
        department: "Vineyard Care",
        reportsTo: "General Manager",
        shift: "Day (8 AM - 5 PM)",
        permissions: ["Temperature Monitoring", "Vineyard Maintenance"],
      },
      "gas-filler": {
        ...baseData,
        phone: "+91 98765 43218",
        location: "Sukhri Vineyard",
        department: "CO₂ Management",
        reportsTo: "General Manager",
        shift: "Day (8 AM - 5 PM)",
        permissions: ["CO₂ Filling", "Barrel Management"],
      },
    };

    return roleSpecificData[user.role] || baseData;
  };

  const profileData = getProfileData();

  if (!user || !profileData) {
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
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Your account information and details
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile Card */}
          <Card className="border-border/50 lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Profile</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{profileData.name}</p>
                  <Badge variant="default" className="mt-2 text-xs px-2 py-0.5">
                    {profileData.roleLabel}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Card */}
          <Card className="border-border/50 lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2 border-b border-border/30">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-border/30">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{profileData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-border/30">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{profileData.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-border/30">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">{profileData.department || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b border-border/30">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Joined Date</p>
                    <p className="text-xs font-medium text-foreground mt-0.5">
                      {format(new Date(profileData.joinedDate), "MMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                {profileData.reportsTo && (
                  <div className="flex items-center gap-3 py-2 border-b border-border/30">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Reports To</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{profileData.reportsTo}</p>
                    </div>
                  </div>
                )}
                {profileData.shift && (
                  <div className="flex items-center gap-3 py-2 border-b border-border/30">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Shift</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{profileData.shift}</p>
                    </div>
                  </div>
                )}
                {profileData.company && (
                  <div className="flex items-center gap-3 py-2 border-b border-border/30">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="text-xs font-medium text-foreground mt-0.5">{profileData.company}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </MainLayout>
  );
}

