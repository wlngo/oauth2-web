import React from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  Shield, 
  BarChart3,
  LogOut,
  Home,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface AdminLayoutProps {
  children: React.ReactNode
  activeSection?: string
}

const navigation = [
  { name: '仪表板', href: '/admin', icon: LayoutDashboard, id: 'dashboard' },
  { name: '用户管理', href: '/admin/users', icon: Users, id: 'users' },
  { name: 'OAuth2 客户端', href: '/admin/clients', icon: Shield, id: 'clients' },
  { name: '系统设置', href: '/admin/settings', icon: Settings, id: 'settings' },
  { name: '系统日志', href: '/admin/logs', icon: FileText, id: 'logs' },
  { name: '数据统计', href: '/admin/analytics', icon: BarChart3, id: 'analytics' },
]

export default function AdminLayout({ children, activeSection = 'dashboard' }: AdminLayoutProps) {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNavigation = (href: string) => {
    navigate({ to: href })
    setSidebarOpen(false)
  }

  const handleBackToHome = () => {
    navigate({ to: '/' })
  }

  const handleLogout = () => {
    // Use the same logout logic as in home page
    navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">管理后台</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.href)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </button>
              )
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleBackToHome}
            >
              <Home className="h-4 w-4" />
              返回首页
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              退出登录
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar for mobile */}
        <div className="lg:hidden bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900">管理后台</h1>
            <div></div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}