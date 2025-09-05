import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Shield, Lock } from 'lucide-react'
import {
    getPermissionsByRoleId,
    getPermissionsNotAssignedToRole,
    createRolePermissionRelation,
    deleteRolePermissionRelation,
    type CreateRolePermissionRelationRequest
} from '@/services/rolePermissionRelationService'
import type { PermissionInfo } from '@/services/permissionService'

interface RolePermissionManagementProps {
    roleId: string
    onClose?: () => void
}

export function RolePermissionManagement({ roleId, onClose }: RolePermissionManagementProps) {
    const [assignedPermissions, setAssignedPermissions] = useState<PermissionInfo[]>([])
    const [availablePermissions, setAvailablePermissions] = useState<PermissionInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [operationLoading, setOperationLoading] = useState<string | null>(null)

    // Load permissions data
    const loadPermissions = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const [assigned, available] = await Promise.all([
                getPermissionsByRoleId(roleId),
                getPermissionsNotAssignedToRole(roleId)
            ])
            setAssignedPermissions(assigned)
            setAvailablePermissions(available)
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载权限数据失败')
        } finally {
            setLoading(false)
        }
    }, [roleId])

    useEffect(() => {
        if (roleId) {
            loadPermissions()
        }
    }, [roleId, loadPermissions])

    // Assign permission to role
    const handleAssignPermission = async (permission: PermissionInfo) => {
        if (!permission.permissionId) return

        try {
            setOperationLoading(`assign-${permission.permissionId}`)
            const relationData: CreateRolePermissionRelationRequest = {
                roleId,
                permissionId: permission.permissionId
            }
            await createRolePermissionRelation(relationData)
            
            // Update local state
            setAssignedPermissions(prev => [...prev, permission])
            setAvailablePermissions(prev => prev.filter(p => p.permissionId !== permission.permissionId))
        } catch (err) {
            setError(err instanceof Error ? err.message : '分配权限失败')
        } finally {
            setOperationLoading(null)
        }
    }

    // Remove permission from role
    const handleRemovePermission = async (permission: PermissionInfo) => {
        if (!permission.permissionId) return

        try {
            setOperationLoading(`remove-${permission.permissionId}`)
            await deleteRolePermissionRelation(roleId, permission.permissionId)
            
            // Update local state
            setAvailablePermissions(prev => [...prev, permission])
            setAssignedPermissions(prev => prev.filter(p => p.permissionId !== permission.permissionId))
        } catch (err) {
            setError(err instanceof Error ? err.message : '移除权限失败')
        } finally {
            setOperationLoading(null)
        }
    }

    // Permission type color mapping
    const getPermissionTypeColor = (code: string) => {
        if (code.includes(':view')) return 'bg-blue-100 text-blue-700 border-blue-200'
        if (code.includes(':create')) return 'bg-green-100 text-green-700 border-green-200'
        if (code.includes(':update')) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
        if (code.includes(':delete')) return 'bg-red-100 text-red-700 border-red-200'
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }

    if (loading) {
        return (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">角色权限管理</h2>
                    </div>
                    {onClose && (
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Assigned Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                已分配权限 ({assignedPermissions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {assignedPermissions.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">暂无分配的权限</p>
                            ) : (
                                <div className="space-y-2">
                                    {assignedPermissions.map((permission) => (
                                        <div key={permission.permissionId} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getPermissionTypeColor(permission.permissionCode)}>
                                                        {permission.permissionCode}
                                                    </Badge>
                                                    <span className="font-medium">{permission.permissionName}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemovePermission(permission)}
                                                disabled={operationLoading === `remove-${permission.permissionId}`}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                {operationLoading === `remove-${permission.permissionId}` ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Available Permissions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                可分配权限 ({availablePermissions.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {availablePermissions.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">无可分配的权限</p>
                            ) : (
                                <div className="space-y-2">
                                    {availablePermissions.map((permission) => (
                                        <div key={permission.permissionId} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={getPermissionTypeColor(permission.permissionCode)}>
                                                        {permission.permissionCode}
                                                    </Badge>
                                                    <span className="font-medium">{permission.permissionName}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAssignPermission(permission)}
                                                disabled={operationLoading === `assign-${permission.permissionId}`}
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                                {operationLoading === `assign-${permission.permissionId}` ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                                                ) : (
                                                    <Plus className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}