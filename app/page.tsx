"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, useIsAuthenticated } from "@/store/authStore";

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (hasHydrated) {
      setIsChecking(false);
      if (isAuthenticated && user) {
        const rolePath = getRolePath(user.role);
        router.push(rolePath);
      } else {
        router.push("/login");
      }
    }
  }, [hasHydrated, isAuthenticated, user, router]);

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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
}

