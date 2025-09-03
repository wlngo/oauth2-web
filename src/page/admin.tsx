import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { 
  Shield, 
  LogOut,
  Home,
  User,
  Users,
  Key,
  BarChart3,
  Activity
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { useAdminNavigation } from "@/hooks/useAdminNavigation"

const dashboardStats = [
  {
    title: "总用户数",
    value: "2,847",
    change: "+12%",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "活跃应用",
    value: "24",
    change: "+3",
    icon: Key,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "本月授权",
    value: "15,832",
    change: "+8.2%",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  {
    title: "系统状态",
    value: "正常",
    change: "99.9%",
    icon: Activity,
    color: "text-emerald-600",
    bgColor: "bg-emerald-100",
  },
]

const recentActivities = [
  {
    id: 1,
    user: "张三",
    action: "用户登录",
    app: "财务系统",
    time: "2分钟前",
    status: "成功",
  },
  {
    id: 2,
    user: "李四",
    action: "权限申请",
    app: "人事系统",
    time: "5分钟前",
    status: "待审核",
  },
  {
    id: 3,
    user: "王五",
    action: "应用注册",
    app: "新应用",
    time: "10分钟前",
    status: "成功",
  },
  {
    id: 4,
    user: "赵六",
    action: "密码重置",
    app: "用户中心",
    time: "15分钟前",
    status: "成功",
  },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState("dashboard")
  const { menuItems, loading, error } = useAdminNavigation()

  const handleNavigation = (id: string) => {
    setActiveItem(id)
    // 根据导航项ID进行路由跳转
    if (id === "users") {
      navigate({ to: "/admin/users" })
    } else if (id === "roles") {
      navigate({ to: "/admin/roles" })
    } else if (id === "permissions") {
      navigate({ to: "/admin/permissions" })
    } else if (id === "menus") {
      navigate({ to: "/admin/menus" })
    }
    // 其他导航逻辑可以在这里添加
  }

  const goHome = () => {
    navigate({ to: "/" })
  }

  const goToProfile = () => {
    navigate({ to: "/profile" })
  }

  return (
    <SidebarProvider>
      <SidebarToggle />
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Shield className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">OAuth2 管理后台</h2>
              <p className="text-xs text-sidebar-foreground/60">系统管理</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarNav>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-muted-foreground">加载菜单中...</div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-red-500">菜单加载失败</div>
              </div>
            )}
            {!loading && !error && menuItems.map((item) => (
              <SidebarNavItem
                key={item.id}
                active={activeItem === item.id}
                onClick={() => handleNavigation(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </SidebarNavItem>
            ))}
          </SidebarNav>
          
          <Separator className="my-4" />
          
          <SidebarNav>
            <SidebarNavItem onClick={goHome}>
              <Home className="h-4 w-4" />
              返回首页
            </SidebarNavItem>
            <SidebarNavItem onClick={goToProfile}>
              <User className="h-4 w-4" />
              个人资料
            </SidebarNavItem>
            <SidebarNavItem>
              <LogOut className="h-4 w-4" />
              退出登录
            </SidebarNavItem>
          </SidebarNav>
        </SidebarContent>
      </Sidebar>

      <SidebarMain>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">仪表板</h1>
              <p className="text-muted-foreground">欢迎回到 OAuth2 管理后台</p>
            </div>
            <Button onClick={goHome} variant="outline" className="w-fit">
              <Home className="h-4 w-4 mr-2" />
              返回首页
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> 较上月
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>最近活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} · {activity.app} · {activity.time}
                        </p>
                      </div>
                      <Badge 
                        variant={activity.status === "成功" ? "default" : 
                                activity.status === "待审核" ? "secondary" : "outline"}
                        className="w-fit"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>系统概览</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">系统版本</span>
                    <Badge variant="outline">v2.1.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">运行时间</span>
                    <span className="text-sm text-muted-foreground">15天 8小时</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">数据库状态</span>
                    <Badge className="bg-green-100 text-green-700">正常</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">缓存状态</span>
                    <Badge className="bg-green-100 text-green-700">正常</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">内存使用</span>
                    <span className="text-sm text-muted-foreground">2.4GB / 8GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPU 使用率</span>
                    <span className="text-sm text-muted-foreground">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>快速操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
                <Button 
                  className="h-20 flex-col gap-2" 
                  variant="outline"
                  onClick={() => navigate({ to: "/admin/users" })}
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm text-center">添加用户</span>
                </Button>
                <Button 
                  className="h-20 flex-col gap-2" 
                  variant="outline"
                  onClick={() => navigate({ to: "/admin/roles" })}
                >
                  <Shield className="h-6 w-6" />
                  <span className="text-sm text-center">管理角色</span>
                </Button>
                <Button 
                  className="h-20 flex-col gap-2" 
                  variant="outline"
                  onClick={() => navigate({ to: "/admin/permissions" })}
                >
                  <Key className="h-6 w-6" />
                  <span className="text-sm text-center">权限配置</span>
                </Button>
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm text-center">查看报告</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarMain>
    </SidebarProvider>
  )
}