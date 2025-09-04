import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Key
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { Separator } from "@/components/ui/separator"

import {
    getAllPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    type PermissionInfo,
    type CreatePermissionRequest,
    type UpdatePermissionRequest
} from "@/services/permissionService"
import { getAdminNavItems, handleAdminNavigation } from "@/lib/adminNavigation"
import { PermissionForm } from "@/components/PermissionForm"
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"



export default function PermissionManagement() {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState("permissions")
    
    // State management
    const [permissions, setPermissions] = useState<PermissionInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // Form states
    const [showPermissionForm, setShowPermissionForm] = useState(false)
    const [editingPermission, setEditingPermission] = useState<PermissionInfo | null>(null)
    const [formLoading, setFormLoading] = useState(false)

    // Delete confirmation states
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [deletingPermission, setDeletingPermission] = useState<PermissionInfo | null>(null)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Load permissions
    const loadPermissions = useCallback(async (keyword?: string, page: number = 1) => {
        try {
            setLoading(true)
            setError(null)
            const response = await getAllPermissions(page, pageSize, keyword)
            setPermissions(response.list)
            setTotal(response.total)
            setCurrentPage(response.pageNum)
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载权限列表失败')
        } finally {
            setLoading(false)
        }
    }, [pageSize])

    // Load initial data
    useEffect(() => {
        loadPermissions()
    }, [loadPermissions])

    // Search handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadPermissions(searchTerm || undefined, 1)
    }

    // Navigation handlers
    const handleNavigation = (id: string) => {
        setActiveItem(id)
        handleAdminNavigation(id, navigate)
    }

    const adminNavItems = getAdminNavItems(activeItem)

    const goHome = () => {
        navigate({ to: "/" })
    }

    // Pagination handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1
            setCurrentPage(newPage)
            loadPermissions(searchTerm || undefined, newPage)
        }
    }

    const handleNextPage = () => {
        const totalPages = Math.ceil(total / pageSize)
        if (currentPage < totalPages) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            loadPermissions(searchTerm || undefined, newPage)
        }
    }

    // Permission actions
    const handleAddPermission = () => {
        setEditingPermission(null)
        setShowPermissionForm(true)
    }

    const handleEditPermission = (permissionId: number) => {
        const permission = permissions.find(p => p.permissionId === permissionId)
        if (permission) {
            setEditingPermission(permission)
            setShowPermissionForm(true)
        }
    }

    const handleViewPermission = (permissionId: number) => {
        // TODO: Implement view permission dialog
        console.log("View permission:", permissionId)
    }

    const handleDeletePermission = (permissionId: number) => {
        const permission = permissions.find(p => p.permissionId === permissionId)
        if (permission) {
            setDeletingPermission(permission)
            setShowDeleteConfirmation(true)
        }
    }

    const handleConfirmDelete = async () => {
        if (!deletingPermission) return

        try {
            setDeleteLoading(true)
            await deletePermission(deletingPermission.permissionId!)
            await loadPermissions(searchTerm || undefined, currentPage)
            setShowDeleteConfirmation(false)
            setDeletingPermission(null)
        } catch (err) {
            console.error('Failed to delete permission:', err)
            alert(err instanceof Error ? err.message : '删除权限失败')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false)
        setDeletingPermission(null)
    }

    const handleFormSubmit = async (permissionData: CreatePermissionRequest | UpdatePermissionRequest) => {
        try {
            setFormLoading(true)

            if (editingPermission) {
                // Update existing permission
                await updatePermission(permissionData as UpdatePermissionRequest)
            } else {
                // Create new permission
                await createPermission(permissionData as CreatePermissionRequest)
            }

            setShowPermissionForm(false)
            setEditingPermission(null)
            await loadPermissions(searchTerm || undefined, currentPage)
        } catch (err) {
            console.error('Failed to save permission:', err)
            alert(err instanceof Error ? err.message : '保存权限失败')
        } finally {
            setFormLoading(false)
        }
    }

    const handleFormCancel = () => {
        setShowPermissionForm(false)
        setEditingPermission(null)
    }

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('zh-CN')
    }

    // Permission type color mapping
    const getPermissionTypeColor = (code: string) => {
        if (code.includes(':view')) return 'bg-blue-100 text-blue-700'
        if (code.includes(':create')) return 'bg-green-100 text-green-700'
        if (code.includes(':update')) return 'bg-yellow-100 text-yellow-700'
        if (code.includes(':delete')) return 'bg-red-100 text-red-700'
        return 'bg-gray-100 text-gray-700'
    }

    const totalPages = Math.ceil(total / pageSize)

    return (
        <SidebarProvider>
            <SidebarToggle />
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                            <Key className="size-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">OAuth2 管理后台</h2>
                            <p className="text-xs text-sidebar-foreground/60">权限管理</p>
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
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </SidebarNavItem>
                        ))}
                    </SidebarNav>

                    <Separator className="my-4" />

                    <SidebarNav>
                        <SidebarNavItem onClick={goHome}>
                            <ArrowLeft className="h-4 w-4" />
                            返回首页
                        </SidebarNavItem>
                    </SidebarNav>
                </SidebarContent>
            </Sidebar>

            <SidebarMain>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">权限管理</h1>
                            <p className="text-muted-foreground">管理系统权限和资源访问控制</p>
                        </div>
                        <Button onClick={handleAddPermission} className="w-fit">
                            <Plus className="h-4 w-4 mr-2" />
                            添加权限
                        </Button>
                    </div>

                    {/* Search and Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>权限列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="搜索权限代码或名称..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Button type="submit" variant="outline" className="w-fit">
                                    <Search className="h-4 w-4 mr-2" />
                                    搜索
                                </Button>
                                <Button variant="outline" size="sm" className="w-fit">
                                    <Filter className="h-4 w-4 mr-2" />
                                    过滤
                                </Button>
                            </form>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                        <p className="text-muted-foreground">加载权限列表中...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <Button onClick={() => loadPermissions(searchTerm || undefined)} variant="outline">
                                            重新加载
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && permissions.length === 0 && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Key className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">暂无权限数据</p>
                                        <Button onClick={handleAddPermission} variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            添加第一个权限
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Permissions Table */}
                            {!loading && !error && permissions.length > 0 && (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>权限ID</TableHead>
                                                <TableHead>权限代码</TableHead>
                                                <TableHead>权限名称</TableHead>
                                                <TableHead>创建时间</TableHead>
                                                <TableHead className="text-right">操作</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {permissions.map((permission) => (
                                                <TableRow key={permission.permissionId}>
                                                    <TableCell className="font-mono text-sm">
                                                        #{permission.permissionId}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            className={getPermissionTypeColor(permission.permissionCode)}
                                                        >
                                                            {permission.permissionCode}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Key className="h-4 w-4 text-purple-600" />
                                                            <span className="font-medium">{permission.permissionName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm">
                                                            {formatDate(permission.createAt)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-blue-50 hover:text-blue-600"
                                                                onClick={() => handleViewPermission(permission.permissionId!)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-green-50 hover:text-green-600"
                                                                onClick={() => handleEditPermission(permission.permissionId!)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-red-50 hover:text-red-600"
                                                                onClick={() => handleDeletePermission(permission.permissionId!)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between pt-4">
                                        <div className="text-sm text-muted-foreground">
                                            显示 {Math.min((currentPage - 1) * pageSize + 1, total)} 到{" "}
                                            {Math.min(currentPage * pageSize, total)} 条，共 {total} 条记录
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handlePreviousPage}
                                                disabled={currentPage <= 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                上一页
                                            </Button>
                                            <span className="text-sm">
                                                第 {currentPage} 页，共 {totalPages} 页
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleNextPage}
                                                disabled={currentPage >= totalPages}
                                            >
                                                下一页
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </SidebarMain>

            {/* Permission Form Modal */}
            {showPermissionForm && (
                <PermissionForm
                    permission={editingPermission || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isLoading={formLoading}
                />
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && deletingPermission && (
                <DeleteConfirmationModal
                    user={{
                        userId: deletingPermission.permissionId?.toString(),
                        username: deletingPermission.permissionName,
                        email: deletingPermission.permissionCode,
                        realName: deletingPermission.permissionCode
                    }}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    isLoading={deleteLoading}
                />
            )}
        </SidebarProvider>
    )
}