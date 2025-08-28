import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AdminLayout from "@/components/layout/AdminLayout"
import {
  Shield,
  Plus,
  Settings,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
} from "lucide-react"

export default function OAuth2Management() {
  const [showSecrets, setShowSecrets] = useState<{[key: string]: boolean}>({})

  const applications = [
    {
      id: "app_1",
      name: "前端Web应用",
      clientId: "client_123456789",
      clientSecret: "secret_abcdefghijk",
      redirectUris: ["https://example.com/callback", "https://app.example.com/auth"],
      scopes: ["read", "write", "profile"],
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: "app_2", 
      name: "移动端应用",
      clientId: "client_987654321",
      clientSecret: "secret_zyxwvutsrqp",
      redirectUris: ["app://oauth/callback"],
      scopes: ["read", "profile"],
      createdAt: "2024-01-10",
      status: "active",
    },
    {
      id: "app_3",
      name: "第三方集成",
      clientId: "client_555666777",
      clientSecret: "secret_mnopqrstuvw",
      redirectUris: ["https://integration.partner.com/oauth"],
      scopes: ["read"],
      createdAt: "2024-01-05",
      status: "inactive",
    },
  ]

  const toggleSecret = (appId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [appId]: !prev[appId]
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">OAuth2 应用管理</h1>
            <p className="text-muted-foreground mt-2">
              管理和配置您的 OAuth2 客户端应用程序
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            新建应用
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">总应用数</p>
                  <h3 className="text-2xl font-bold">3</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">活跃应用</p>
                  <h3 className="text-2xl font-bold">2</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">今日授权</p>
                  <h3 className="text-2xl font-bold">156</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">总授权数</p>
                  <h3 className="text-2xl font-bold">1,234</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">应用列表</h2>
          {applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        创建于 {app.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        app.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {app.status === "active" ? "活跃" : "未激活"}
                    </span>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Client ID</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input value={app.clientId} readOnly className="font-mono text-sm" />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(app.clientId)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Client Secret</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type={showSecrets[app.id] ? "text" : "password"}
                        value={app.clientSecret}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSecret(app.id)}
                      >
                        {showSecrets[app.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(app.clientSecret)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">回调地址</Label>
                  <div className="mt-1 space-y-1">
                    {app.redirectUris.map((uri, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={uri} readOnly className="text-sm" />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(uri)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">授权范围</Label>
                  <div className="flex gap-2 mt-1">
                    {app.scopes.map((scope) => (
                      <span
                        key={scope}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                      >
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}