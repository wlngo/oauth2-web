import { request, getRequest } from '@/lib/http'

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

// Role permission relation interface
export interface RolePermissionRelation {
    id?: string
    roleId: string
    permissionId: string
}

// Create role permission relation request interface
export interface CreateRolePermissionRelationRequest {
    roleId: string
    permissionId: string
}

// Update role permission relation request interface
export interface UpdateRolePermissionRelationRequest {
    id: string
    roleId: string
    permissionId: string
}

// Get all role permission relations with pagination
export async function getRolePermissionRelations(page: number = 1, size: number = 10, roleId?: string, permissionId?: string): Promise<PaginatedResponse<RolePermissionRelation>> {
    const params: Record<string, any> = {
        page: page,
        size: size
    }
    if (roleId) params.roleId = roleId
    if (permissionId) params.permissionId = permissionId

    const response = await getRequest<ApiResponse<PaginatedResponse<RolePermissionRelation>>>('/api/role-permission-relations/list', params)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch role permission relations')
    }

    return response.data
}

// Get role permission relation by ID
export async function getRolePermissionRelationById(id: string): Promise<RolePermissionRelation> {
    const response = await getRequest<ApiResponse<RolePermissionRelation>>(`/api/role-permission-relations/${id}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch role permission relation')
    }

    return response.data
}

// Get role permission relations by role ID
export async function getRolePermissionRelationsByRole(roleId: string): Promise<RolePermissionRelation[]> {
    const response = await getRequest<ApiResponse<RolePermissionRelation[]>>(`/api/role-permission-relations/by-role/${roleId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch role permission relations by role')
    }

    return response.data
}

// Get role permission relations by permission ID
export async function getRolePermissionRelationsByPermission(permissionId: string): Promise<RolePermissionRelation[]> {
    const response = await getRequest<ApiResponse<RolePermissionRelation[]>>(`/api/role-permission-relations/by-permission/${permissionId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch role permission relations by permission')
    }

    return response.data
}

// Create new role permission relation
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

// Update existing role permission relation
export async function updateRolePermissionRelation(relationData: UpdateRolePermissionRelationRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/role-permission-relations/update', {
        method: 'PUT',
        body: JSON.stringify(relationData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to update role permission relation')
    }

    return response.data
}

// Delete role permission relation by ID
export async function deleteRolePermissionRelation(id: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/role-permission-relations/${id}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete role permission relation')
    }

    return response.data
}

// Delete role permission relation by role and permission ID
export async function deleteRolePermissionRelationByRoleAndPermission(roleId: string, permissionId: string): Promise<number> {
    const params = new URLSearchParams({ roleId, permissionId })
    const response = await request<ApiResponse<number>>(`/api/role-permission-relations/by-role-permission?${params.toString()}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete role permission relation')
    }

    return response.data
}