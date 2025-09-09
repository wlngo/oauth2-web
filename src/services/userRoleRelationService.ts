import { request, getRequest } from '@/lib/http'
import type { RoleInfo } from './roleService'

// API response wrapper interface
interface ApiResponse<T> {
    code: number
    msg: string
    data: T
    identifier: boolean
}

// Paginated response interface
interface PaginatedResponse<T> {
    list: T[]
    total: number
    pageNum: number
    pageSize: number
}

// User role relation interface
export interface UserRoleRelation {
    id?: string
    userId: string
    roleId: string
}

// Create user role relation request interface
export interface CreateUserRoleRelationRequest {
    userId: string
    roleId: string
}

// Update user role relation request interface
export interface UpdateUserRoleRelationRequest {
    id: string
    userId: string
    roleId: string
}

// Get all user role relations with pagination
export async function getUserRoleRelations(page: number = 1, size: number = 10, userId?: string, roleId?: string): Promise<PaginatedResponse<UserRoleRelation>> {
    const params: Record<string, string | number | boolean> = {
        page: page,
        size: size
    }
    if (userId) params.userId = userId
    if (roleId) params.roleId = roleId

    const response = await getRequest<ApiResponse<PaginatedResponse<UserRoleRelation>>>('/api/user-role-relations/list', params)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch user role relations')
    }

    return response.data
}

// Get roles by user ID (from API documentation)
export async function getRolesByUserId(userId: string): Promise<RoleInfo[]> {
    const response = await getRequest<ApiResponse<RoleInfo[]>>(`/api/user-role-relations/queryRolesByUserId/${userId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch roles by user')
    }

    return response.data
}

// Get roles not assigned to user (from API documentation)
export async function getRolesNotAssignedToUser(userId: string): Promise<RoleInfo[]> {
    const response = await getRequest<ApiResponse<RoleInfo[]>>(`/api/user-role-relations/queryRolesNotAssignedToUser/${userId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch unassigned roles')
    }

    return response.data
}

// Get user role relation by ID
export async function getUserRoleRelationById(id: string): Promise<UserRoleRelation> {
    const response = await getRequest<ApiResponse<UserRoleRelation>>(`/api/user-role-relations/${id}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch user role relation')
    }

    return response.data
}

// Get user role relations by user ID
export async function getUserRoleRelationsByUser(userId: string): Promise<UserRoleRelation[]> {
    const response = await getRequest<ApiResponse<UserRoleRelation[]>>(`/api/user-role-relations/by-user/${userId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch user role relations by user')
    }

    return response.data
}

// Get user role relations by role ID
export async function getUserRoleRelationsByRole(roleId: string): Promise<UserRoleRelation[]> {
    const response = await getRequest<ApiResponse<UserRoleRelation[]>>(`/api/user-role-relations/by-role/${roleId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch user role relations by role')
    }

    return response.data
}

// Create new user role relation
export async function createUserRoleRelation(relationData: CreateUserRoleRelationRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/user-role-relations/create', {
        method: 'POST',
        body: JSON.stringify(relationData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to create user role relation')
    }

    return response.data
}

// Batch create user role relations
export async function batchCreateUserRoleRelations(relations: CreateUserRoleRelationRequest[]): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/user-role-relations/batch-create', {
        method: 'POST',
        body: JSON.stringify(relations),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to batch create user role relations')
    }

    return response.data
}

// Update existing user role relation
export async function updateUserRoleRelation(relationData: UpdateUserRoleRelationRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/user-role-relations/update', {
        method: 'PUT',
        body: JSON.stringify(relationData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to update user role relation')
    }

    return response.data
}

// Delete user role relation by ID
export async function deleteUserRoleRelation(id: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/user-role-relations/${id}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete user role relation')
    }

    return response.data
}

// Delete user role relation by user and role ID
export async function deleteUserRoleRelationByUserAndRole(userId: string, roleId: string): Promise<number> {
    const params = new URLSearchParams({ userId, roleId })
    const response = await request<ApiResponse<number>>(`/api/user-role-relations/by-user-role?${params.toString()}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete user role relation')
    }

    return response.data
}

// Delete all user role relations for a user (from API documentation)
export async function deleteUserRoleRelations(userId: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/user-role-relations/${userId}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete user role relations')
    }

    return response.data
}