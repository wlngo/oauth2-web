import { useNavigate } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/layout/AdminLayout"
import {
  User,
  Shield,
  Settings,
  Activity,
  Users,
  Database,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function Home() {
  const navigate = useNavigate()

  const goToProfile = () => {
    navigate({ to: "/profile" })
  }

  const stats = [
    {
      title: "总用户数",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "活跃会话",
      value: "456",
      change: "+5%",
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "OAuth2 应用",
      value: "28",
      change: "+2",
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "今日登录",
      value: "89",
      change: "+8%",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ]

  const recentActivities = [
    {
      action: "用户登录",
      user: "admin@example.com",
      time: "2 分钟前",
      status: "success",
    },
    {
      action: "OAuth2 授权",
      user: "user@example.com",
      time: "5 分钟前",
      status: "success",
    },
    {
      action: "应用注册",
      user: "dev@example.com",
      time: "10 分钟前",
      status: "pending",
    },
    {
      action: "登录失败",
      user: "unknown@example.com",
      time: "15 分钟前",
      status: "error",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">管理后台概览</h1>
          <p className="text-muted-foreground mt-2">
            欢迎回来！这里是您的 OAuth2 管理控制台的总览。
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <div className="flex items-center">
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <span className="ml-2 text-xs text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Quick Actions */}
          <Card className="md:col-span-2 lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                快速操作
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Button
                  onClick={goToProfile}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">个人资料</div>
                      <div className="text-sm text-muted-foreground">
                        查看和管理个人信息
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => navigate({ to: "/oauth2" })}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">OAuth2 管理</div>
                      <div className="text-sm text-muted-foreground">
                        管理应用和授权
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Database className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">数据备份</div>
                      <div className="text-sm text-muted-foreground">
                        备份和恢复数据
                      </div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => navigate({ to: "/settings" })}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Settings className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">系统设置</div>
                      <div className="text-sm text-muted-foreground">
                        配置系统参数
                      </div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                最近活动
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {activity.status === "success" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {activity.status === "pending" && (
                        <Clock className="h-4 w-4 text-yellow-600" />
                      )}
                      {activity.status === "error" && (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.user}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              系统状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">数据库连接</p>
                  <p className="text-xs text-muted-foreground">正常运行</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">OAuth2 服务</p>
                  <p className="text-xs text-muted-foreground">正常运行</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">API 网关</p>
                  <p className="text-xs text-muted-foreground">正常运行</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
