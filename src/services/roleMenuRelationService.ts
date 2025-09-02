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

// Role menu relation interface
export interface RoleMenuRelation {
    id?: string
    roleId: string
    menuId: string
}

// Create role menu relation request interface
export interface CreateRoleMenuRelationRequest {
    roleId: string
    menuId: string
}

// Update role menu relation request interface
export interface UpdateRoleMenuRelationRequest {
    id: string
    roleId: string
    menuId: string
}

// Get all role menu relations with pagination
export async function getAllRoleMenuRelations(page: number = 1, size: number = 10, roleId?: string): Promise<PaginatedResponse<RoleMenuRelation>> {
    const response = await formRequest<ApiResponse<PaginatedResponse<RoleMenuRelation>>>('/api/role-menu-relations/getAllRoleMenuRelations', {
        page: page,
        size: size,
        ...(roleId ? { roleId } : {})
    }, {
        method: 'POST',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch role menu relations')
    }

    return response.data
}

// Get role menu relation by ID
export async function getRoleMenuRelationById(id: string): Promise<RoleMenuRelation> {
    const response = await getRequest<ApiResponse<RoleMenuRelation>>(`/api/role-menu-relations/${id}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch role menu relation')
    }

    return response.data
}

// Create new role menu relation
export async function createRoleMenuRelation(relationData: CreateRoleMenuRelationRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/role-menu-relations/createRoleMenuRelation', {
        method: 'POST',
        body: JSON.stringify(relationData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to create role menu relation')
    }

    return response.data
}

// Update existing role menu relation
export async function updateRoleMenuRelation(relationData: UpdateRoleMenuRelationRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/role-menu-relations/updateRoleMenuRelation', {
        method: 'POST',
        body: JSON.stringify(relationData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to update role menu relation')
    }

    return response.data
}

// Delete role menu relation
export async function deleteRoleMenuRelation(id: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/role-menu-relations/deleteRoleMenuRelation/${id}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete role menu relation')
    }

    return response.data
}