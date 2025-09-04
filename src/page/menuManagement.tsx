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
    Menu,
    Folder,
    FileText,
    MousePointer
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
    getAllMenus,
    deleteMenu,
    type MenuInfo
} from "@/services/menuService"
import { getAdminNavItems, handleAdminNavigation } from "@/lib/adminNavigation"



export default function MenuManagement() {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState("menus")
    
    // State management
    const [menus, setMenus] = useState<MenuInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [total, setTotal] = useState(0)

    // Load menus
    const loadMenus = useCallback(async (keyword?: string, page: number = 1) => {
        try {
            setLoading(true)
            setError(null)
            const response = await getAllMenus(page, pageSize, keyword)
            setMenus(response.list)
            setTotal(response.total)
            setCurrentPage(response.pageNum)
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载菜单列表失败')
        } finally {
            setLoading(false)
        }
    }, [pageSize])

    // Load initial data
    useEffect(() => {
        loadMenus()
    }, [loadMenus])

    // Search handler
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCurrentPage(1)
        loadMenus(searchTerm || undefined, 1)
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
            loadMenus(searchTerm || undefined, newPage)
        }
    }

    const handleNextPage = () => {
        const totalPages = Math.ceil(total / pageSize)
        if (currentPage < totalPages) {
            const newPage = currentPage + 1
            setCurrentPage(newPage)
            loadMenus(searchTerm || undefined, newPage)
        }
    }

    // Menu actions
    const handleAddMenu = () => {
        // TODO: Implement add menu dialog
        console.log("Add menu")
    }

    const handleEditMenu = (menuId: string) => {
        // TODO: Implement edit menu dialog
        console.log("Edit menu:", menuId)
    }

    const handleViewMenu = (menuId: string) => {
        // TODO: Implement view menu dialog
        console.log("View menu:", menuId)
    }

    const handleDeleteMenu = async (menuId: string) => {
        if (window.confirm('确定要删除这个菜单吗？')) {
            try {
                await deleteMenu(menuId)
                loadMenus(searchTerm || undefined, currentPage)
            } catch (err) {
                setError(err instanceof Error ? err.message : '删除菜单失败')
            }
        }
    }

    // Format date helper
    const formatDate = (dateString?: string) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleDateString('zh-CN')
    }

    // Menu type mapping
    const getMenuTypeInfo = (type: number) => {
        switch (type) {
            case 0:
                return { label: '目录', icon: Folder, color: 'bg-blue-100 text-blue-700' }
            case 1:
                return { label: '菜单', icon: FileText, color: 'bg-green-100 text-green-700' }
            case 2:
                return { label: '按钮', icon: MousePointer, color: 'bg-purple-100 text-purple-700' }
            default:
                return { label: '未知', icon: Menu, color: 'bg-gray-100 text-gray-700' }
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
                            <Menu className="size-4" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold">OAuth2 管理后台</h2>
                            <p className="text-xs text-sidebar-foreground/60">菜单管理</p>
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
                            <h1 className="text-2xl sm:text-3xl font-bold">菜单管理</h1>
                            <p className="text-muted-foreground">管理系统菜单结构和导航</p>
                        </div>
                        <Button onClick={handleAddMenu} className="w-fit">
                            <Plus className="h-4 w-4 mr-2" />
                            添加菜单
                        </Button>
                    </div>

                    {/* Search and Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>菜单列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex items-center gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="搜索菜单名称或路径..."
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
                                        <p className="text-muted-foreground">加载菜单列表中...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <Button onClick={() => loadMenus(searchTerm || undefined)} variant="outline">
                                            重新加载
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && menus.length === 0 && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Menu className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">暂无菜单数据</p>
                                        <Button onClick={handleAddMenu} variant="outline">
                                            <Plus className="h-4 w-4 mr-2" />
                                            添加第一个菜单
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Menus Table */}
                            {!loading && !error && menus.length > 0 && (
                                <>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>菜单名称</TableHead>
                                                <TableHead>路径</TableHead>
                                                <TableHead>类型</TableHead>
                                                <TableHead>排序</TableHead>
                                                <TableHead>状态</TableHead>
                                                <TableHead>创建时间</TableHead>
                                                <TableHead className="text-right">操作</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {menus.map((menu) => {
                                                const typeInfo = getMenuTypeInfo(menu.menuType)
                                                const TypeIcon = typeInfo.icon
                                                return (
                                                    <TableRow key={menu.menuId}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                {menu.menuIcon && (
                                                                    <span className="text-lg">{menu.menuIcon}</span>
                                                                )}
                                                                <span className="font-medium">{menu.menuName}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                                {menu.menuPath}
                                                            </code>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className={typeInfo.color}>
                                                                <TypeIcon className="h-3 w-3 mr-1" />
                                                                {typeInfo.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm">{menu.sortOrder}</span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant={menu.visible ? "default" : "secondary"}>
                                                                {menu.visible ? "显示" : "隐藏"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="text-sm">
                                                                {formatDate(menu.createdAt)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-blue-50 hover:text-blue-600"
                                                                    onClick={() => handleViewMenu(menu.menuId!)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-green-50 hover:text-green-600"
                                                                    onClick={() => handleEditMenu(menu.menuId!)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-red-50 hover:text-red-600"
                                                                    onClick={() => handleDeleteMenu(menu.menuId!)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
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