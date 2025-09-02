import { X, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { UserInfo } from "@/services/userService"

interface DeleteConfirmationModalProps {
  user: UserInfo
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
}

export function DeleteConfirmationModal({ 
  user, 
  onConfirm, 
  onCancel, 
  isLoading = false 
}: DeleteConfirmationModalProps) {
  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .slice(0, 2)
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              确认删除
            </h2>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* User Info Display */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.nickName} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {getInitials(user.nickName || user.realName || user.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {user.nickName || user.realName || user.username}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                @{user.username}
              </div>
              {user.email && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </div>
              )}
            </div>
          </div>

          {/* Warning Message */}
          <div className="text-gray-700 dark:text-gray-300">
            <p className="mb-2">您确定要删除此用户吗？</p>
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
              ⚠️ 此操作不可逆，用户的所有数据将被永久删除。
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              取消
            </Button>
            <Button 
              variant="outline"
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  删除中...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  确认删除
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}