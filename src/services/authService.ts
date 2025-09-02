import { request, getRequest } from '@/lib/http'

// API response wrapper interface
interface ApiResponse<T> {
    code: number
    msg: string
    data: T
    identifier: boolean
}

// Current user info from /api/auth/me
export interface CurrentUserInfo {
    username: string
    authorities: string[]
}

// Detailed user info from /api/auth/userinfo
export interface DetailedUserInfo {
    userId: string
    username: string
    nickName: string
    realName: string
    email: string
    emailVerified: boolean
    phoneNumber: string
    phoneNumberVerified: boolean
    gender: number
    birthdate: string
    avatarUrl: string
    authorities: string[]
    createdAt: string
    updatedAt: string
}

// Menu tree structure from /api/auth
export interface MenuNode {
    menuId: string
    menuName: string
    menuPath: string
    menuIcon: string
    parentId: string | null
    sortOrder: number
    menuType: number
    visible: boolean
    description: string
}

// Get current user basic info
export async function getCurrentUserInfo(): Promise<CurrentUserInfo> {
    const response = await getRequest<ApiResponse<CurrentUserInfo>>('/api/auth/me', {}, {
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch current user info')
    }

    return response.data
}

// Get current user detailed info
export async function getUserDetailedInfo(): Promise<DetailedUserInfo> {
    const response = await request<ApiResponse<DetailedUserInfo>>('/api/auth/userinfo', {
        method: 'POST',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch detailed user info')
    }

    return response.data
}

// Get user menu tree
export async function getUserMenuTree(): Promise<Record<string, MenuNode>> {
    const response = await request<ApiResponse<Record<string, MenuNode>>>('/api/auth', {
        method: 'POST',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch user menu tree')
    }

    return response.data
}