import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, User, Database, Settings } from "lucide-react"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"
import { OAuth2ClientDeleteConfirmationModal } from "@/components/OAuth2ClientDeleteConfirmationModal"
import { SuccessToast } from "@/components/SuccessToast"
import { useSuccessNotification, SuccessMessages } from "@/hooks/useSuccessNotification"

// Mock data for demo
const mockUser = {
  userId: "user123",
  username: "johndoe",
  nickName: "John Doe",
  realName: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "https://github.com/shadcn.png",
  createdAt: "2023-01-01T00:00:00Z",
  emailVerified: true,
  phoneNumber: "+1234567890",
  phoneNumberVerified: true,
  enabled: true,
  accountLocked: false
}

const mockOAuth2Client = {
  id: "client123",
  clientId: "demo-client-id",
  clientName: "Demo OAuth2 Client",
  clientSecret: "secret123",
  scopes: "read write admin",
  redirectUris: "https://example.com/callback",
  grantTypes: "authorization_code,refresh_token"
}

export default function ConfirmationDemo() {
  const [showUserDeleteModal, setShowUserDeleteModal] = useState(false)
  const [showClientDeleteModal, setShowClientDeleteModal] = useState(false)
  const [isUserDeleting, setIsUserDeleting] = useState(false)
  const [isClientDeleting, setIsClientDeleting] = useState(false)
  
  const { notifications, showSuccess, hideNotification } = useSuccessNotification()

  const handleUserDelete = async () => {
    setIsUserDeleting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsUserDeleting(false)
    setShowUserDeleteModal(false)
    showSuccess(SuccessMessages.userDeleted(mockUser.username), {
      action: {
        label: "撤销",
        onClick: () => showSuccess("删除操作已撤销")
      }
    })
  }

  const handleClientDelete = async () => {
    setIsClientDeleting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsClientDeleting(false)
    setShowClientDeleteModal(false)
    showSuccess(`OAuth2客户端 "${mockOAuth2Client.clientName}" 已成功删除`, {
      action: {
        label: "查看日志",
        onClick: () => showSuccess("正在打开操作日志...")
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">确认体验演示</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            展示增强的确认机制，包括类型确认、安全等待、视觉反馈和成功通知等功能，提升用户操作的安全性和确认感。
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Delete Demo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                用户删除确认
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium">{mockUser.nickName}</div>
                <div className="text-sm text-gray-500">@{mockUser.username}</div>
                <div className="text-xs text-gray-400">{mockUser.email}</div>
              </div>
              <Button 
                onClick={() => setShowUserDeleteModal(true)}
                variant="outline"
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                删除用户 (增强确认)
              </Button>
              <div className="text-xs text-gray-500">
                ✨ 特性：类型确认 + 3秒安全等待 + 详细警告
              </div>
            </CardContent>
          </Card>

          {/* OAuth2 Client Delete Demo */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-green-600" />
                OAuth2客户端删除
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="font-medium">{mockOAuth2Client.clientName}</div>
                <div className="text-sm text-gray-500 font-mono">{mockOAuth2Client.clientId}</div>
                <div className="text-xs text-gray-400">权限: {mockOAuth2Client.scopes}</div>
              </div>
              <Button 
                onClick={() => setShowClientDeleteModal(true)}
                variant="outline"
                className="w-full bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
              >
                <Database className="h-4 w-4 mr-2" />
                删除客户端 (增强确认)
              </Button>
              <div className="text-xs text-gray-500">
                ✨ 特性：专门为OAuth2客户端定制的确认流程
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              增强确认功能说明
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">🛡️ 安全功能</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 类型确认 - 需要输入特定文本</li>
                  <li>• 安全等待 - 3秒倒计时防止误操作</li>
                  <li>• 详细警告 - 清晰说明操作后果</li>
                  <li>• 视觉反馈 - 动画和颜色提示</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">🎨 用户体验</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 成功通知 - 操作完成后的确认反馈</li>
                  <li>• 撤销选项 - 支持快速撤销操作</li>
                  <li>• 加载状态 - 清晰的操作进度提示</li>
                  <li>• 响应式设计 - 适配不同屏幕尺寸</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showUserDeleteModal && (
        <DeleteConfirmationModal
          user={mockUser}
          onConfirm={handleUserDelete}
          onCancel={() => setShowUserDeleteModal(false)}
          isLoading={isUserDeleting}
          requireTypeConfirm={true}
          typeConfirmText="删除"
        />
      )}

      {showClientDeleteModal && (
        <OAuth2ClientDeleteConfirmationModal
          client={mockOAuth2Client}
          onConfirm={handleClientDelete}
          onCancel={() => setShowClientDeleteModal(false)}
          isLoading={isClientDeleting}
          requireTypeConfirm={true}
        />
      )}

      {/* Success Notifications */}
      {notifications.map(notification => (
        <SuccessToast
          key={notification.id}
          message={notification.message}
          isVisible={notification.isVisible}
          onClose={() => hideNotification(notification.id)}
          duration={notification.duration}
          action={notification.action}
        />
      ))}
    </div>
  )
}