import { request, getRequest } from '@/lib/http'

// API response wrapper interface
interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// Paginated response interface
interface PaginatedResponse<T> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// User interface matching the API specification
export interface UserInfo {
  userId?: string
  username?: string
  password?: string // Only used for create/update operations
  nickName?: string
  realName?: string
  email?: string
  emailVerified?: boolean
  phoneNumber?: string
  phoneNumberVerified?: boolean
  gender?: number // -1未知, 0女, 1男
  birthdate?: string
  avatarUrl?: string
  accountExpired?: boolean
  accountLocked?: boolean
  credentialsExpired?: boolean
  disabled?: boolean
  // Additional fields for UI
  createdAt?: string
  updatedAt?: string
  authorities?: string[]
}

// Create user request interface
export interface CreateUserRequest {
  username: string
  password: string
  nickName?: string
  realName?: string
  email?: string
  phoneNumber?: string
  gender?: number
  birthdate?: string
  avatarUrl?: string
}

// Update user request interface
export interface UpdateUserRequest {
  userId: string
  username?: string
  password?: string
  nickName?: string
  realName?: string
  email?: string
  phoneNumber?: string
  gender?: number
  birthdate?: string
  avatarUrl?: string
}

// Get all users with pagination
export async function getAllUsers(page: number = 0, size: number = 10): Promise<PaginatedResponse<UserInfo>> {
  const response = await request<ApiResponse<PaginatedResponse<UserInfo>>>('/api/users/getAllUsers', {
    method: 'POST',
    body: { page, size } as any,
    csrf: true
  })
  
  if (response.code !== 200) {
    throw new Error(response.msg || 'Failed to fetch users')
  }
  
  return response.data
}

// Get user by username
export async function getUserByUsername(username: string): Promise<UserInfo> {
  const response = await getRequest<ApiResponse<UserInfo>>(`/api/users/findByUsername/${username}`)
  
  if (response.code !== 200) {
    throw new Error(response.msg || 'Failed to fetch user')
  }
  
  return response.data
}

// Create new user
export async function createUser(userData: CreateUserRequest): Promise<number> {
  const response = await request<ApiResponse<number>>('/api/users/createUser', {
    method: 'POST',
    body: userData as any,
    csrf: true
  })
  
  if (response.code !== 200) {
    throw new Error(response.msg || 'Failed to create user')
  }
  
  return response.data
}

// Update existing user
export async function updateUser(userData: UpdateUserRequest): Promise<number> {
  const response = await request<ApiResponse<number>>('/api/users/updateUser', {
    method: 'POST',
    body: userData as any,
    csrf: true
  })
  
  if (response.code !== 200) {
    throw new Error(response.msg || 'Failed to update user')
  }
  
  return response.data
}

// Delete user (logical deletion)
export async function deleteUser(id: string): Promise<number> {
  const response = await request<ApiResponse<number>>(`/api/users/deleteUser/${id}`, {
    method: 'DELETE',
    csrf: true
  })
  
  if (response.code !== 200) {
    throw new Error(response.msg || 'Failed to delete user')
  }
  
  return response.data
}