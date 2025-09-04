import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { CreateRoleRequest, UpdateRoleRequest, RoleInfo } from "@/services/roleService"

interface RoleFormProps {
  role?: RoleInfo // If provided, it's edit mode
  onSubmit: (roleData: CreateRoleRequest | UpdateRoleRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function RoleForm({ role, onSubmit, onCancel, isLoading }: RoleFormProps) {
  const isEditMode = !!role
  const [formData, setFormData] = useState({
    roleName: role?.roleName || "",
    roleContent: role?.roleContent || "",
    description: role?.description || ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.roleName.trim()) {
      newErrors.roleName = "角色名称不能为空"
    }

    if (!formData.roleContent.trim()) {
      newErrors.roleContent = "角色编码不能为空"
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
          roleId: role!.roleId!,
          ...formData
        } as UpdateRoleRequest)
      } else {
        await onSubmit(formData as CreateRoleRequest)
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
            {isEditMode ? "编辑角色" : "新增角色"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="roleName">角色名称 *</Label>
            <Input
              id="roleName"
              value={formData.roleName}
              onChange={(e) => handleInputChange('roleName', e.target.value)}
              placeholder="请输入角色名称"
              className={errors.roleName ? 'border-red-500' : ''}
            />
            {errors.roleName && (
              <p className="text-red-500 text-sm mt-1">{errors.roleName}</p>
            )}
          </div>

          <div>
            <Label htmlFor="roleContent">角色编码 *</Label>
            <Input
              id="roleContent"
              value={formData.roleContent}
              onChange={(e) => handleInputChange('roleContent', e.target.value)}
              placeholder="请输入角色编码"
              className={errors.roleContent ? 'border-red-500' : ''}
            />
            {errors.roleContent && (
              <p className="text-red-500 text-sm mt-1">{errors.roleContent}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">描述</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="请输入角色描述"
            />
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