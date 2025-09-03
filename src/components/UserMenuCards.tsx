import { useState, useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { getUserMenuTree, type MenuNode } from "@/services/authService"

export default function UserMenuCards() {
  const navigate = useNavigate()
  const [menuItems, setMenuItems] = useState<MenuNode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError(err instanceof Error ? err.message : 'Failed to load user menus')
      } finally {
        setLoading(false)
      }
    }

    loadMenus()
  }, [])

  const handleMenuClick = (menuPath: string) => {
    navigate({ to: menuPath })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <span className="ml-3 text-gray-600">加载菜单...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-red-600 mb-2">加载菜单失败</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (menuItems.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-gray-600">暂无可用菜单</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {menuItems.map((menu) => (
        <Card 
          key={menu.menuId}
          className="cursor-pointer hover:shadow-lg transition-shadow" 
          onClick={() => handleMenuClick(menu.menuPath)}
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              {menu.menuIcon && (
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">{menu.menuIcon}</span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{menu.menuName}</h3>
                {menu.description && (
                  <p className="text-sm text-gray-600 mt-1">{menu.description}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}