import { X, Trash2, AlertTriangle, Shield, Clock, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"

interface OAuth2Client {
  id?: string
  clientId: string
  clientName: string
  clientSecret?: string
  scopes?: string
  redirectUris?: string
  grantTypes?: string
}

interface OAuth2ClientDeleteConfirmationModalProps {
  client: OAuth2Client
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  requireTypeConfirm?: boolean
}

export function OAuth2ClientDeleteConfirmationModal({ 
  client, 
  onConfirm, 
  onCancel, 
  isLoading = false,
  requireTypeConfirm = true
}: OAuth2ClientDeleteConfirmationModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const [buttonEnabled, setButtonEnabled] = useState(false)
  const [countdown, setCountdown] = useState(requireTypeConfirm ? 3 : 0)
  
  const typeConfirmText = "删除"

  // Countdown timer for button activation
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Check if confirmation conditions are met
  useEffect(() => {
    if (requireTypeConfirm) {
      setButtonEnabled(countdown === 0 && confirmText.trim() === typeConfirmText)
    } else {
      setButtonEnabled(countdown === 0)
    }
  }, [confirmText, countdown, requireTypeConfirm, typeConfirmText])

  const handleConfirm = () => {
    if (buttonEnabled && !isLoading) {
      onConfirm()
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600 animate-pulse" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              危险操作确认
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
          {/* Client Info Display */}
          <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
            <Database className="h-8 w-8 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {client.clientName}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 truncate font-mono">
                {client.clientId}
              </div>
              {client.scopes && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  权限: {client.scopes}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Warning Message */}
          <div className="text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-red-600" />
              <p className="font-semibold text-red-800 dark:text-red-400">您即将删除此OAuth2客户端</p>
            </div>
            <div className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 p-3 rounded border-l-4 border-red-500">
              <div className="font-medium mb-2">⚠️ 警告：此操作不可撤销</div>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>客户端的所有配置信息将被永久删除</li>
                <li>相关的授权令牌将立即失效</li>
                <li>使用此客户端的应用程序将无法访问</li>
                <li>重定向URI和授权范围配置将丢失</li>
                <li>此操作无法恢复，请谨慎确认</li>
              </ul>
            </div>
          </div>

          {/* Type-to-confirm section */}
          {requireTypeConfirm && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                为确认删除操作，请在下方输入：<span className="font-mono font-bold text-red-600">"{typeConfirmText}"</span>
              </label>
              <Input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={`请输入"${typeConfirmText}"以确认`}
                disabled={isLoading}
                className="font-mono"
                autoComplete="off"
              />
              {requireTypeConfirm && confirmText && confirmText !== typeConfirmText && (
                <p className="text-xs text-red-600">请输入正确的确认文本</p>
              )}
            </div>
          )}

          {/* Countdown and safety timer */}
          {countdown > 0 && (
            <div className="flex items-center justify-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded border border-amber-200">
              <Clock className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-amber-700 dark:text-amber-400">
                安全等待中... {countdown}秒后可确认操作
              </span>
            </div>
          )}

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
              onClick={handleConfirm}
              disabled={!buttonEnabled || isLoading}
              className={`flex-1 ${
                buttonEnabled && !isLoading
                  ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700'
                  : 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed'
              }`}
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
                  {countdown > 0 && <span className="text-xs">({countdown}s)</span>}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}