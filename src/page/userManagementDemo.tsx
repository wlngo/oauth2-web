import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserForm } from "@/components/UserForm"
import { UserDetailModal } from "@/components/UserDetailModal"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"
import { Plus, Search, Eye, Edit, Trash2, Mail, Phone, CheckCircle, XCircle } from "lucide-react"
import type { UserInfo, CreateUserRequest, UpdateUserRequest } from "@/services/userService"

// Mock data for demonstration
const mockUsers: UserInfo[] = [
  {
    userId: "1",
    username: "admin",
    nickName: "管理员",
    realName: "张三",
    email: "admin@example.com",
    emailVerified: true,
    phoneNumber: "13800138000",
    phoneNumberVerified: true,
    gender: 1,
    birthdate: "1990-01-01",
    avatarUrl: "https://example.com/avatar.png",
    accountExpired: false,
    accountLocked: false,
    credentialsExpired: false,
    disabled: false,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-15T00:00:00.000Z",
    authorities: ["USER", "ADMIN"]
  },
  {
    userId: "2",
    username: "user1",
    nickName: "用户一",
    realName: "李四",
    email: "user1@example.com",
    emailVerified: false,
    phoneNumber: "13800138001",
    phoneNumberVerified: true,
    gender: 0,
    birthdate: "1992-05-15",
    avatarUrl: "",
    accountExpired: false,
    accountLocked: false,
    credentialsExpired: false,
    disabled: false,
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-16T00:00:00.000Z",
    authorities: ["USER"]
  },
  {
    userId: "3",
    username: "moderator",
    nickName: "版主",
    realName: "王五",
    email: "mod@example.com",
    emailVerified: true,
    phoneNumber: "13800138002",
    phoneNumberVerified: false,
    gender: 1,
    birthdate: "1988-12-20",
    avatarUrl: "",
    accountExpired: false,
    accountLocked: true,
    credentialsExpired: false,
    disabled: false,
    createdAt: "2024-01-03T00:00:00.000Z",
    updatedAt: "2024-01-17T00:00:00.000Z",
    authorities: ["USER", "MODERATOR"]
  }
]

export default function UserManagementDemo() {
  const [users, setUsers] = useState<UserInfo[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserForm, setShowUserForm] = useState(false)
  const [showUserDetail, setShowUserDetail] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [editingUser, setEditingUser] = useState<UserInfo | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
  const [deletingUser, setDeletingUser] = useState<UserInfo | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nickName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.realName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("zh-CN")
  }



  const handleAddUser = () => {
    setEditingUser(null)
    setShowUserForm(true)
  }

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.userId === userId)
    if (user) {
      setEditingUser(user)
      setShowUserForm(true)
    }
  }

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.userId === userId)
    if (user) {
      setDeletingUser(user)
      setShowDeleteConfirmation(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!deletingUser) return

    try {
      setDeleteLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUsers(prev => prev.filter(u => u.userId !== deletingUser.userId))
      setShowDeleteConfirmation(false)
      setDeletingUser(null)
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('删除用户失败')
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false)
    setDeletingUser(null)
  }

  const handleViewUser = (userId: string) => {
    const user = users.find(u => u.userId === userId)
    if (user) {
      setSelectedUser(user)
      setShowUserDetail(true)
    }
  }

  const handleFormSubmit = async (userData: CreateUserRequest | UpdateUserRequest) => {
    try {
      setFormLoading(true)
      
      if (editingUser) {
        // Simulate API update
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUsers(prev => prev.map(u => 
          u.userId === editingUser.userId 
            ? { ...u, ...userData, updatedAt: new Date().toISOString() }
            : u
        ))
      } else {
        // Simulate API create
        await new Promise(resolve => setTimeout(resolve, 1000))
        const newUser: UserInfo = {
          ...userData,
          userId: String(Date.now()),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          emailVerified: false,
          phoneNumberVerified: false,
          accountExpired: false,
          accountLocked: false,
          credentialsExpired: false,
          disabled: false,
          authorities: ["USER"]
        }
        setUsers(prev => [...prev, newUser])
      }
      
      setShowUserForm(false)
      setEditingUser(null)
    } catch (err) {
      console.error('Failed to save user:', err)
      alert('保存用户失败')
    } finally {
      setFormLoading(false)
    }
  }

  const handleFormCancel = () => {
    setShowUserForm(false)
    setEditingUser(null)
  }

  const handleDetailClose = () => {
    setShowUserDetail(false)
    setSelectedUser(null)
  }

  const handleDetailEdit = (userId: string) => {
    setShowUserDetail(false)
    setSelectedUser(null)
    handleEditUser(userId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-2xl">用户管理演示</CardTitle>
                <p className="text-muted-foreground mt-1">
                  完整的用户CRUD操作功能演示
                </p>
              </div>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" />
                添加用户
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="搜索用户名、昵称、邮箱..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Users Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredUsers.map((user) => (
                <Card key={user.userId} className="relative">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* User Info */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatarUrl} alt={user.nickName} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {getInitials(user.nickName || user.realName || user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {user.nickName || user.realName}
                          </h3>
                          <p className="text-xs text-muted-foreground truncate">
                            @{user.username}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {user.disabled && (
                              <Badge variant="destructive" className="text-xs px-1 py-0">禁用</Badge>
                            )}
                            {user.accountLocked && (
                              <Badge variant="secondary" className="text-xs px-1 py-0">锁定</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1">
                        {user.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{user.email}</span>
                            {user.emailVerified ? (
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                        )}
                        {user.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-3 w-3" />
                            <span>{user.phoneNumber}</span>
                            {user.phoneNumberVerified ? (
                              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                        )}
                      </div>



                      {/* Creation Date */}
                      <div className="text-xs text-muted-foreground">
                        创建于 {formatDate(user.createdAt)}
                      </div>

                      {/* Actions */}
                      <div className="space-y-2 pt-2 border-t bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 rounded-lg p-3 -mx-1">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-500 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleViewUser(user.userId!)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          查看
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-500 hover:border-green-600 shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleEditUser(user.userId!)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 hover:border-red-600 shadow-md hover:shadow-lg transition-all duration-200"
                          onClick={() => handleDeleteUser(user.userId!)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground border-t pt-4">
              <div>
                显示 {filteredUsers.length} 个用户，共 {users.length} 个用户
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showUserForm && (
        <UserForm
          user={editingUser || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
          isLoading={formLoading}
        />
      )}

      {showUserDetail && selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={handleDetailClose}
          onEdit={handleDetailEdit}
        />
      )}

      {showDeleteConfirmation && deletingUser && (
        <DeleteConfirmationModal
          user={deletingUser}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          isLoading={deleteLoading}
        />
      )}
    </div>
  )
}