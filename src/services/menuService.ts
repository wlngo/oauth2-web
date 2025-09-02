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

// Menu interface matching the API specification
export interface MenuInfo {
    menuId?: string
    menuName: string
    menuPath: string
    menuIcon: string
    parentId?: string | null
    sortOrder: number
    menuType: number // 0目录 1菜单 2按钮
    visible: boolean
    description?: string
    createdAt?: string
    createId?: string
    updatedAt?: string
    updateId?: string
}

// Create menu request interface
export interface CreateMenuRequest {
    menuName: string
    menuPath: string
    menuIcon: string
    parentId?: string
    sortOrder: number
    menuType: number
    visible: boolean
    description?: string
}

// Update menu request interface
export interface UpdateMenuRequest {
    menuId: string
    menuName: string
    menuPath: string
    menuIcon: string
    parentId?: string | null
    sortOrder: number
    menuType: number
    visible: boolean
    description?: string
}

// Get all menus with pagination
export async function getAllMenus(page: number = 1, size: number = 10, keyword?: string): Promise<PaginatedResponse<MenuInfo>> {
    const response = await formRequest<ApiResponse<PaginatedResponse<MenuInfo>>>('/api/menus/getAllMenus', {
        page: page,
        size: size,
        ...(keyword ? { keyword } : {})
    }, {
        method: 'POST',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch menus')
    }

    return response.data
}

// Get menu by ID
export async function getMenuById(id: string): Promise<MenuInfo> {
    const response = await getRequest<ApiResponse<MenuInfo>>(`/api/menus/${id}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch menu')
    }

    return response.data
}

// Create new menu
export async function createMenu(menuData: CreateMenuRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/menus/createMenu', {
        method: 'POST',
        body: JSON.stringify(menuData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to create menu')
    }

    return response.data
}

// Update existing menu
export async function updateMenu(menuData: UpdateMenuRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/menus/updateMenu', {
        method: 'POST',
        body: JSON.stringify(menuData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to update menu')
    }

    return response.data
}

// Delete menu
export async function deleteMenu(id: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/menus/deleteMenu/${id}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete menu')
    }

    return response.data
}