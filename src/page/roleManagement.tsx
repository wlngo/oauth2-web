import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Shield,
    ArrowLeft,
    ChevronLeft,
    ChevronRight
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
    getAllRoles,
    deleteRole,
    type RoleInfo
} from "@/services/roleService"
import { getAdminNavItems, handleAdminNavigation } from "@/lib/adminNavigation"



export default function RoleManagement() {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState("roles")
    
    // State management
    const [roles, setRoles] = useState<RoleInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // Load roles
    const loadRoles = useCallback(async (keyword?: string, page: number = 1) => {
        try {
            setLoading(true)
            setError(null)
            const response = await getAllRoles(page, pageSize, keyword)
            setRoles(response.list)
            setTotal(response.total)
            setCurrentPage(response.pageNum)
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载角色列表失败')
        } finally {
            setLoading(false)
        }
    }, [pageSize])

    // Load initial data
    useEffect(() => {
        loadRoles()
    }, [loadRoles])

    // Search handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadRoles(searchTerm || undefined, 1)
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
            loadRoles(searchTerm || undefined, newPage)
        }
    }

    const handleNextPage = () => {
        const totalPages = Math.ceil(total / pageSize)
        if (currentPage < totalPages) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            loadRoles(searchTerm || undefined, newPage)
        }
    }

    // Role actions
    const handleAddRole = () => {
        // TODO: Implement add role dialog
        console.log("Add role")
    }

    const handleEditRole = (roleId: string) => {
        // TODO: Implement edit role dialog
        console.log("Edit role:", roleId)
    }

    const handleViewRole = (roleId: string) => {
        // TODO: Implement view role dialog
        console.log("View role:", roleId)
    }

    const handleDeleteRole = async (roleId: string) => {
        if (window.confirm('确定要删除这个角色吗？')) {
            try {
                await deleteRole(roleId)
                loadRoles(searchTerm || undefined, currentPage)
            } catch (err) {
                setError(err instanceof Error ? err.message : '删除角色失败')
            }
        }
    }

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('zh-CN')
    }

    const totalPages = Math.ceil(total / pageSize)

    return (
        <SidebarProvider>
            <SidebarToggle />
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                            <Shield className="size-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">OAuth2 管理后台</h2>
                            <p className="text-xs text-sidebar-foreground/60">角色管理</p>
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
                            <h1 className="text-2xl sm:text-3xl font-bold">角色管理</h1>
                            <p className="text-muted-foreground">管理系统角色和权限分配</p>
                        </div>
                        <Button onClick={handleAddRole} className="w-fit">
                            <Plus className="h-4 w-4 mr-2" />
                            添加角色
                        </Button>
                    </div>

                    {/* Search and Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>角色列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="搜索角色名称或描述..."
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
                                        <p className="text-muted-foreground">加载角色列表中...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <Button onClick={() => loadRoles(searchTerm || undefined)} variant="outline">
                                            重新加载
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && roles.length === 0 && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">暂无角色数据</p>
                                        <Button onClick={handleAddRole} variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            添加第一个角色
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Roles Table */}
                            {!loading && !error && roles.length > 0 && (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>角色ID</TableHead>
                                                <TableHead>角色名称</TableHead>
                                                <TableHead>显示名称</TableHead>
                                                <TableHead>描述</TableHead>
                                                <TableHead>创建时间</TableHead>
                                                <TableHead className="text-right">操作</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {roles.map((role) => (
                                                <TableRow key={role.roleId}>
                                                    <TableCell className="font-mono text-sm">
                                                        {role.roleId}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="h-4 w-4 text-blue-600" />
                                                            <span className="font-medium">{role.roleName}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{role.roleContent}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm text-muted-foreground">
                                                            {role.description || '-'}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-sm">
                                                            {formatDate(role.createdAt)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-blue-50 hover:text-blue-600"
                                                                onClick={() => handleViewRole(role.roleId!)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-green-50 hover:text-green-600"
                                                                onClick={() => handleEditRole(role.roleId!)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-red-50 hover:text-red-600"
                                                                onClick={() => handleDeleteRole(role.roleId!)}
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
        </SidebarProvider>
    )
}