"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore, useIsAuthenticated } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);

  // Redirect if already authenticated
  useEffect(() => {
    if (hasHydrated && isAuthenticated) {
      const user = useAuthStore.getState().user;
      if (user) {
        const rolePath = getRolePath(user.role);
        router.push(rolePath);
      }
    }
  }, [hasHydrated, isAuthenticated, router]);

  function getRolePath(role: string): string {
    const roleMap: Record<string, string> = {
      owner: "/dashboard/owner",
      hr: "/dashboard/hr",
      admin: "/dashboard/admin",
      gm: "/dashboard/gm",
      vendor: "/dashboard/vendor",
      staff: "/dashboard/staff",
      cleaner: "/dashboard/staff",
      caretaker: "/dashboard/staff",
      "gas-filler": "/dashboard/staff",
    };
    return roleMap[role.toLowerCase()] || "/dashboard/staff";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        const user = useAuthStore.getState().user;
        const rolePath = getRolePath(user?.role || "");
        // Keep loading true during redirect - don't set it to false
        router.push(rolePath);
        // Loading will persist until page redirects
      } else {
        setError("Invalid email or password");
        setLoading(false);
      }
    } catch (err) {
      setError("Login failed. Please try again.");
      setLoading(false);
    }
  };


  const isStaffRole = (email: string) => {
    const staffEmails = ["cleaner", "caretaker", "gas-filler", "staff"];
    return staffEmails.some(role => email.toLowerCase().includes(role));
  };

  // Show full-screen loading overlay when signing in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg font-medium text-foreground">Signing in...</p>
          <p className="text-sm text-muted-foreground">Please wait while we sign you in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/sukri-dark-logo.png" 
                alt="Sukhri Vineyard Logo" 
                width={64} 
                height={64} 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sukhri Vineyard</CardTitle>
          <CardDescription>
            Sukhri Vineyard Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="owner@sukrivineyard.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-2">
              Demo Credentials:
            </p>
            <p className="text-xs text-muted-foreground text-center">
              owner@sukrivineyard.com / Admin@123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

