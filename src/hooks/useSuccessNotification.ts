import { useState, useCallback } from 'react'

interface SuccessNotification {
  id: string
  message: string
  isVisible: boolean
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface UseSuccessNotificationReturn {
  notifications: SuccessNotification[]
  showSuccess: (message: string, options?: {
    duration?: number
    action?: { label: string; onClick: () => void }
  }) => void
  hideNotification: (id: string) => void
}

export function useSuccessNotification(): UseSuccessNotificationReturn {
  const [notifications, setNotifications] = useState<SuccessNotification[]>([])

  const showSuccess = useCallback((
    message: string, 
    options: {
      duration?: number
      action?: { label: string; onClick: () => void }
    } = {}
  ) => {
    const id = Date.now().toString()
    const notification: SuccessNotification = {
      id,
      message,
      isVisible: true,
      duration: options.duration || 4000,
      action: options.action
    }

    setNotifications(prev => [...prev, notification])

    // Auto-remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, notification.duration)
  }, [])

  const hideNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  return {
    notifications,
    showSuccess,
    hideNotification
  }
}

// Common success message presets
export const SuccessMessages = {
  userDeleted: (username: string) => `用户 "${username}" 已成功删除`,
  userCreated: (username: string) => `用户 "${username}" 已成功创建`,
  userUpdated: (username: string) => `用户 "${username}" 信息已更新`,
  roleAssigned: (roleName: string, username: string) => `已为用户 "${username}" 分配角色 "${roleName}"`,
  roleRemoved: (roleName: string, username: string) => `已移除用户 "${username}" 的角色 "${roleName}"`,
  settingsSaved: '设置已保存',
  operationCompleted: '操作已完成',
  dataExported: '数据导出成功',
  dataImported: '数据导入成功'
}