import {useState, useEffect, useCallback} from "react"
import {useNavigate} from "@tanstack/react-router"
import {request} from "@/lib/http"
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Shield,
    Mail,
    Phone,
    Calendar,
    CheckCircle,
    XCircle,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Users,
    LogOut,
    User
} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarNav,
    SidebarNavItem,
    SidebarMain,
    SidebarToggle,
} from "@/components/ui/sidebar"
import {Separator} from "@/components/ui/separator"
import {UserForm} from "@/components/UserForm"
import {UserDetailModal} from "@/components/UserDetailModal"
import {DeleteConfirmationModal} from "@/components/DeleteConfirmationModal"
import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
} from "@/services/userService"
import type {
    UserInfo,
    CreateUserRequest,
    UpdateUserRequest
} from "@/services/userService"
import { getAdminNavItems, handleAdminNavigation } from "@/lib/adminNavigation"

interface LogoutResponse {
    code: number
    msg?: string
}

export default function UserManagement() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [users, setUsers] = useState<UserInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [logoutError, setLogoutError] = useState("")
    const [activeItem, setActiveItem] = useState("users")

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [totalUsers, setTotalUsers] = useState(0)

    // Modal states
    const [showUserForm, setShowUserForm] = useState(false)
    const [showUserDetail, setShowUserDetail] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [editingUser, setEditingUser] = useState<UserInfo | null>(null)
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)
    const [deletingUser, setDeletingUser] = useState<UserInfo | null>(null)
    const [formLoading, setFormLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Page jump functionality
    const [jumpToPage, setJumpToPage] = useState("")

    // Load users function with keyword support
    const loadUsers = useCallback(async (keyword?: string) => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAllUsers(currentPage, pageSize, keyword)
            setUsers(data.list)
            setTotalUsers(data.total)
        } catch (err) {
            console.error('Failed to load users:', err)
            setError(err instanceof Error ? err.message : '加载用户列表失败')
            // Fallback to empty list if API fails
            setUsers([])
            setTotalUsers(0)
        } finally {
            setLoading(false)
        }
    }, [currentPage, pageSize])

    // Debounced search effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            loadUsers(searchTerm || undefined)
        }, 300) // 300ms debounce

        return () => clearTimeout(timeoutId)
    }, [searchTerm, loadUsers])

    // Load users on component mount and when page changes (not for search - that's handled by debounced effect)
    useEffect(() => {
        if (!searchTerm) { // Only load when not searching, search is handled by debounced effect
            loadUsers()
        }
    }, [currentPage, pageSize, loadUsers]) // eslint-disable-line react-hooks/exhaustive-deps

    const handleNavigation = (id: string) => {
        setActiveItem(id)
        handleAdminNavigation(id, navigate)
    }

    const goHome = () => {
        navigate({to: "/"})
    }

    const goToProfile = () => {
        navigate({to: "/admin/profile"})
    }

    const goBack = () => {
        navigate({to: "/admin"})
    }

    const handleLogout = async () => {
        setLogoutError("")
        try {
            const res = await request<LogoutResponse>("/logout", {
                method: "POST",
                csrf: true,
                csrfUseCache: false,
            });

            if (res.code == 200) {
                navigate({to: "/login"})
            } else {
                setLogoutError(res.msg || "登出失败")
            }

        } catch (err: unknown) {
            setLogoutError(err instanceof Error ? err.message : "登出请求异常")
        }
    }

    const adminNavItems = getAdminNavItems(activeItem)

    const getInitials = (name?: string) => {
        if (!name) return "U"
        return name
            .split(" ")
            .map(word => word.charAt(0).toUpperCase())
            .join("")
            .slice(0, 2)
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return "-"
        return new Date(dateString).toLocaleDateString("zh-CN")
    }

    const getGenderText = (gender?: number) => {
        switch (gender) {
            case 1:
                return "男"
            case 2:
                return "女"
            default:
                return "未知"
        }
    }

    const getRoleDisplay = (authorities?: string[]) => {
        if (!authorities || authorities.length === 0) return "无角色"

        const roleMap: Record<string, { label: string; color: string }> = {
            ADMIN: {label: "管理员", color: "bg-red-100 text-red-700"},
            MODERATOR: {label: "版主", color: "bg-blue-100 text-blue-700"},
            USER: {label: "用户", color: "bg-gray-100 text-gray-700"}
        }

        return authorities.map(auth => (
            <Badge
                key={auth}
                className={`mr-1 ${roleMap[auth]?.color || "bg-gray-100 text-gray-700"}`}
            >
                {roleMap[auth]?.label || auth}
            </Badge>
        ))
    }

    // Users are now filtered by API, no need for client-side filtering
    const displayedUsers = users

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

    const handleDeleteUser = async (userId: string) => {
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
            await deleteUser(deletingUser.userId!)
            await loadUsers(searchTerm || undefined) // Reload the user list
            setShowDeleteConfirmation(false)
            setDeletingUser(null)
            // Optionally show success message
        } catch (err) {
            console.error('Failed to delete user:', err)
            alert(err instanceof Error ? err.message : '删除用户失败')
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
                // Update existing user
                await updateUser(userData as UpdateUserRequest)
            } else {
                // Create new user
                await createUser(userData as CreateUserRequest)
            }

            setShowUserForm(false)
            setEditingUser(null)
            await loadUsers(searchTerm || undefined) // Reload the user list
            // Optionally show success message
        } catch (err) {
            console.error('Failed to save user:', err)
            alert(err instanceof Error ? err.message : '保存用户失败')
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

    const handleJumpToPage = () => {
        const pageNum = parseInt(jumpToPage)
        const totalPages = Math.ceil(totalUsers / pageSize)
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum)
            setJumpToPage("")
        }
    }

    const handleJumpInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleJumpToPage()
        }
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        // 重置页数
        setCurrentPage(1)
    }

    return (
        <SidebarProvider>
            <SidebarToggle/>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <div
                            className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                            <Shield className="size-4"/>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">OAuth2 管理后台</h2>
                            <p className="text-xs text-sidebar-foreground/60">用户管理</p>
                        </div>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarNav>
                        {adminNavItems.map((item) => (
                            <SidebarNavItem
                                key={item.id}
                                active={activeItem === item.id}
                                onClick={() => handleNavigation(item.id)}
                            >
                                <item.icon className="h-4 w-4"/>
                                {item.label}
                            </SidebarNavItem>
                        ))}
                    </SidebarNav>

                    <Separator className="my-4"/>

                    <SidebarNav>
                        <SidebarNavItem onClick={goHome}>
                            <ArrowLeft className="h-4 w-4"/>
                            返回首页
                        </SidebarNavItem>
                        <SidebarNavItem onClick={goToProfile}>
                            <User className="h-4 w-4"/>
                            个人资料
                        </SidebarNavItem>
                        <SidebarNavItem onClick={handleLogout}>
                            <LogOut className="h-4 w-4"/>
                            退出登录
                        </SidebarNavItem>
                    </SidebarNav>
                </SidebarContent>
            </Sidebar>

            <SidebarMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
                            <Button variant="outline" size="sm" onClick={goBack} className="w-fit">
                                <ArrowLeft className="h-4 w-4 mr-2"/>
                                返回仪表板
                            </Button>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold">用户管理</h1>
                                <p className="text-muted-foreground">管理系统用户账户和权限</p>
                            </div>
                        </div>
                        <Button onClick={handleAddUser} className="w-fit">
                            <Plus className="h-4 w-4 mr-2"/>
                            添加用户
                        </Button>
                    </div>

                    {/* Search and Filter */}
                    <Card>
                        <CardHeader>
                            <CardTitle>用户列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 mb-6">
                                <div className="relative flex-1 max-w-sm">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                                    <Input
                                        placeholder="搜索用户名、昵称、邮箱..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="pl-10"
                                    />
                                </div>
                                <Button variant="outline" size="sm" className="w-fit">
                                    <Filter className="h-4 w-4 mr-2"/>
                                    过滤
                                </Button>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div
                                            className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                        <p className="text-muted-foreground">加载用户列表中...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <Button onClick={() => loadUsers(searchTerm || undefined)} variant="outline">
                                            重新加载
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && users.length === 0 && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                                        <p className="text-muted-foreground mb-4">暂无用户</p>
                                        <Button onClick={handleAddUser}>
                                            <Plus className="h-4 w-4 mr-2"/>
                                            添加第一个用户
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Users Table - Mobile Responsive */}
                            {!loading && !error && users.length > 0 && (
                                <div className="rounded-md border overflow-hidden">
                                    {/* Desktop Table */}
                                    <div className="hidden lg:block">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>用户</TableHead>
                                                    <TableHead>联系信息</TableHead>
                                                    <TableHead>验证状态</TableHead>
                                                    <TableHead>角色权限</TableHead>
                                                    <TableHead>创建时间</TableHead>
                                                    <TableHead className="text-right">操作</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {displayedUsers.map((user) => (
                                                    <TableRow key={user.userId}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage src={user.avatarUrl}
                                                                                 alt={user.nickName}/>
                                                                    <AvatarFallback
                                                                        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                                        {getInitials(user.nickName || user.realName || user.username)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <div
                                                                        className="font-medium">{user.nickName || user.realName}</div>
                                                                    <div
                                                                        className="text-sm text-muted-foreground">@{user.username}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {getGenderText(user.gender)} · {user.birthdate ? formatDate(user.birthdate) : "未设置生日"}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2 text-sm">
                                                                    <Mail className="h-3 w-3"/>
                                                                    {user.email}
                                                                </div>
                                                                {user.phoneNumber && (
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Phone className="h-3 w-3"/>
                                                                        {user.phoneNumber}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    {user.emailVerified ? (
                                                                        <CheckCircle
                                                                            className="h-4 w-4 text-green-600"/>
                                                                    ) : (
                                                                        <XCircle className="h-4 w-4 text-red-600"/>
                                                                    )}
                                                                    <span className="text-sm">
                                  邮箱{user.emailVerified ? "已验证" : "未验证"}
                                </span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {user.phoneNumberVerified ? (
                                                                        <CheckCircle
                                                                            className="h-4 w-4 text-green-600"/>
                                                                    ) : (
                                                                        <XCircle className="h-4 w-4 text-red-600"/>
                                                                    )}
                                                                    <span className="text-sm">
                                  手机{user.phoneNumberVerified ? "已验证" : "未验证"}
                                </span>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                {getRoleDisplay(user.authorities)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Calendar className="h-3 w-3"/>
                                                                {formatDate(user.createdAt)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                                                                    onClick={() => handleViewUser(user.userId!)}
                                                                >
                                                                    <Eye className="h-4 w-4"/>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
                                                                    onClick={() => handleEditUser(user.userId!)}
                                                                >
                                                                    <Edit className="h-4 w-4"/>
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
                                                                    onClick={() => handleDeleteUser(user.userId!)}
                                                                >
                                                                    <Trash2 className="h-4 w-4"/>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="lg:hidden space-y-4 p-4">
                                        {displayedUsers.map((user) => (
                                            <Card key={user.userId} className="p-4">
                                                <div className="space-y-4">
                                                    {/* User Header */}
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-12 w-12">
                                                            <AvatarImage src={user.avatarUrl} alt={user.nickName}/>
                                                            <AvatarFallback
                                                                className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                                {getInitials(user.nickName || user.realName || user.username)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1">
                                                            <div
                                                                className="font-medium">{user.nickName || user.realName}</div>
                                                            <div
                                                                className="text-sm text-muted-foreground">@{user.username}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {getGenderText(user.gender)} · {user.birthdate ? formatDate(user.birthdate) : "未设置生日"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Contact Info */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="h-3 w-3"/>
                                                            <span className="break-all">{user.email}</span>
                                                            {user.emailVerified ? (
                                                                <CheckCircle
                                                                    className="h-3 w-3 text-green-600 flex-shrink-0"/>
                                                            ) : (
                                                                <XCircle
                                                                    className="h-3 w-3 text-red-600 flex-shrink-0"/>
                                                            )}
                                                        </div>
                                                        {user.phoneNumber && (
                                                            <div className="flex items-center gap-2 text-sm">
                                                                <Phone className="h-3 w-3"/>
                                                                <span>{user.phoneNumber}</span>
                                                                {user.phoneNumberVerified ? (
                                                                    <CheckCircle
                                                                        className="h-3 w-3 text-green-600 flex-shrink-0"/>
                                                                ) : (
                                                                    <XCircle
                                                                        className="h-3 w-3 text-red-600 flex-shrink-0"/>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Roles */}
                                                    <div className="flex flex-wrap gap-1">
                                                        {getRoleDisplay(user.authorities)}
                                                    </div>

                                                    {/* Creation Date */}
                                                    <div
                                                        className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3"/>
                                                        {formatDate(user.createdAt)}
                                                    </div>

                                                    {/* Actions */}
                                                    <div
                                                        className="space-y-2 pt-2 border-t bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 rounded-lg p-3 -mx-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-500 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                            onClick={() => handleViewUser(user.userId!)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2"/>
                                                            查看
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-500 hover:border-green-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                            onClick={() => handleEditUser(user.userId!)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2"/>
                                                            编辑
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 hover:border-red-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                            onClick={() => handleDeleteUser(user.userId!)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2"/>
                                                            删除
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pagination */}
                            {!loading && totalUsers > pageSize && (
                                <div className="flex flex-col gap-4 mt-4 pt-4 border-t">
                                    {/* Pagination info and controls */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            第 {currentPage} 页，共 {Math.ceil(totalUsers / pageSize)} 页
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4"/>
                                                上一页
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => prev + 1)}
                                                disabled={currentPage >= Math.ceil(totalUsers / pageSize)}
                                            >
                                                下一页
                                                <ChevronRight className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Page jumping */}
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-sm text-muted-foreground">跳转到</span>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={Math.ceil(totalUsers / pageSize)}
                                            value={jumpToPage}
                                            onChange={(e) => setJumpToPage(e.target.value)}
                                            onKeyDown={handleJumpInputKeyPress}
                                            className="w-20 text-center"
                                            placeholder="页码"
                                        />
                                        <span className="text-sm text-muted-foreground">页</span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleJumpToPage}
                                            disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > Math.ceil(totalUsers / pageSize)}
                                        >
                                            跳转
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Stats */}
                            <div
                                className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
                                <div>
                                    显示 {displayedUsers.length} 个用户，共 {totalUsers} 个用户
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </SidebarMain>

            {/* Logout Error Display */}
            {logoutError && (
                <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
                    <p>{logoutError}</p>
                    <button 
                        onClick={() => setLogoutError("")}
                        className="ml-2 text-red-500 hover:text-red-700"
                    >
                        ×
                    </button>
                </div>
            )}

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
        </SidebarProvider>
    )
}