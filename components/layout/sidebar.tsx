"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Thermometer,
  Wind,
  Package,
  Truck,
  Users,
  FileText,
  Bot,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Camera,
  ListChecks,
  Cpu,
  UserCog,
  X,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { SIDEBAR_ITEMS } from "@/utils/constants";
import { useAuthStore } from "@/store/authStore";
import { canAccessRoute } from "@/utils/permissions";

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Thermometer,
  Wind,
  Package,
  Truck,
  Users,
  FileText,
  Bot,
  Calendar,
  Briefcase,
  Camera,
  ListChecks,
  Cpu,
  UserCog,
};

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen = false, onMobileClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sidebar-collapsed");
      return saved === "true";
    }
    return false;
  });
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const isMobileWidth = window.innerWidth < 768;
      setIsMobile(isMobileWidth);
    };
    // Check immediately
    if (typeof window !== "undefined") {
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Update CSS variable for main layout and persist state
  useEffect(() => {
    if (!isMobile) {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      collapsed ? "64px" : "256px"
    );
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", collapsed.toString());
    }
    } else {
      document.documentElement.style.setProperty("--sidebar-width", "0px");
    }
  }, [collapsed, isMobile]);

  // Close mobile sidebar when route changes
  useEffect(() => {
    if (isMobile && isMobileOpen && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Debug: Log sidebar state changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      console.log("Sidebar state:", { 
        isMobile, 
        isMobileOpen, 
        windowWidth: window.innerWidth,
        shouldShow: isMobile && isMobileOpen
      });
    }
  }, [isMobile, isMobileOpen]);

  const filteredItems = SIDEBAR_ITEMS.filter((item) => {
    // Explicitly exclude "My Attendance" for owner, hr, admin, gm, and vendor
    if (item.path === "/my-attendance") {
      const restrictedRoles = ["owner", "hr", "admin", "gm", "vendor"];
      if (user?.role && restrictedRoles.includes(user.role.toLowerCase())) {
        return false;
      }
    }
    // Explicitly show "My Applications" only for vendor role
    if (item.path === "/my-applications") {
      return user?.role?.toLowerCase() === "vendor";
    }
    return canAccessRoute(user?.role || "", item.roles);
  });

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && onMobileClose && (
        <div
          className="fixed inset-0 bg-black/50 z-[55] md:hidden"
          onClick={() => onMobileClose()}
        />
      )}
    <div
      className={cn(
          "fixed left-0 top-0 h-screen bg-card border-r border-border shadow-lg",
          isMobile
            ? cn(
                "z-[60] w-64 transition-transform duration-300 ease-in-out",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                "z-50 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
              )
      )}
        style={{
          willChange: isMobile ? 'transform' : undefined,
        }}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-border relative",
          collapsed && !isMobile ? "justify-center px-2" : "justify-between px-4"
        )}>
          {(!collapsed || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <Image 
                  src="/sukri-dark-logo.png" 
                  alt="Sukhri Vineyard Logo" 
                  width={32} 
                  height={32} 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-lg">Sukhri Vineyard</span>
            </div>
          )}
          {collapsed && !isMobile && (
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mx-auto overflow-hidden">
              <Image 
                src="/sukri-dark-logo.png" 
                alt="Sukhri Vineyard Logo" 
                width={32} 
                height={32} 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          {isMobile ? (
            <button
              onClick={() => onMobileClose?.()}
              className="p-1.5 rounded-md hover:bg-accent transition-colors"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          ) : (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "p-1.5 rounded-md hover:bg-accent transition-colors",
              collapsed ? "absolute top-1/2 -right-3 -translate-y-1/2 bg-background border border-border shadow-sm w-6 h-6 flex items-center justify-center" : ""
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-3 h-3" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto space-y-1 scrollbar-hide",
          (collapsed && !isMobile) ? "p-2" : "p-4"
        )} style={{ scrollBehavior: 'auto' }}>
          {filteredItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname?.startsWith(item.path);
            const getRolePath = (role: string): string => {
              const staffRoles = ["cleaner", "caretaker", "gas-filler", "staff"];
              if (staffRoles.includes(role)) {
                return "/dashboard/staff";
              }
              return `/dashboard/${role}`;
            };

            const rolePath = user?.role
              ? getRolePath(user.role)
              : "/dashboard";

            const href = item.path === "/dashboard" ? rolePath : item.path;

            return (
              <Link
                key={item.path}
                href={href}
                prefetch={true}
                onClick={(e) => {
                  // Prevent navigation and scroll if already on this page
                  if (pathname === href || pathname?.startsWith(item.path)) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "flex items-center rounded-lg transition-colors",
                  (collapsed && !isMobile)
                    ? "justify-center px-0 py-2.5 mx-auto w-10" 
                    : "gap-3 px-3 py-2.5",
                  isActive
                    ? (collapsed && !isMobile)
                      ? "bg-primary text-primary-foreground cursor-default"
                      : "bg-primary text-primary-foreground cursor-default"
                    : (collapsed && !isMobile)
                      ? "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={(collapsed && !isMobile) ? item.title : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {(!collapsed || isMobile) && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        {user && (
          <div className={cn(
            "border-t border-border",
            (collapsed && !isMobile) ? "p-2 pb-2" : "p-4"
          )}>
            {(collapsed && !isMobile) ? (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold mx-auto">
                {user.name.charAt(0)}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.role}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </>
  );
}

