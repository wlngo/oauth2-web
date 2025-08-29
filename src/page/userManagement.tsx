import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarNav,
  SidebarNavItem,
  SidebarMain,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// 复用现有的 UserInfo 接口
interface UserInfo {
  userId?: string
  username?: string
  nickName?: string
  realName?: string
  email?: string
  emailVerified?: boolean
  phoneNumber?: string
  phoneNumberVerified?: boolean
  gender?: number
  birthdate?: string
  avatarUrl?: string
  createdAt?: string
  updatedAt?: string
  authorities?: string[]
}

// 模拟用户数据 - 实际项目中会从API获取
const mockUsers: UserInfo[] = [
  {
    userId: "1",
    username: "zhangsan",
    nickName: "张三",
    realName: "张三",
    email: "zhangsan@example.com",
    emailVerified: true,
    phoneNumber: "13800138001",
    phoneNumberVerified: true,
    gender: 1,
    birthdate: "1990-01-01",
    avatarUrl: "",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
    authorities: ["USER", "ADMIN"]
  },
  {
    userId: "2",
    username: "lisi",
    nickName: "李四",
    realName: "李四",
    email: "lisi@example.com",
    emailVerified: false,
    phoneNumber: "13800138002",
    phoneNumberVerified: true,
    gender: 2,
    birthdate: "1992-05-15",
    avatarUrl: "",
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-16T00:00:00.000Z",
    authorities: ["USER"]
  },
  {
    userId: "3",
    username: "wangwu",
    nickName: "王五",
    realName: "王五",
    email: "wangwu@example.com",
    emailVerified: true,
    phoneNumber: "13800138003",
    phoneNumberVerified: false,
    gender: 1,
    birthdate: "1988-12-20",
    avatarUrl: "",
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-17T00:00:00.000Z",
    authorities: ["USER", "MODERATOR"]
  }
]

const adminNavItems = [
  { icon: Shield, label: "仪表板", id: "dashboard" },
  { icon: Shield, label: "用户管理", id: "users", active: true },
  { icon: Shield, label: "应用管理", id: "applications" },
  { icon: Shield, label: "权限管理", id: "permissions" },
  { icon: Shield, label: "数据统计", id: "analytics" },
  { icon: Shield, label: "审计日志", id: "audit" },
  { icon: Shield, label: "系统设置", id: "settings" },
]

export default function UserManagement() {
  const navigate = useNavigate()
  const [users] = useState<UserInfo[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeItem, setActiveItem] = useState("users")

  const handleNavigation = (id: string) => {
    setActiveItem(id)
    if (id === "dashboard") {
      navigate({ to: "/admin" })
    }
    // 其他导航逻辑可以在这里添加
  }

  const goHome = () => {
    navigate({ to: "/" })
  }

  const goToProfile = () => {
    navigate({ to: "/profile" })
  }

  const goBack = () => {
    navigate({ to: "/admin" })
  }

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  const getGenderText = (gender?: number) => {
    switch (gender) {
      case 1: return "男"
      case 2: return "女"
      default: return "未知"
    }
  }

  const getRoleDisplay = (authorities?: string[]) => {
    if (!authorities || authorities.length === 0) return "无角色"
    
    const roleMap: Record<string, { label: string; color: string }> = {
      ADMIN: { label: "管理员", color: "bg-red-100 text-red-700" },
      MODERATOR: { label: "版主", color: "bg-blue-100 text-blue-700" },
      USER: { label: "用户", color: "bg-gray-100 text-gray-700" }
    }

    return authorities.map(auth => (
      <Badge 
        key={auth} 
        className={`mr-1 ${roleMap[auth]?.color || "bg-gray-100 text-gray-700"}`}
      >
        {roleMap[auth]?.label || auth}
      </Badge>
    ))
  }

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nickName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddUser = () => {
    // TODO: 实现添加用户功能
    console.log("添加用户")
  }

  const handleEditUser = (userId: string) => {
    // TODO: 实现编辑用户功能
    console.log("编辑用户:", userId)
  }

  const handleDeleteUser = (userId: string) => {
    // TODO: 实现删除用户功能
    console.log("删除用户:", userId)
  }

  const handleViewUser = (userId: string) => {
    // TODO: 实现查看用户详情功能
    console.log("查看用户:", userId)
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
              <Shield className="size-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">OAuth2 管理后台</h2>
              <p className="text-xs text-sidebar-foreground/60">用户管理</p>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarNav>
            {adminNavItems.map((item) => (
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
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </SidebarNavItem>
            <SidebarNavItem onClick={goToProfile}>
              <Shield className="h-4 w-4" />
              个人资料
            </SidebarNavItem>
            <SidebarNavItem>
              <Shield className="h-4 w-4" />
              退出登录
            </SidebarNavItem>
          </SidebarNav>
        </SidebarContent>
      </Sidebar>

      <SidebarMain>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={goBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回仪表板
              </Button>
              <div>
                <h1 className="text-3xl font-bold">用户管理</h1>
                <p className="text-muted-foreground">管理系统用户账户和权限</p>
              </div>
            </div>
            <Button onClick={handleAddUser}>
              <Plus className="h-4 w-4 mr-2" />
              添加用户
            </Button>
          </div>

          {/* Search and Filter */}
          <Card>
            <CardHeader>
              <CardTitle>用户列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="搜索用户名、昵称、邮箱..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  过滤
                </Button>
              </div>

              {/* Users Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户</TableHead>
                      <TableHead>联系信息</TableHead>
                      <TableHead>验证状态</TableHead>
                      <TableHead>角色权限</TableHead>
                      <TableHead>创建时间</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={user.avatarUrl} alt={user.nickName} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials(user.nickName || user.realName || user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.nickName || user.realName}</div>
                              <div className="text-sm text-muted-foreground">@{user.username}</div>
                              <div className="text-xs text-muted-foreground">
                                {getGenderText(user.gender)} · {user.birthdate ? formatDate(user.birthdate) : "未设置生日"}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            {user.phoneNumber && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3" />
                                {user.phoneNumber}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {user.emailVerified ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                邮箱{user.emailVerified ? "已验证" : "未验证"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {user.phoneNumberVerified ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">
                                手机{user.phoneNumberVerified ? "已验证" : "未验证"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {getRoleDisplay(user.authorities)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3" />
                            {formatDate(user.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewUser(user.userId!)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditUser(user.userId!)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.userId!)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Stats */}
              <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                <div>
                  显示 {filteredUsers.length} 个用户，共 {users.length} 个用户
                </div>
                <div className="flex items-center gap-4">
                  <span>已验证邮箱: {users.filter(u => u.emailVerified).length}</span>
                  <span>已验证手机: {users.filter(u => u.phoneNumberVerified).length}</span>
                  <span>管理员: {users.filter(u => u.authorities?.includes("ADMIN")).length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarMain>
    </SidebarProvider>
  )
}