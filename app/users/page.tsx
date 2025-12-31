"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, UserPlus, Mail, User, Shield } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { ROLE_LABELS } from "@/utils/constants";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  vineyardId?: string;
  createdAt: string;
  createdBy?: string;
}

export default function UsersPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { usersService } = await import('@/api');
        const usersData = await usersService.getAll();
        setUsers(usersData.map((u: any) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          vineyardId: u.vineyardId || 'sukhri',
          createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          createdBy: u.createdByUserId || u.createdBy?.id || null,
        })));
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load users. Please refresh the page.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Mock users data - REMOVED - now using database
  /* const [users, setUsers] = useState<UserRecord[]>([
    {
      id: "1",
      email: "owner@sukrivineyard.com",
      name: "Vineyard Owner",
      role: "owner",
      vineyardId: "all",
      createdAt: "2024-01-01",
      createdBy: undefined, // System created
    },
    {
      id: "2",
      email: "hr@sukrivineyard.com",
      name: "HR Manager",
      role: "hr",
      vineyardId: "sukhri",
      createdAt: "2024-01-15",
      createdBy: "1", // Created by owner/admin
    },
    {
      id: "3",
      email: "admin@sukrivineyard.com",
      name: "System Admin",
      role: "admin",
      vineyardId: "sukhri",
      createdAt: "2024-01-10",
      createdBy: "1", // Created by owner
    },
    {
      id: "4",
      email: "gm@sukrivineyard.com",
      name: "General Manager",
      role: "gm",
      vineyardId: "sukhri",
      createdAt: "2024-01-12",
      createdBy: "1", // Created by owner
    },
    {
      id: "6",
      email: "cleaner@sukrivineyard.com",
      name: "John Cleaner",
      role: "cleaner",
      vineyardId: "sukhri",
      createdAt: "2024-01-20",
      createdBy: "2", // Created by HR
    },
    {
      id: "7",
      email: "caretaker@sukrivineyard.com",
      name: "Sarah Caretaker",
      role: "caretaker",
      vineyardId: "sukhri",
      createdAt: "2024-01-21",
      createdBy: "2", // Created by HR
    },
    {
      id: "8",
      email: "gasfiller@sukrivineyard.com",
      name: "Mike Gas Filler",
      role: "gas-filler",
      vineyardId: "sukhri",
      createdAt: "2024-01-22",
      createdBy: "2", // Created by HR
    },
  ]); */

  // Determine what roles the current user can create
  const getCreatableRoles = () => {
    if (!user) return [];
    switch (user.role) {
      case "owner":
        return ["gm", "admin", "hr", "staff", "cleaner", "caretaker", "gas-filler"];
      case "admin":
        return ["hr", "gm", "staff", "cleaner", "caretaker", "gas-filler"];
      case "hr":
        return ["staff", "cleaner", "caretaker", "gas-filler"];
      default:
        return [];
    }
  };

  // Determine what users the current user can see
  const visibleUsers = useMemo(() => {
    if (!user) return [];
    
    // Owner, Admin, HR, and GM can see all users (excluding owner role itself)
    if (["owner", "admin", "hr", "gm"].includes(user.role)) {
      return users.filter((u) => u.role !== "owner");
    }
    
    return [];
  }, [user, users]);

  const canCreateUsers = () => {
    if (!user) return false;
    return ["owner", "admin", "hr"].includes(user.role);
  };

  // Get creator name by ID
  const getCreatorName = (creatorId?: string | null) => {
    if (!creatorId) return "Owner";
    const creator = users.find((u) => u.id === creatorId);
    if (creator) return creator.name;
    // If creator not in list, check if it's current user
    if (creatorId === user?.id) return user.name;
    return "Owner";
  };

  const handleCreateUser = async () => {
    // Validation
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.password) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill all required fields",
      });
      return;
    }

    // Name validation
    if (newUser.name.trim().length < 2) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Name must be at least 2 characters long",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a valid email address",
      });
      return;
    }

    // Password validation
    if (newUser.password.length < 6) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Password must be at least 6 characters long",
      });
      return;
    }

    try {
      const { usersService } = await import('@/api');
      const createdUser = await usersService.create({
        email: newUser.email,
        password: newUser.password,
        name: newUser.name,
        role: newUser.role,
        vineyardId: user?.vineyardId || "sukhri",
        createdBy: user?.id,
      });

      // Refresh users list
      const usersData = await usersService.getAll();
      setUsers(usersData.map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        vineyardId: u.vineyardId || 'sukhri',
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        createdBy: u.createdByUserId || u.createdBy?.id || null,
      })));

      setNewUser({ name: "", email: "", role: "", password: "" });
      setIsDialogOpen(false);
      toast({
        variant: "success",
        title: "Success",
        description: "User created successfully",
      });
    } catch (error: any) {
      console.error('Failed to create user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || error.message || "Failed to create user. Please try again.",
      });
    }
  };

  const creatableRoles = getCreatableRoles();

  return (
    <MainLayout>
      <div className="space-y-5">
        <div className="pb-1">
          <h1 className="text-xl font-semibold text-foreground">User Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-normal">
            Manage users and their roles based on your permissions
          </p>
        </div>

        {canCreateUsers() && (
          <div className="flex justify-end">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </div>
        )}

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              {user?.role === "hr" && "Staff Members"}
              {user?.role === "admin" && "HR Managers"}
              {(user?.role === "owner" || user?.role === "gm") && "Users"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {visibleUsers.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                No users found. {canCreateUsers() && "Create your first user to get started."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Name
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Created Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleUsers.map((userRecord) => (
                      <tr
                        key={userRecord.id}
                        className="border-b border-border/30 hover:bg-accent/30 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-sm font-medium text-foreground">
                          {userRecord.name}
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground">
                          {userRecord.email}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge
                            variant="outline"
                            className="text-xs px-2 py-0.5"
                          >
                            {ROLE_LABELS[userRecord.role] || userRecord.role}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground">
                          {getCreatorName(userRecord.createdBy)}
                        </td>
                        <td className="py-2.5 px-3 text-sm text-muted-foreground">
                          {format(new Date(userRecord.createdAt), "MMM dd, yyyy")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {canCreateUsers() && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Create New User
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Role
                </label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {creatableRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role] || role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setNewUser({ name: "", email: "", role: "", password: "" });
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleCreateUser}
                >
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        )}
      </div>
    </MainLayout>
  );
}
