import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { 
  ArrowLeft, 
  User, 
  LogOut,
  Menu as MenuIcon,
  Loader2
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarNav,
  SidebarNavItem,
  SidebarMain,
  SidebarToggle,
} from "@/components/ui/sidebar"
import { getUserMenuTree, type MenuNode } from "@/services/authService"

interface DynamicSidebarProps {
  children: React.ReactNode
  headerTitle: string
  headerSubtitle: string
  currentPage?: string
  showBackToHome?: boolean
}

export default function DynamicSidebar({ 
  children, 
  headerTitle, 
  headerSubtitle, 
  currentPage,
  showBackToHome = true 
}: DynamicSidebarProps) {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState<MenuNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load user menu tree
  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true)
        const menuTree = await getUserMenuTree()
        
        // Convert the record to array and sort by sortOrder
        const menuArray = Object.values(menuTree).sort((a, b) => a.sortOrder - b.sortOrder)
        
        // Filter visible menus only
        const visibleMenus = menuArray.filter(menu => menu.visible)
        
        setMenuItems(visibleMenus)
      } catch (err) {
        console.error('Failed to load menu tree:', err)
        setError(err instanceof Error ? err.message : 'Failed to load menus')
      } finally {
        setLoading(false)
      }
    }

    loadMenus()
  }, [])

  const handleNavigation = (menuPath: string) => {
    navigate({ to: menuPath })
  }

  const goHome = () => {
    navigate({ to: "/" })
  }

  const goToProfile = () => {
    navigate({ to: "/profile" })
  }

  const handleLogout = () => {
    // TODO: Implement logout functionality
    navigate({ to: "/login" })
  }

  return (
    <SidebarProvider>
      <SidebarToggle />
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <MenuIcon className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{headerTitle}</h2>
              <p className="text-xs text-sidebar-foreground/60">{headerSubtitle}</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarNav>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="ml-2 text-sm">加载菜单...</span>
              </div>
            )}
            
            {error && (
              <div className="px-3 py-2 text-sm text-red-600">
                加载菜单失败: {error}
              </div>
            )}
            
            {!loading && !error && menuItems.map((item) => (
              <SidebarNavItem
                key={item.menuId}
                active={currentPage === item.menuPath}
                onClick={() => handleNavigation(item.menuPath)}
              >
                {item.menuIcon && (
                  <span className="text-lg mr-1">{item.menuIcon}</span>
                )}
                {item.menuName}
              </SidebarNavItem>
            ))}
          </SidebarNav>
          
          <Separator className="my-4" />
          
          <SidebarNav>
            {showBackToHome && (
              <SidebarNavItem onClick={goHome}>
                <ArrowLeft className="h-4 w-4" />
                返回首页
              </SidebarNavItem>
            )}
            <SidebarNavItem onClick={goToProfile}>
              <User className="h-4 w-4" />
              个人资料
            </SidebarNavItem>
            <SidebarNavItem onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              退出登录
            </SidebarNavItem>
          </SidebarNav>
        </SidebarContent>
      </Sidebar>

      <SidebarMain>
        {children}
      </SidebarMain>
    </SidebarProvider>
  )
}