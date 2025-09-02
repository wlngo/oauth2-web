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

// Permission interface matching the API specification
export interface PermissionInfo {
    permissionId?: number
    permissionCode: string
    permissionName: string
    createAt?: string
    createId?: string
    updateAt?: string
    updateId?: string
}

// Create permission request interface
export interface CreatePermissionRequest {
    permissionCode: string
    permissionName: string
}

// Update permission request interface
export interface UpdatePermissionRequest {
    permissionId: number
    permissionCode: string
    permissionName: string
}

// Get all permissions with pagination
export async function getAllPermissions(page: number = 1, size: number = 10, keyword?: string): Promise<PaginatedResponse<PermissionInfo>> {
    const response = await formRequest<ApiResponse<PaginatedResponse<PermissionInfo>>>('/api/permissions/getAllPermissions', {
        page: page,
        size: size,
        ...(keyword ? { keyword } : {})
    }, {
        method: 'POST',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch permissions')
    }

    return response.data
}

// Get permission by ID
export async function getPermissionById(id: number): Promise<PermissionInfo> {
    const response = await getRequest<ApiResponse<PermissionInfo>>(`/api/permissions/${id}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch permission')
    }

    return response.data
}

// Create new permission
export async function createPermission(permissionData: CreatePermissionRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/permissions/createPermission', {
        method: 'POST',
        body: JSON.stringify(permissionData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to create permission')
    }

    return response.data
}

// Update existing permission
export async function updatePermission(permissionData: UpdatePermissionRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/permissions/updatePermission', {
        method: 'POST',
        body: JSON.stringify(permissionData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to update permission')
    }

    return response.data
}

// Delete permission
export async function deletePermission(id: number): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/permissions/deletePermission/${id}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete permission')
    }

    return response.data
}