import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Shield, 
  Activity, 
  Server, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
// import { request } from '@/lib/http' // Will be used when implementing real API calls

interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalClients: number
  activeClients: number
  todayLogins: number
  systemStatus: 'healthy' | 'warning' | 'error'
  lastUpdated: string
}

// Mock data for demonstration - in a real app, this would come from API
const mockStats: SystemStats = {
  totalUsers: 1248,
  activeUsers: 892,
  totalClients: 45,
  activeClients: 38,
  todayLogins: 156,
  systemStatus: 'healthy',
  lastUpdated: new Date().toISOString()
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchSystemStats = async () => {
    setLoading(true)
    setError('')
    try {
      // For now, use mock data. In production, replace with actual API call:
      // const response = await request<SystemStats>('/admin/stats', { method: 'GET' })
      // setStats(response)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats(mockStats)
    } catch (err) {
      setError('Failed to load system statistics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        // For now, use mock data. In production, replace with actual API call:
        // const response = await request<SystemStats>('/admin/stats', { method: 'GET' })
        // setStats(response)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        setStats(mockStats)
      } catch (err) {
        setError('Failed to load system statistics')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const StatCard = ({ 
    title, 
    value, 
    subtext, 
    icon: Icon, 
    trend, 
    color = 'blue' 
  }: {
    title: string
    value: string | number
    subtext?: string
    icon: React.ComponentType<{ className?: string }>
    trend?: 'up' | 'down' | 'stable'
    color?: 'blue' | 'green' | 'orange' | 'red'
  }) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      red: 'bg-red-100 text-red-600'
    }

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtext && (
                <p className="text-sm text-gray-500 mt-1">{subtext}</p>
              )}
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
          {trend && (
            <div className="mt-3 flex items-center">
              <TrendingUp 
                className={`h-4 w-4 mr-1 ${
                  trend === 'up' ? 'text-green-600' : 
                  trend === 'down' ? 'text-red-600' : 
                  'text-gray-600'
                }`} 
              />
              <span className={`text-sm ${
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              }`}>
                {trend === 'up' ? '增长趋势' : trend === 'down' ? '下降趋势' : '保持稳定'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      healthy: { label: '系统正常', variant: 'default' as const, color: 'text-green-600', icon: CheckCircle },
      warning: { label: '系统警告', variant: 'secondary' as const, color: 'text-orange-600', icon: AlertTriangle },
      error: { label: '系统异常', variant: 'destructive' as const, color: 'text-red-600', icon: AlertTriangle }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.healthy
    const Icon = config.icon
    
    return (
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${config.color}`} />
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>
    )
  }

  if (loading) {
    return (
      <AdminLayout activeSection="dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>加载系统数据中...</span>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout activeSection="dashboard">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={fetchSystemStats} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              重新加载
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout activeSection="dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">管理仪表板</h1>
            <p className="text-gray-600 mt-2">系统概览和关键指标</p>
          </div>
          <Button onClick={fetchSystemStats} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新数据
          </Button>
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {stats && getStatusBadge(stats.systemStatus)}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>最后更新: {stats ? new Date(stats.lastUpdated).toLocaleString('zh-CN') : '-'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="总用户数"
            value={stats?.totalUsers || 0}
            subtext={`活跃用户: ${stats?.activeUsers || 0}`}
            icon={Users}
            trend="up"
            color="blue"
          />
          <StatCard
            title="OAuth2 客户端"
            value={stats?.totalClients || 0}
            subtext={`活跃客户端: ${stats?.activeClients || 0}`}
            icon={Shield}
            trend="stable"
            color="green"
          />
          <StatCard
            title="今日登录"
            value={stats?.todayLogins || 0}
            subtext="过去24小时"
            icon={Activity}
            trend="up"
            color="orange"
          />
          <StatCard
            title="系统性能"
            value="98.5%"
            subtext="可用性"
            icon={Server}
            trend="stable"
            color="green"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">用户管理</h3>
                  <p className="text-sm text-gray-600">管理系统用户和权限</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">OAuth2 客户端</h3>
                  <p className="text-sm text-gray-600">管理OAuth2应用客户端</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">系统监控</h3>
                  <p className="text-sm text-gray-600">查看系统运行状态</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { time: '2 分钟前', action: '用户 admin@example.com 登录系统', type: 'info' },
                { time: '15 分钟前', action: '新增 OAuth2 客户端 "MyApp"', type: 'success' },
                { time: '1 小时前', action: '用户权限更新完成', type: 'info' },
                { time: '2 小时前', action: '系统备份任务执行成功', type: 'success' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === 'success' ? 'bg-green-500' : 
                    item.type === 'warning' ? 'bg-orange-500' : 
                    'bg-blue-500'
                  }`} />
                  <span className="text-sm text-gray-600 flex-1">{item.action}</span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}