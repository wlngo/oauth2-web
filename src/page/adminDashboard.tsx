import { useState, useEffect } from "react"
import { useNavigate } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Users,
  Shield,
  Activity,
  TrendingUp,
  Server,
  AlertTriangle,
  Plus,
  Search,
  MoreHorizontal,
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { 
  mockApi, 
  type User, 
  type SystemStats, 
  type Application, 
  type ActivityLog 
} from "@/lib/mockData"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [applications, setApplications] = useState<Application[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'apps' | 'logs'>('overview')
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [usersData, statsData, appsData, logsData] = await Promise.all([
          mockApi.getUsers(),
          mockApi.getSystemStats(),
          mockApi.getApplications(),
          mockApi.getActivityLogs()
        ])
        setUsers(usersData)
        setSystemStats(statsData)
        setApplications(appsData)
        setActivityLogs(logsData)
      } catch (error) {
        console.error('Error loading admin data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleGoBack = () => {
    navigate({ to: "/" })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return 'default'
      case 'inactive':
      case 'failed':
        return 'destructive'
      case 'pending':
      case 'warning':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
        return <CheckCircle className="h-4 w-4" />
      case 'inactive':
      case 'failed':
        return <XCircle className="h-4 w-4" />
      case 'pending':
      case 'warning':
        return <Clock className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-red-600 bg-red-50'
      case 'moderator':
        return 'text-blue-600 bg-blue-50'
      case 'user':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredLogs = activityLogs.filter(log =>
    log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                返回
              </Button>
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
                  <p className="text-sm text-gray-500">OAuth2 系统管理面板</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-2">
                <Activity className="h-3 w-3" />
                系统运行正常
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: '概览', icon: TrendingUp },
              { id: 'users', label: '用户管理', icon: Users },
              { id: 'apps', label: '应用管理', icon: Server },
              { id: 'logs', label: '活动日志', icon: Activity }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">总用户数</p>
                      <p className="text-3xl font-bold text-gray-900">{systemStats?.totalUsers}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">活跃用户: {systemStats?.activeUsers}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">注册应用</p>
                      <p className="text-3xl font-bold text-gray-900">{systemStats?.totalApplications}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <Server className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">运行中应用: {applications.filter(app => app.status === 'active').length}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">成功登录</p>
                      <p className="text-3xl font-bold text-gray-900">{systemStats?.successfulLogins?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-orange-600 ml-1">失败: {systemStats?.failedLogins}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">系统稳定性</p>
                      <p className="text-3xl font-bold text-gray-900">{systemStats?.systemUptime}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Activity className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 ml-1">服务正常运行</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  最近活动
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${log.status === 'success' ? 'bg-green-100' : log.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'}`}>
                          {getStatusIcon(log.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{log.description}</p>
                          <p className="text-sm text-gray-500">
                            {log.username} • {new Date(log.timestamp).toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getStatusBadgeVariant(log.status)}>
                        {log.status === 'success' ? '成功' : log.status === 'failed' ? '失败' : '警告'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">用户管理</h2>
                <p className="text-gray-600">管理系统中的所有用户账户</p>
              </div>
              <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    添加用户
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>创建新用户</DialogTitle>
                    <DialogDescription>
                      填写用户信息以创建新账户
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">用户名</Label>
                      <Input id="username" placeholder="输入用户名" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">邮箱</Label>
                      <Input id="email" type="email" placeholder="输入邮箱地址" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="realName">真实姓名</Label>
                      <Input id="realName" placeholder="输入真实姓名" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                      取消
                    </Button>
                    <Button onClick={() => setIsCreateUserOpen(false)}>
                      创建用户
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索用户..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>用户</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>最后登录</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {user.realName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{user.realName}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getRoleColor(user.role)}>
                          {user.role === 'admin' ? '管理员' : user.role === 'moderator' ? '监管员' : '用户'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(user.status)} className="gap-1">
                          {getStatusIcon(user.status)}
                          {user.status === 'active' ? '活跃' : user.status === 'inactive' ? '非活跃' : '待审核'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('zh-CN') : '从未登录'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">应用管理</h2>
                <p className="text-gray-600">管理OAuth2客户端应用程序</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                注册新应用
              </Button>
            </div>

            <div className="grid gap-6">
              {applications.map(app => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Server className="h-5 w-5 text-blue-600" />
                          </div>
                          {app.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{app.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusBadgeVariant(app.status)} className="gap-1">
                          {getStatusIcon(app.status)}
                          {app.status === 'active' ? '运行中' : '已停用'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">客户端ID</p>
                          <p className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded mt-1">
                            {app.clientId}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">创建时间</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {new Date(app.createdAt).toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">权限范围</p>
                        <div className="flex flex-wrap gap-2">
                          {app.scopes.map(scope => (
                            <Badge key={scope} variant="secondary">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">回调URL</p>
                        <div className="space-y-1">
                          {app.redirectUris.map((uri, index) => (
                            <p key={index} className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                              {uri}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Activity Logs Tab */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">活动日志</h2>
                <p className="text-gray-600">查看系统活动和用户操作记录</p>
              </div>
            </div>

            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="搜索活动日志..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>用户</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>IP地址</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell className="text-gray-600">
                        {new Date(log.timestamp).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                              {log.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{log.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono text-xs">
                          {log.action}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {log.description}
                      </TableCell>
                      <TableCell className="font-mono text-sm text-gray-600">
                        {log.ipAddress}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(log.status)} className="gap-1">
                          {getStatusIcon(log.status)}
                          {log.status === 'success' ? '成功' : log.status === 'failed' ? '失败' : '警告'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}