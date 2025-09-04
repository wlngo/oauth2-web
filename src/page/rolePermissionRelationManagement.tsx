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
    Link,
    Shield,
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
    getRolePermissionRelations,
    deleteRolePermissionRelation,
    type RolePermissionRelation
} from "@/services/rolePermissionRelationService"
import { getAdminNavItems, handleAdminNavigation } from "@/lib/adminNavigation"



export default function RolePermissionRelationManagement() {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState("role-permissions")
    
    // State management
    const [relations, setRelations] = useState<RolePermissionRelation[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // Load relations
    const loadRelations = useCallback(async (roleId?: string, permissionId?: string, page: number = 1) => {
        try {
            setLoading(true)
            setError(null)
            const response = await getRolePermissionRelations(page, pageSize, roleId, permissionId)
            setRelations(response.list)
            setTotal(response.total)
            setCurrentPage(response.pageNum)
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载角色权限关系失败')
        } finally {
            setLoading(false)
        }
    }, [pageSize])

    // Load initial data
    useEffect(() => {
        loadRelations()
    }, [loadRelations])

    // Search handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        // For now, we'll search by roleId if the search term looks like a role ID
        const isRoleId = searchTerm.startsWith('r') || searchTerm.includes('role')
        const isPermissionId = searchTerm.match(/^\d+$/)
        if (isRoleId) {
            loadRelations(searchTerm, undefined, 1)
        } else if (isPermissionId) {
            loadRelations(undefined, searchTerm, 1)
        } else {
            loadRelations(undefined, undefined, 1)
        }
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
            loadRelations(undefined, undefined, newPage)
        }
    }

    const handleNextPage = () => {
        const totalPages = Math.ceil(total / pageSize)
        if (currentPage < totalPages) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            loadRelations(undefined, undefined, newPage)
        }
    }

    // Relation actions
    const handleAddRelation = () => {
        // TODO: Implement add relation dialog
        console.log("Add role-permission relation")
    }

    const handleEditRelation = (relationId: string) => {
        // TODO: Implement edit relation dialog
        console.log("Edit relation:", relationId)
    }

    const handleViewRelation = (relationId: string) => {
        // TODO: Implement view relation dialog
        console.log("View relation:", relationId)
    }

    const handleDeleteRelation = async (relationId: string) => {
        if (window.confirm('确定要删除这个角色权限关系吗？')) {
            try {
                await deleteRolePermissionRelation(relationId)
                loadRelations(undefined, undefined, currentPage)
            } catch (err) {
                setError(err instanceof Error ? err.message : '删除角色权限关系失败')
            }
        }
    }

    const totalPages = Math.ceil(total / pageSize)

    return (
        <SidebarProvider>
            <SidebarToggle />
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                            <Link className="size-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">OAuth2 管理后台</h2>
                            <p className="text-xs text-sidebar-foreground/60">角色权限关系</p>
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
                            <h1 className="text-2xl sm:text-3xl font-bold">角色权限关系管理</h1>
                            <p className="text-muted-foreground">管理角色与权限之间的关联关系</p>
                        </div>
                        <Button onClick={handleAddRelation} className="w-fit">
                            <Plus className="h-4 w-4 mr-2" />
                            添加关系
                        </Button>
                    </div>

                    {/* Search and Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>角色权限关系列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="搜索角色ID或权限ID..."
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

                            {/* Quick Filter Buttons */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => loadRelations()}
                                >
                                    全部关系
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => loadRelations('admin')}
                                >
                                    管理员角色
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => loadRelations('user')}
                                >
                                    普通用户角色
                                </Button>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                                        <p className="text-muted-foreground">加载角色权限关系中...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <Button onClick={() => loadRelations()} variant="outline">
                                            重新加载
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && relations.length === 0 && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">暂无角色权限关系数据</p>
                                        <Button onClick={handleAddRelation} variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            添加第一个关系
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Relations Table */}
                            {!loading && !error && relations.length > 0 && (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>关系ID</TableHead>
                                                <TableHead>角色ID</TableHead>
                                                <TableHead>权限ID</TableHead>
                                                <TableHead>关系状态</TableHead>
                                                <TableHead className="text-right">操作</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {relations.map((relation) => (
                                                <TableRow key={relation.id}>
                                                    <TableCell className="font-mono text-sm">
                                                        {relation.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Shield className="h-4 w-4 text-blue-600" />
                                                            <Badge variant="outline" className="font-mono">
                                                                {relation.roleId}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            <Key className="h-4 w-4 text-purple-600" />
                                                            <Badge variant="outline" className="font-mono">
                                                                {relation.permissionId}
                                                            </Badge>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge className="bg-green-100 text-green-700">
                                                            已激活
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-blue-50 hover:text-blue-600"
                                                                onClick={() => handleViewRelation(relation.id!)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-green-50 hover:text-green-600"
                                                                onClick={() => handleEditRelation(relation.id!)}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="hover:bg-red-50 hover:text-red-600"
                                                                onClick={() => handleDeleteRelation(relation.id!)}
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