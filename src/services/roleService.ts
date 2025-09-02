import { request, getRequest, formRequest } from '@/lib/http'

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

// Role interface matching the API specification
export interface RoleInfo {
    roleId?: string
    roleName: string
    roleContent: string
    description?: string
    createdAt?: string
    createId?: string
    updatedAt?: string
    updateId?: string
}

// Create role request interface
export interface CreateRoleRequest {
    roleName: string
    roleContent: string
    description?: string
}

// Update role request interface
export interface UpdateRoleRequest {
    roleId: string
    roleName: string
    roleContent: string
    description?: string
}

// Get all roles with pagination
export async function getAllRoles(page: number = 1, size: number = 10, keyword?: string): Promise<PaginatedResponse<RoleInfo>> {
    const response = await formRequest<ApiResponse<PaginatedResponse<RoleInfo>>>('/api/roles/getAllRoles', {
        page: page,
        size: size,
        ...(keyword ? { keyword } : {})
    }, {
        method: 'POST',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch roles')
    }

    return response.data
}

// Get role by ID
export async function getRoleById(id: string): Promise<RoleInfo> {
    const response = await getRequest<ApiResponse<RoleInfo>>(`/api/roles/${id}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch role')
    }

    return response.data
}

// Create new role
export async function createRole(roleData: CreateRoleRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/roles/createRole', {
        method: 'POST',
        body: JSON.stringify(roleData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to create role')
    }

    return response.data
}

// Update existing role
export async function updateRole(roleData: UpdateRoleRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/roles/updateRole', {
        method: 'POST',
        body: JSON.stringify(roleData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to update role')
    }

    return response.data
}

// Delete role
export async function deleteRole(id: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/roles/deleteRole/${id}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete role')
    }

    return response.data
}