import { request, getRequest } from '@/lib/http'
import type { PermissionInfo } from './permissionService'

// API response wrapper interface
interface ApiResponse<T> {
    code: number
    msg: string
    data: T
    identifier: boolean
}

// Role permission relation interface
export interface RolePermissionRelation {
    id?: string
    roleId: string
    permissionId: number
}

// Create role permission relation request interface
export interface CreateRolePermissionRelationRequest {
    roleId: string
    permissionId: number
}

// Get permissions by role ID
export async function getPermissionsByRoleId(roleId: string): Promise<PermissionInfo[]> {
    const response = await getRequest<ApiResponse<PermissionInfo[]>>(`/api/role-permission-relations/queryPermissionByRoleId/${roleId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch permissions by role')
    }

    return response.data
}

// Get permissions not assigned to role
export async function getPermissionsNotAssignedToRole(roleId: string): Promise<PermissionInfo[]> {
    const response = await getRequest<ApiResponse<PermissionInfo[]>>(`/api/role-permission-relations/queryPermissionNotAssignedToRoleId/${roleId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch unassigned permissions')
    }

    return response.data
}

// Create single role permission relation
export async function createRolePermissionRelation(relationData: CreateRolePermissionRelationRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/role-permission-relations/create', {
        method: 'POST',
        body: JSON.stringify(relationData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to create role permission relation')
    }

    return response.data
}

// Batch create role permission relations
export async function batchCreateRolePermissionRelations(relations: CreateRolePermissionRelationRequest[]): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/role-permission-relations/batch-create', {
        method: 'POST',
        body: JSON.stringify(relations),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to batch create role permission relations')
    }

    return response.data
}

// Delete all role permission relations for a role
export async function deleteRolePermissionRelations(roleId: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/role-permission-relations/${roleId}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete role permission relations')
    }

    return response.data
}

// Delete specific role permission relation
export async function deleteRolePermissionRelation(roleId: string, permissionId: number): Promise<number> {
    const params = new URLSearchParams({ 
        roleId, 
        permissionId: permissionId.toString() 
    })
    const response = await request<ApiResponse<number>>(`/api/role-permission-relations/by-role-permission?${params.toString()}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete role permission relation')
    }

    return response.data
}