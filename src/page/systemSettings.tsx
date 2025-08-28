import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AdminLayout from "@/components/layout/AdminLayout"
import {
  Shield,
  Bell,
  Palette,
  Globe,
  Lock,
  Server,
  Save,
} from "lucide-react"

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    // 基础设置
    siteName: "OAuth2 管理系统",
    siteDescription: "企业级身份认证和授权管理平台",
    adminEmail: "admin@example.com",
    
    // 安全设置
    sessionTimeout: "3600",
    passwordMinLength: "8",
    enableTwoFactor: true,
    maxLoginAttempts: "5",
    
    // OAuth2 设置
    accessTokenExpiry: "3600",
    refreshTokenExpiry: "604800",
    allowRegistration: true,
    requireEmailVerification: true,
    
    // 通知设置
    emailNotifications: true,
    securityAlerts: true,
    systemUpdates: false,
    
    // 外观设置
    theme: "light",
    language: "zh-CN",
    dateFormat: "YYYY-MM-DD",
    timezone: "Asia/Shanghai",
  })

  const handleInputChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = () => {
    console.log("保存设置:", settings)
    // 这里可以添加保存设置的逻辑
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">系统设置</h1>
            <p className="text-muted-foreground mt-2">
              配置系统参数和功能选项
            </p>
          </div>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            保存设置
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 基础设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                基础设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">站点名称</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange("siteName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">站点描述</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => handleInputChange("siteDescription", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="adminEmail">管理员邮箱</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange("adminEmail", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* 安全设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                安全设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">会话超时时间 (秒)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange("sessionTimeout", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="passwordMinLength">密码最小长度</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleInputChange("passwordMinLength", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maxLoginAttempts">最大登录尝试次数</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleInputChange("maxLoginAttempts", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableTwoFactor"
                  checked={settings.enableTwoFactor}
                  onChange={(e) => handleInputChange("enableTwoFactor", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="enableTwoFactor">启用双因素认证</Label>
              </div>
            </CardContent>
          </Card>

          {/* OAuth2 设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                OAuth2 设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="accessTokenExpiry">访问令牌过期时间 (秒)</Label>
                <Input
                  id="accessTokenExpiry"
                  type="number"
                  value={settings.accessTokenExpiry}
                  onChange={(e) => handleInputChange("accessTokenExpiry", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="refreshTokenExpiry">刷新令牌过期时间 (秒)</Label>
                <Input
                  id="refreshTokenExpiry"
                  type="number"
                  value={settings.refreshTokenExpiry}
                  onChange={(e) => handleInputChange("refreshTokenExpiry", e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allowRegistration"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleInputChange("allowRegistration", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="allowRegistration">允许用户注册</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireEmailVerification"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleInputChange("requireEmailVerification", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="requireEmailVerification">需要邮箱验证</Label>
              </div>
            </CardContent>
          </Card>

          {/* 通知设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                通知设置
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="emailNotifications">邮件通知</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="securityAlerts"
                  checked={settings.securityAlerts}
                  onChange={(e) => handleInputChange("securityAlerts", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="securityAlerts">安全警告</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="systemUpdates"
                  checked={settings.systemUpdates}
                  onChange={(e) => handleInputChange("systemUpdates", e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="systemUpdates">系统更新通知</Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 外观设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              外观设置
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <Label htmlFor="theme">主题</Label>
                <select
                  id="theme"
                  value={settings.theme}
                  onChange={(e) => handleInputChange("theme", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                  <option value="system">跟随系统</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">语言</Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => handleInputChange("language", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                </select>
              </div>
              <div>
                <Label htmlFor="dateFormat">日期格式</Label>
                <select
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => handleInputChange("dateFormat", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">时区</Label>
                <select
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => handleInputChange("timezone", e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Asia/Shanghai">Asia/Shanghai</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 系统信息 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              系统信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">系统版本</Label>
                <p className="text-sm">v2.1.0</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">数据库版本</Label>
                <p className="text-sm">PostgreSQL 14.9</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">最后更新</Label>
                <p className="text-sm">2024-01-15 10:30:00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}