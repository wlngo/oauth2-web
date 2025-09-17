import { useState, useCallback } from 'react'

interface ConfirmationState {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  requireTypeConfirm?: boolean
  typeConfirmText?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

interface UseConfirmationReturn {
  confirmationState: ConfirmationState
  openConfirmation: (options: Omit<ConfirmationState, 'isOpen'>) => void
  closeConfirmation: () => void
  confirmAction: () => Promise<void>
  isLoading: boolean
}

export function useConfirmation(): UseConfirmationReturn {
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    isOpen: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const openConfirmation = useCallback((options: Omit<ConfirmationState, 'isOpen'>) => {
    setConfirmationState({
      ...options,
      isOpen: true
    })
  }, [])

  const closeConfirmation = useCallback(() => {
    setConfirmationState(prev => ({
      ...prev,
      isOpen: false
    }))
    setIsLoading(false)
    if (confirmationState.onCancel) {
      confirmationState.onCancel()
    }
  }, [confirmationState.onCancel])

  const confirmAction = useCallback(async () => {
    if (!confirmationState.onConfirm) return

    try {
      setIsLoading(true)
      await confirmationState.onConfirm()
      setConfirmationState(prev => ({ ...prev, isOpen: false }))
    } catch (error) {
      console.error('Confirmation action failed:', error)
      // Don't close the modal on error so user can retry
    } finally {
      setIsLoading(false)
    }
  }, [confirmationState.onConfirm])

  return {
    confirmationState,
    openConfirmation,
    closeConfirmation,
    confirmAction,
    isLoading
  }
}

// Preset configurations for common confirmation scenarios
export const ConfirmationPresets = {
  delete: (itemName: string) => ({
    title: '危险操作确认',
    message: `您确定要删除"${itemName}"吗？此操作不可撤销。`,
    requireTypeConfirm: true,
    typeConfirmText: '删除'
  }),
  
  dangerousAction: (actionName: string) => ({
    title: '重要操作确认',
    message: `您确定要执行"${actionName}"操作吗？`,
    requireTypeConfirm: false
  }),

  permanentChange: (changeName: string) => ({
    title: '永久更改确认',
    message: `您确定要进行"${changeName}"更改吗？此更改无法撤销。`,
    requireTypeConfirm: true,
    typeConfirmText: '确认'
  })
}