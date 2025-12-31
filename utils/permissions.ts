import { ROLES } from "./constants";

export type Role = typeof ROLES[keyof typeof ROLES];

export function hasPermission(userRole: string, allowedRoles: readonly string[] | string[]): boolean {
  if (userRole === ROLES.OWNER) return true;
  return allowedRoles.includes(userRole.toLowerCase());
}

export function canAccessRoute(userRole: string, routeRoles: readonly string[] | string[]): boolean {
  return hasPermission(userRole, routeRoles);
}

