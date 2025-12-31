export const ROLES = {
  OWNER: "owner",
  HR: "hr",
  ADMIN: "admin",
  GM: "gm",
  VENDOR: "vendor",
  STAFF: "staff",
  CLEANER: "cleaner",
  CARETAKER: "caretaker",
  GAS_FILLER: "gas-filler",
} as const;

export const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  hr: "HR Manager",
  admin: "Administrator",
  gm: "General Manager",
  vendor: "Vendor",
  staff: "Staff",
  cleaner: "Cleaner",
  caretaker: "Caretaker",
  "gas-filler": "Gas Filler",
};

export const VINEYARDS = [
  { id: "all", name: "All Vineyards" },
  { id: "sukhri", name: "Sukhri Vineyard" },
  { id: "future1", name: "Future Farm 1" },
  { id: "future2", name: "Future Farm 2" },
] as const;

export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    icon: "LayoutDashboard",
    path: "/dashboard",
    roles: ["owner", "hr", "admin", "gm", "vendor", "staff", "cleaner", "caretaker", "gas-filler"],
  },
  {
    title: "Temperature & Weather",
    icon: "Thermometer",
    path: "/temperature",
    roles: ["owner", "hr", "gm", "admin", "caretaker"],
  },
  {
    title: "CO₂ Management",
    icon: "Wind",
    path: "/co2",
    roles: ["owner", "hr", "gm", "admin", "gas-filler"],
  },
  {
    title: "Inventory",
    icon: "Package",
    path: "/inventory",
    roles: ["owner", "hr", "gm", "admin", "staff"],
  },
  {
    title: "Vendors & Procurement",
    icon: "Truck",
    path: "/vendors",
    roles: ["owner", "hr", "gm", "admin", "vendor"],
  },
  {
    title: "My Applications",
    icon: "Briefcase",
    path: "/my-applications",
    roles: ["vendor"],
  },
  {
    title: "Staff & Attendance",
    icon: "Users",
    path: "/attendance",
    roles: ["owner", "hr", "admin", "gm"],
  },
  {
    title: "Reports",
    icon: "FileText",
    path: "/reports",
    roles: ["owner", "hr", "gm", "admin"],
  },
  {
    title: "TOAI Assistant",
    icon: "Bot",
    path: "/ai-assistant",
    roles: ["owner", "hr", "gm", "admin"],
  },
  {
    title: "My Attendance",
    icon: "Calendar",
    path: "/my-attendance",
    roles: ["cleaner", "caretaker", "gas-filler", "staff"],
  },
  {
    title: "Camera Monitoring",
    icon: "Camera",
    path: "/cameras",
    roles: ["owner", "hr", "gm", "admin"],
  },
  {
    title: "Task Management",
    icon: "ListChecks",
    path: "/tasks",
    roles: ["owner", "gm", "admin"],
  },
  {
    title: "Hardware Requirements",
    icon: "Cpu",
    path: "/hardware",
    roles: ["owner", "hr", "gm", "admin"],
  },
  {
    title: "User Management",
    icon: "UserCog",
    path: "/users",
    roles: ["owner", "hr", "gm", "admin"],
  },
] as const;

