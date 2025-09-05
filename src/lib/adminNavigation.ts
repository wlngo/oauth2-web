import { 
  Users, 
  Shield, 
  Key,
  Settings
} from "lucide-react"

import type { LucideIcon } from "lucide-react"

export interface AdminNavItem {
  icon: LucideIcon
  label: string
  id: string
  active?: boolean
}

// Base admin navigation items (without active state)
export const adminNavItemsBase: Omit<AdminNavItem, 'active'>[] = [
  { icon: Users, label: "用户管理", id: "users" },
  { icon: Shield, label: "角色管理", id: "roles" },
  { icon: Key, label: "权限管理", id: "permissions" },
  { icon: Settings, label: "OAuth2客户端", id: "oauth2-clients" },
]

/**
 * Get admin navigation items with specified active item
 * @param activeId - ID of the item to mark as active
 * @returns Array of navigation items with active state
 */
export function getAdminNavItems(activeId: string): AdminNavItem[] {
  return adminNavItemsBase.map(item => ({
    ...item,
    active: item.id === activeId
  }))
}

/**
 * Navigation handler for admin routes
 * @param id - Navigation item ID
 * @param navigate - Navigation function from router
 */
export function handleAdminNavigation(id: string, navigate: (options: { to: string }) => void) {
  // 根据导航项ID进行路由跳转
  switch (id) {
    case "users":
      navigate({ to: "/admin/users" })
      break
    case "roles":
      navigate({ to: "/admin/roles" })
      break
    case "permissions":
      navigate({ to: "/admin/permissions" })
      break
    case "oauth2-clients":
      navigate({ to: "/admin/oauth2-clients" })
      break
    default:
      navigate({ to: "/admin/users" }) // Default to users management
      break
  }
}