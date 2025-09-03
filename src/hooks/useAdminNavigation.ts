import { useState, useEffect, useMemo } from 'react'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Shield, 
  Key, 
  BarChart3, 
  Activity,
  Menu,
  type LucideIcon
} from 'lucide-react'
import { getUserMenuTree } from '@/services/authService'

// Icon mapping for menu items
const iconMap: Record<string, LucideIcon> = {
  'LayoutDashboard': LayoutDashboard,
  'dashboard': LayoutDashboard,
  'Users': Users,
  'users': Users,
  'Shield': Shield,
  'roles': Shield,
  'permissions': Shield,
  'Key': Key,
  'applications': Key,
  'Menu': Menu,
  'menus': Menu,
  'BarChart3': BarChart3,
  'analytics': BarChart3,
  'Activity': Activity,
  'audit': Activity,
  'Settings': Settings,
  'settings': Settings,
}

export interface AdminNavItem {
  icon: LucideIcon
  label: string
  id: string
  active?: boolean
  menuPath?: string
  sortOrder?: number
  visible?: boolean
}

export function useAdminNavigation() {
  const [menuItems, setMenuItems] = useState<AdminNavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        setError(null)
        const menuTree = await getUserMenuTree()
        
        // Convert MenuNode records to AdminNavItem array
        const items: AdminNavItem[] = Object.values(menuTree)
          .filter(menu => menu.visible && menu.menuType === 1) // Only visible menu items (not directories or buttons)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(menu => ({
            icon: iconMap[menu.menuIcon] || iconMap[menu.menuPath] || LayoutDashboard,
            label: menu.menuName,
            id: menu.menuPath.replace('/admin/', '').replace('/', ''), // Extract ID from path
            menuPath: menu.menuPath,
            sortOrder: menu.sortOrder,
            visible: menu.visible
          }))

        setMenuItems(items)
      } catch (err) {
        console.error('Failed to fetch admin menu items:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch menu items')
        
        // Fallback to default menu items
        const defaultItems: AdminNavItem[] = [
          { icon: LayoutDashboard, label: "仪表板", id: "dashboard" },
          { icon: Users, label: "用户管理", id: "users" },
          { icon: Shield, label: "角色管理", id: "roles" },
          { icon: Key, label: "权限管理", id: "permissions" },
          { icon: Menu, label: "菜单管理", id: "menus" },
          { icon: BarChart3, label: "数据统计", id: "analytics" },
          { icon: Activity, label: "审计日志", id: "audit" },
          { icon: Settings, label: "系统设置", id: "settings" },
        ]
        setMenuItems(defaultItems)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  // Memoize the result to avoid unnecessary re-renders
  const result = useMemo(() => ({
    menuItems,
    loading,
    error,
    refreshMenuItems: () => {
      setLoading(true)
      getUserMenuTree().then(menuTree => {
        const items: AdminNavItem[] = Object.values(menuTree)
          .filter(menu => menu.visible && menu.menuType === 1)
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map(menu => ({
            icon: iconMap[menu.menuIcon] || iconMap[menu.menuPath] || LayoutDashboard,
            label: menu.menuName,
            id: menu.menuPath.replace('/admin/', '').replace('/', ''),
            menuPath: menu.menuPath,
            sortOrder: menu.sortOrder,
            visible: menu.visible
          }))
        setMenuItems(items)
      }).catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to refresh menu items')
      }).finally(() => {
        setLoading(false)
      })
    }
  }), [menuItems, loading, error])

  return result
}