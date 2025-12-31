"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { TOAIWidget } from "@/components/ai-assistant/toai-widget";
import { useAuthStore, useIsAuthenticated } from "@/store/authStore";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const hasHydrated = useAuthStore((state) => state._hasHydrated);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Check if user role should see TOAI widget
  // Only show for owner, hr, admin, and gm roles
  const allowedRolesForTOAI = ["owner", "hr", "admin", "gm"];
  const shouldShowTOAI = user?.role && 
    allowedRolesForTOAI.includes(user.role.toLowerCase());

  // Only check auth once on mount, not on every render
  useEffect(() => {
    if (hasHydrated) {
      setIsChecking(false);
      if (!isAuthenticated) {
        router.push("/login");
      }
    }
  }, [hasHydrated]); // Removed isAuthenticated and router from deps to prevent re-runs

  // Show loading state only on initial load
  if (!hasHydrated || (isChecking && pathname !== "/login")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect if not authenticated (but don't render anything to avoid flash)
  if (!isAuthenticated && pathname !== "/login") {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden w-full">
      <Sidebar 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col transition-all duration-300 md:ml-[var(--sidebar-width,256px)] min-w-0 w-full max-w-full">
        <Header onMobileMenuClick={() => {
          console.log("Mobile menu clicked, opening sidebar");
          setIsMobileSidebarOpen(true);
        }} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-background p-3 sm:p-4 md:p-6 min-w-0 w-full max-w-full">
          <div className="w-full min-w-0 max-w-full">
          {children}
          </div>
        </main>
      </div>
      {shouldShowTOAI && <TOAIWidget />}
    </div>
  );
}

