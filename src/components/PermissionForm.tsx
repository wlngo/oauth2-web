import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { CreatePermissionRequest, UpdatePermissionRequest, PermissionInfo } from "@/services/permissionService"

interface PermissionFormProps {
  permission?: PermissionInfo // If provided, it's edit mode
  onSubmit: (permissionData: CreatePermissionRequest | UpdatePermissionRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function PermissionForm({ permission, onSubmit, onCancel, isLoading }: PermissionFormProps) {
  const isEditMode = !!permission
  const [formData, setFormData] = useState({
    permissionCode: permission?.permissionCode || "",
    permissionName: permission?.permissionName || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.permissionCode.trim()) {
      newErrors.permissionCode = "权限编码不能为空"
    }

    if (!formData.permissionName.trim()) {
      newErrors.permissionName = "权限名称不能为空"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (isEditMode) {
        await onSubmit({
          permissionId: permission!.permissionId!,
          ...formData
        } as UpdatePermissionRequest)
      } else {
        await onSubmit(formData as CreatePermissionRequest)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "编辑权限" : "新增权限"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="permissionCode">权限编码 *</Label>
            <Input
              id="permissionCode"
              value={formData.permissionCode}
              onChange={(e) => handleInputChange('permissionCode', e.target.value)}
              placeholder="请输入权限编码"
              className={errors.permissionCode ? 'border-red-500' : ''}
            />
            {errors.permissionCode && (
              <p className="text-red-500 text-sm mt-1">{errors.permissionCode}</p>
            )}
          </div>

          <div>
            <Label htmlFor="permissionName">权限名称 *</Label>
            <Input
              id="permissionName"
              value={formData.permissionName}
              onChange={(e) => handleInputChange('permissionName', e.target.value)}
              placeholder="请输入权限名称"
              className={errors.permissionName ? 'border-red-500' : ''}
            />
            {errors.permissionName && (
              <p className="text-red-500 text-sm mt-1">{errors.permissionName}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "保存中..." : "保存"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}