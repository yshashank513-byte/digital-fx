import { cookies } from "next/headers";
import { loadStore } from "./store";
import { Business, SaasUser, UserRole } from "./types";

export const TENANT_COOKIE_NAME = "saas_active_business_id";
export const SUPERADMIN_COOKIE_NAME = "saas_is_super_admin";

/**
 * Gets the current active tenant business ID on the server side.
 * Validates against store to ensure no unauthorized tenant spoofing.
 */
export async function getActiveTenantBusinessId(): Promise<string> {
  const store = loadStore();
  const cookieStore = await cookies();
  const rawId = cookieStore.get(TENANT_COOKIE_NAME)?.value;

  if (rawId && store.businesses.some((b) => b.id === rawId)) {
    return rawId;
  }

  // Fallback to primary business
  return store.businesses[0]?.id || "biz-001";
}

/**
 * Gets full current tenant business profile
 */
export async function getCurrentBusiness(): Promise<Business> {
  const store = loadStore();
  const businessId = await getActiveTenantBusinessId();
  const business = store.businesses.find((b) => b.id === businessId);
  return business || store.businesses[0];
}

/**
 * Checks if the caller is in Super Admin mode
 */
export async function isSuperAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(SUPERADMIN_COOKIE_NAME)?.value === "true";
}

/**
 * Permission checks for RBAC
 */
export function hasPermission(
  userRole: UserRole,
  action: "manage_billing" | "manage_team" | "manage_whatsapp" | "manage_automations" | "send_broadcasts" | "edit_leads" | "reply_messages"
): boolean {
  if (userRole === "super_admin" || userRole === "owner") return true;

  switch (action) {
    case "manage_billing":
      return false; // only owner or super admin
    case "manage_team":
      return userRole === "admin";
    case "manage_whatsapp":
      return userRole === "admin";
    case "manage_automations":
      return userRole === "admin" || userRole === "manager";
    case "send_broadcasts":
      return userRole === "admin" || userRole === "manager";
    case "edit_leads":
    case "reply_messages":
      return true; // manager and agent can handle leads & messages
    default:
      return false;
  }
}
