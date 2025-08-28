import { useState } from "react"
import { useNavigate, useLocation } from "@tanstack/react-router"
import { request } from "@/lib/http"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMain,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Home,
  User,
  Settings,
  Shield,
  LogOut,
  Menu,
  Building2,
} from "lucide-react"

interface LogoutResponse {
  code: number
  msg?: string
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState("")

  const handleLogout = async () => {
    setError("")
    try {
      const res = await request<LogoutResponse>("/logout", {
        method: "POST",
        csrf: true,
        csrfUseCache: false,
      })

      if (res.code == 200) {
        navigate({ to: "/login" })
      } else {
        setError(res.msg || "登出失败")
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "登出请求异常")
    }
  }

  const menuItems = [
    {
      title: "首页",
      url: "/",
      icon: Home,
    },
    {
      title: "个人资料",
      url: "/profile",
      icon: User,
    },
    {
      title: "OAuth2 管理",
      url: "/oauth2",
      icon: Shield,
    },
    {
      title: "系统设置",
      url: "/settings",
      icon: Settings,
    },
  ]

  const isActive = (url: string) => {
    if (url === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(url)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="w-64 border-r bg-sidebar">
          <SidebarHeader className="border-b border-sidebar-border p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">OAuth2 管理后台</span>
                <span className="truncate text-xs text-muted-foreground">管理控制台</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-3 py-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={isActive(item.url)}
                    className="cursor-pointer"
                    onClick={() => navigate({ to: item.url })}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="cursor-pointer w-full text-destructive hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>退出登录</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            {error && (
              <div className="mt-2 text-xs text-destructive">{error}</div>
            )}
          </SidebarFooter>
        </Sidebar>

        <SidebarMain className="flex-1">
          {/* Top Header */}
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="flex-1" />
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </SidebarMain>
      </div>
    </SidebarProvider>
  )
}