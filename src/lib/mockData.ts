// Mock data for admin dashboard

export interface User {
  id: string
  username: string
  email: string
  realName: string
  avatar?: string
  status: 'active' | 'inactive' | 'pending'
  role: 'admin' | 'user' | 'moderator'
  createdAt: string
  lastLogin?: string
}

export interface SystemStats {
  totalUsers: number
  activeUsers: number
  totalApplications: number
  successfulLogins: number
  failedLogins: number
  systemUptime: string
}

export interface Application {
  id: string
  name: string
  clientId: string
  description: string
  redirectUris: string[]
  scopes: string[]
  status: 'active' | 'inactive'
  createdAt: string
  lastUsed?: string
}

export interface ActivityLog {
  id: string
  userId: string
  username: string
  action: string
  description: string
  timestamp: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning'
}

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    realName: '管理员',
    status: 'active',
    role: 'admin',
    createdAt: '2024-01-15T08:30:00Z',
    lastLogin: '2024-12-19T10:15:30Z'
  },
  {
    id: '2',
    username: 'john_doe',
    email: 'john.doe@example.com',
    realName: '约翰·多伊',
    status: 'active',
    role: 'user',
    createdAt: '2024-02-20T14:20:00Z',
    lastLogin: '2024-12-18T16:45:20Z'
  },
  {
    id: '3',
    username: 'jane_smith',
    email: 'jane.smith@example.com',
    realName: '简·史密斯',
    status: 'active',
    role: 'moderator',
    createdAt: '2024-03-10T09:15:00Z',
    lastLogin: '2024-12-19T08:20:15Z'
  },
  {
    id: '4',
    username: 'mike_wilson',
    email: 'mike.wilson@example.com',
    realName: '迈克·威尔逊',
    status: 'inactive',
    role: 'user',
    createdAt: '2024-04-05T11:30:00Z',
    lastLogin: '2024-11-20T14:30:00Z'
  },
  {
    id: '5',
    username: 'sarah_jones',
    email: 'sarah.jones@example.com',
    realName: '莎拉·琼斯',
    status: 'pending',
    role: 'user',
    createdAt: '2024-12-18T15:45:00Z'
  }
]

// Mock system statistics
export const mockSystemStats: SystemStats = {
  totalUsers: 1234,
  activeUsers: 856,
  totalApplications: 45,
  successfulLogins: 12845,
  failedLogins: 234,
  systemUptime: '99.9%'
}

// Mock applications data
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    name: 'Web应用',
    clientId: 'web-client-001',
    description: '主要的Web应用程序',
    redirectUris: ['https://app.example.com/callback'],
    scopes: ['read', 'write', 'admin'],
    status: 'active',
    createdAt: '2024-01-10T10:00:00Z',
    lastUsed: '2024-12-19T09:30:00Z'
  },
  {
    id: 'app-2',
    name: '移动应用',
    clientId: 'mobile-client-002',
    description: 'iOS和Android移动应用',
    redirectUris: ['myapp://oauth/callback'],
    scopes: ['read', 'profile'],
    status: 'active',
    createdAt: '2024-02-15T14:30:00Z',
    lastUsed: '2024-12-18T18:45:00Z'
  },
  {
    id: 'app-3',
    name: 'API服务',
    clientId: 'api-service-003',
    description: '内部API服务应用',
    redirectUris: ['https://api.example.com/oauth/callback'],
    scopes: ['read', 'write'],
    status: 'inactive',
    createdAt: '2024-03-20T11:15:00Z',
    lastUsed: '2024-10-15T12:00:00Z'
  }
]

// Mock activity logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    userId: '1',
    username: 'admin',
    action: 'login',
    description: '用户登录系统',
    timestamp: '2024-12-19T10:15:30Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'success'
  },
  {
    id: 'log-2',
    userId: '2',
    username: 'john_doe',
    action: 'oauth_consent',
    description: '授权访问Web应用',
    timestamp: '2024-12-19T09:45:20Z',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/537.36',
    status: 'success'
  },
  {
    id: 'log-3',
    userId: '4',
    username: 'mike_wilson',
    action: 'login_failed',
    description: '登录失败 - 密码错误',
    timestamp: '2024-12-19T08:30:15Z',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/120.0.0.0',
    status: 'failed'
  },
  {
    id: 'log-4',
    userId: '3',
    username: 'jane_smith',
    action: 'user_create',
    description: '创建新用户 sarah_jones',
    timestamp: '2024-12-18T15:45:00Z',
    ipAddress: '192.168.1.103',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/121.0',
    status: 'success'
  },
  {
    id: 'log-5',
    userId: '1',
    username: 'admin',
    action: 'app_disable',
    description: '禁用应用 API服务',
    timestamp: '2024-12-18T14:20:30Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
    status: 'warning'
  }
]

// Mock API functions
export const mockApi = {
  getUsers: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay
    return mockUsers
  },

  getSystemStats: async (): Promise<SystemStats> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockSystemStats
  },

  getApplications: async (): Promise<Application[]> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockApplications
  },

  getActivityLogs: async (): Promise<ActivityLog[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockActivityLogs
  },

  updateUserStatus: async (userId: string, status: User['status']): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    const user = mockUsers.find(u => u.id === userId)
    if (user) {
      user.status = status
    }
    return user!
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    mockUsers.push(newUser)
    return newUser
  }
}