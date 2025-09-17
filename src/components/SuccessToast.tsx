import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface SuccessToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export function SuccessToast({ 
  message, 
  isVisible, 
  onClose, 
  duration = 4000,
  action 
}: SuccessToastProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!isVisible) {
      setProgress(100)
      return
    }

    const timer = setTimeout(onClose, duration)
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - (100 / (duration / 100))
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-[60] animate-in slide-in-from-top-2 duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-green-200 dark:border-green-800 min-w-[320px] max-w-md">
        {/* Progress bar */}
        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                操作成功
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {message}
              </p>
              {action && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={action.onClick}
                    className="text-green-700 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/20"
                  >
                    {action.label}
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}