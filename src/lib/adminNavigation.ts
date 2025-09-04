import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  Key, 
  BarChart3, 
  Activity,
  Menu,
  Link
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
  { icon: LayoutDashboard, label: "仪表板", id: "dashboard" },
  { icon: Users, label: "用户管理", id: "users" },
  { icon: Shield, label: "角色管理", id: "roles" },
  { icon: Key, label: "权限管理", id: "permissions" },
  { icon: Menu, label: "菜单管理", id: "menus" },
  { icon: Link, label: "角色权限关系", id: "role-permissions" },
  { icon: BarChart3, label: "数据统计", id: "analytics" },
  { icon: Activity, label: "审计日志", id: "audit" },
  { icon: Settings, label: "系统设置", id: "settings" },
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
    case "menus":
      navigate({ to: "/admin/menus" })
      break
    case "role-permissions":
      navigate({ to: "/admin/role-permissions" })
      break
    case "analytics":
      // navigate({ to: "/admin/analytics" })
      break
    case "audit":
      // navigate({ to: "/admin/audit" })
      break
    case "settings":
      // navigate({ to: "/admin/settings" })
      break
    case "dashboard":
    default:
      navigate({ to: "/admin" })
      break
  }
}