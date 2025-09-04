import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import type { CreateRolePermissionRelationRequest, UpdateRolePermissionRelationRequest, RolePermissionRelation } from "@/services/rolePermissionRelationService"
import type { RoleInfo } from "@/services/roleService"
import type { PermissionInfo } from "@/services/permissionService"
import { getAllRoles } from "@/services/roleService"
import { getAllPermissions } from "@/services/permissionService"

interface RolePermissionRelationFormProps {
  relation?: RolePermissionRelation // If provided, it's edit mode
  onSubmit: (relationData: CreateRolePermissionRelationRequest | UpdateRolePermissionRelationRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function RolePermissionRelationForm({ relation, onSubmit, onCancel, isLoading }: RolePermissionRelationFormProps) {
  const isEditMode = !!relation
  const [formData, setFormData] = useState({
    roleId: relation?.roleId || "",
    permissionId: relation?.permissionId || ""
  })

  const [roles, setRoles] = useState<RoleInfo[]>([])
  const [permissions, setPermissions] = useState<PermissionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load roles and permissions
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [rolesData, permissionsData] = await Promise.all([
          getAllRoles(1, 1000), // Get all roles
          getAllPermissions(1, 1000) // Get all permissions
        ])
        setRoles(rolesData.list)
        setPermissions(permissionsData.list)
      } catch (error) {
        console.error('Failed to load roles and permissions:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.roleId) {
      newErrors.roleId = "请选择角色"
    }

    if (!formData.permissionId) {
      newErrors.permissionId = "请选择权限"
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
          id: relation!.id!,
          ...formData
        } as UpdateRolePermissionRelationRequest)
      } else {
        await onSubmit(formData as CreateRolePermissionRelationRequest)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user makes selection
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "编辑角色权限关系" : "新增角色权限关系"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="roleId">角色 *</Label>
              <select
                id="roleId"
                value={formData.roleId}
                onChange={(e) => handleSelectChange('roleId', e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.roleId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">请选择角色</option>
                {roles.map((role) => (
                  <option key={role.roleId} value={role.roleId}>
                    {role.roleName}
                  </option>
                ))}
              </select>
              {errors.roleId && (
                <p className="text-red-500 text-sm mt-1">{errors.roleId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="permissionId">权限 *</Label>
              <select
                id="permissionId"
                value={formData.permissionId}
                onChange={(e) => handleSelectChange('permissionId', e.target.value)}
                className={`w-full p-2 border rounded-md ${errors.permissionId ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">请选择权限</option>
                {permissions.map((permission) => (
                  <option key={permission.permissionId} value={permission.permissionId?.toString()}>
                    {permission.permissionName}
                  </option>
                ))}
              </select>
              {errors.permissionId && (
                <p className="text-red-500 text-sm mt-1">{errors.permissionId}</p>
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
        )}
      </div>
    </div>
  )
}