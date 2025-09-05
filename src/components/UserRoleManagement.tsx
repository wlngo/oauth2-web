import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Shield, Users } from 'lucide-react'
import {
    getRolesByUserId,
    getRolesNotAssignedToUser,
    createUserRoleRelation,
    deleteUserRoleRelationByUserAndRole,
    type CreateUserRoleRelationRequest
} from '@/services/userRoleRelationService'
import type { RoleInfo } from '@/services/roleService'

interface UserRoleManagementProps {
    userId: string
    onClose?: () => void
}

export function UserRoleManagement({ userId, onClose }: UserRoleManagementProps) {
    const [assignedRoles, setAssignedRoles] = useState<RoleInfo[]>([])
    const [availableRoles, setAvailableRoles] = useState<RoleInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [operationLoading, setOperationLoading] = useState<string | null>(null)

    // Load roles data
    const loadRoles = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const [assigned, available] = await Promise.all([
                getRolesByUserId(userId),
                getRolesNotAssignedToUser(userId)
            ])
            setAssignedRoles(assigned)
            setAvailableRoles(available)
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载角色数据失败')
        } finally {
            setLoading(false)
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            loadRoles()
        }
    }, [userId, loadRoles])

    // Assign role to user
    const handleAssignRole = async (role: RoleInfo) => {
        if (!role.roleId) return

        try {
            setOperationLoading(`assign-${role.roleId}`)
            const relationData: CreateUserRoleRelationRequest = {
                userId,
                roleId: role.roleId
            }
            await createUserRoleRelation(relationData)
            
            // Update local state
            setAssignedRoles(prev => [...prev, role])
            setAvailableRoles(prev => prev.filter(r => r.roleId !== role.roleId))
        } catch (err) {
            setError(err instanceof Error ? err.message : '分配角色失败')
        } finally {
            setOperationLoading(null)
        }
    }

    // Remove role from user
    const handleRemoveRole = async (role: RoleInfo) => {
        if (!role.roleId) return

        try {
            setOperationLoading(`remove-${role.roleId}`)
            await deleteUserRoleRelationByUserAndRole(userId, role.roleId)
            
            // Update local state
            setAvailableRoles(prev => [...prev, role])
            setAssignedRoles(prev => prev.filter(r => r.roleId !== role.roleId))
        } catch (err) {
            setError(err instanceof Error ? err.message : '移除角色失败')
        } finally {
            setOperationLoading(null)
        }
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
                        <Users className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">用户角色管理</h2>
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
                    {/* Assigned Roles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                已分配角色 ({assignedRoles.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {assignedRoles.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">暂无分配的角色</p>
                            ) : (
                                <div className="space-y-2">
                                    {assignedRoles.map((role) => (
                                        <div key={role.roleId} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{role.roleContent}</Badge>
                                                    <span className="font-medium">{role.roleName}</span>
                                                </div>
                                                {role.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveRole(role)}
                                                disabled={operationLoading === `remove-${role.roleId}`}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                {operationLoading === `remove-${role.roleId}` ? (
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

                    {/* Available Roles */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                可分配角色 ({availableRoles.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {availableRoles.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">无可分配的角色</p>
                            ) : (
                                <div className="space-y-2">
                                    {availableRoles.map((role) => (
                                        <div key={role.roleId} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline">{role.roleContent}</Badge>
                                                    <span className="font-medium">{role.roleName}</span>
                                                </div>
                                                {role.description && (
                                                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleAssignRole(role)}
                                                disabled={operationLoading === `assign-${role.roleId}`}
                                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            >
                                                {operationLoading === `assign-${role.roleId}` ? (
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