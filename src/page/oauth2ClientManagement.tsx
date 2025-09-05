import {useState, useEffect, useCallback} from "react"
import {useNavigate} from "@tanstack/react-router"
import {request} from "@/lib/http"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    Shield,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Settings
} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
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
import {Badge} from "@/components/ui/badge"
import {
    getAllOAuth2Clients,
    createOAuth2Client,
    updateOAuth2Client,
    deleteOAuth2Client,
    getOAuth2ClientById
} from "@/services/oauth2ClientService"
import type {
    OAuth2Client,
    CreateOAuth2ClientRequest,
    UpdateOAuth2ClientRequest
} from "@/services/oauth2ClientService"
import { getAdminNavItems, handleAdminNavigation } from "@/lib/adminNavigation"

interface LogoutResponse {
    code: number
    msg?: string
}

// OAuth2 Client Form Component
interface OAuth2ClientFormProps {
    client?: OAuth2Client
    onSubmit: (data: CreateOAuth2ClientRequest | UpdateOAuth2ClientRequest) => void
    onCancel: () => void
    isLoading: boolean
}

function OAuth2ClientForm({ client, onSubmit, onCancel, isLoading }: OAuth2ClientFormProps) {
    const [formData, setFormData] = useState({
        clientId: client?.clientId || '',
        clientName: client?.clientName || '',
        clientSecret: client?.clientSecret || '',
        clientAuthenticationMethods: client?.clientAuthenticationMethods || 'client_secret_basic',
        authorizationGrantTypes: client?.authorizationGrantTypes || 'authorization_code,refresh_token',
        redirectUris: client?.redirectUris || '',
        postLogoutRedirectUris: client?.postLogoutRedirectUris || '',
        scopes: client?.scopes || 'read,write',
        clientSettings: client?.clientSettings || '{}',
        tokenSettings: client?.tokenSettings || '{}'
    })

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (client?.id) {
            onSubmit({ ...formData, id: client.id } as UpdateOAuth2ClientRequest)
        } else {
            onSubmit(formData as CreateOAuth2ClientRequest)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-4">
                    {client ? '编辑 OAuth2 客户端' : '创建 OAuth2 客户端'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">客户端 ID *</label>
                            <Input
                                value={formData.clientId}
                                onChange={(e) => handleChange('clientId', e.target.value)}
                                required
                                disabled={!!client}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">客户端名称 *</label>
                            <Input
                                value={formData.clientName}
                                onChange={(e) => handleChange('clientName', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">客户端密钥 *</label>
                        <Input
                            type="password"
                            value={formData.clientSecret}
                            onChange={(e) => handleChange('clientSecret', e.target.value)}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">认证方式</label>
                            <Input
                                value={formData.clientAuthenticationMethods}
                                onChange={(e) => handleChange('clientAuthenticationMethods', e.target.value)}
                                placeholder="client_secret_basic,client_secret_post"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">授权类型</label>
                            <Input
                                value={formData.authorizationGrantTypes}
                                onChange={(e) => handleChange('authorizationGrantTypes', e.target.value)}
                                placeholder="authorization_code,refresh_token"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">重定向 URI</label>
                        <Input
                            value={formData.redirectUris}
                            onChange={(e) => handleChange('redirectUris', e.target.value)}
                            placeholder="http://localhost:8080/callback"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">登出重定向 URI</label>
                        <Input
                            value={formData.postLogoutRedirectUris}
                            onChange={(e) => handleChange('postLogoutRedirectUris', e.target.value)}
                            placeholder="http://localhost:8080/logout"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">权限范围</label>
                        <Input
                            value={formData.scopes}
                            onChange={(e) => handleChange('scopes', e.target.value)}
                            placeholder="read,write,openid"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">客户端设置 (JSON)</label>
                            <Input
                                value={formData.clientSettings}
                                onChange={(e) => handleChange('clientSettings', e.target.value)}
                                placeholder="{}"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">令牌设置 (JSON)</label>
                            <Input
                                value={formData.tokenSettings}
                                onChange={(e) => handleChange('tokenSettings', e.target.value)}
                                placeholder="{}"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                            取消
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? '保存中...' : '保存'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// OAuth2 Client Detail Modal Component
interface OAuth2ClientDetailModalProps {
    client: OAuth2Client
    onClose: () => void
    onEdit: (client: OAuth2Client) => void
}

function OAuth2ClientDetailModal({ client, onClose, onEdit }: OAuth2ClientDetailModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">OAuth2 客户端详情</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                        </Button>
                        <Button variant="outline" size="sm" onClick={onClose}>
                            关闭
                        </Button>
                    </div>
                </div>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">客户端 ID</label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{client.clientId}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">客户端名称</label>
                            <p className="text-sm bg-gray-50 p-2 rounded">{client.clientName}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">认证方式</label>
                        <div className="flex gap-1 flex-wrap">
                            {client.clientAuthenticationMethods?.split(',').map((method, index) => (
                                <Badge key={index} variant="secondary">{method.trim()}</Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">授权类型</label>
                        <div className="flex gap-1 flex-wrap">
                            {client.authorizationGrantTypes?.split(',').map((type, index) => (
                                <Badge key={index} variant="secondary">{type.trim()}</Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">重定向 URI</label>
                        <p className="text-sm bg-gray-50 p-2 rounded break-all">{client.redirectUris || '未设置'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">权限范围</label>
                        <div className="flex gap-1 flex-wrap">
                            {client.scopes?.split(',').map((scope, index) => (
                                <Badge key={index} variant="outline">{scope.trim()}</Badge>
                            ))}
                        </div>
                    </div>

                    {client.clientIdIssuedAt && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">创建时间</label>
                            <p className="text-sm bg-gray-50 p-2 rounded">
                                {new Date(client.clientIdIssuedAt * 1000).toLocaleString()}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// Delete Confirmation Modal
interface DeleteConfirmationModalProps {
    client: OAuth2Client
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

function DeleteConfirmationModal({ client, onConfirm, onCancel, isLoading }: DeleteConfirmationModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">确认删除</h3>
                <p className="text-gray-600 mb-6">
                    确定要删除客户端 "{client.clientName}" ({client.clientId}) 吗？此操作无法撤销。
                </p>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onCancel} disabled={isLoading}>
                        取消
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
                        {isLoading ? '删除中...' : '删除'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default function OAuth2ClientManagement() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState("")
    const [clients, setClients] = useState<OAuth2Client[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [logoutError, setLogoutError] = useState("")

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    const [totalClients, setTotalClients] = useState(0)

    // Modal states
    const [showClientForm, setShowClientForm] = useState(false)
    const [showClientDetail, setShowClientDetail] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [editingClient, setEditingClient] = useState<OAuth2Client | null>(null)
    const [selectedClient, setSelectedClient] = useState<OAuth2Client | null>(null)
    const [deletingClient, setDeletingClient] = useState<OAuth2Client | null>(null)
    const [formLoading, setFormLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    // Page jump functionality
    const [jumpToPage, setJumpToPage] = useState("")

    // Load OAuth2 clients function with keyword support
    const loadClients = useCallback(async (keyword?: string) => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAllOAuth2Clients(currentPage, pageSize, keyword)
            setClients(data.list)
            setTotalClients(data.total)
        } catch (err) {
            setError(err instanceof Error ? err.message : '加载OAuth2客户端失败')
        } finally {
            setLoading(false)
        }
    }, [currentPage, pageSize])

    // Initial load and search effect
    useEffect(() => {
        loadClients(searchTerm || undefined)
    }, [loadClients, searchTerm])

    // Pagination calculations
    const totalPages = Math.ceil(totalClients / pageSize)
    const startIndex = (currentPage - 1) * pageSize + 1
    const endIndex = Math.min(currentPage * pageSize, totalClients)

    // Navigation handlers
    const adminNavItems = getAdminNavItems("oauth2-clients")

    const handleNavigation = (id: string) => {
        if (id === "oauth2-clients") {
            return // Already on this page
        }
        handleAdminNavigation(id, navigate)
    }

    // Client management handlers
    const handleCreateClient = () => {
        setEditingClient(null)
        setShowClientForm(true)
    }

    const handleEditClient = async (clientId: string) => {
        try {
            const client = await getOAuth2ClientById(clientId)
            setEditingClient(client)
            setShowClientForm(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取客户端详情失败')
        }
    }

    const handleViewClient = async (clientId: string) => {
        try {
            const client = await getOAuth2ClientById(clientId)
            setSelectedClient(client)
            setShowClientDetail(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : '获取客户端详情失败')
        }
    }

    const handleDeleteClient = (client: OAuth2Client) => {
        setDeletingClient(client)
        setShowDeleteConfirmation(true)
    }

    // Form submission handlers
    const handleFormSubmit = async (data: CreateOAuth2ClientRequest | UpdateOAuth2ClientRequest) => {
        try {
            setFormLoading(true)
            if ('id' in data) {
                await updateOAuth2Client(data)
            } else {
                await createOAuth2Client(data)
            }
            setShowClientForm(false)
            setEditingClient(null)
            await loadClients(searchTerm || undefined)
        } catch (err) {
            setError(err instanceof Error ? err.message : '保存失败')
        } finally {
            setFormLoading(false)
        }
    }

    const handleFormCancel = () => {
        setShowClientForm(false)
        setEditingClient(null)
    }

    const handleDetailClose = () => {
        setShowClientDetail(false)
        setSelectedClient(null)
    }

    const handleDetailEdit = (client: OAuth2Client) => {
        setShowClientDetail(false)
        setSelectedClient(null)
        setEditingClient(client)
        setShowClientForm(true)
    }

    // Delete confirmation handlers
    const handleConfirmDelete = async () => {
        if (!deletingClient?.id) return

        try {
            setDeleteLoading(true)
            await deleteOAuth2Client(deletingClient.id)
            setShowDeleteConfirmation(false)
            setDeletingClient(null)
            await loadClients(searchTerm || undefined)
        } catch (err) {
            setError(err instanceof Error ? err.message : '删除失败')
        } finally {
            setDeleteLoading(false)
        }
    }

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false)
        setDeletingClient(null)
    }

    // Pagination handlers
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handleJumpToPage = () => {
        const page = parseInt(jumpToPage)
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            setJumpToPage("")
        }
    }

    // Logout handler
    const handleLogout = async () => {
        try {
            const response = await request<LogoutResponse>('/logout', { method: 'POST', csrf: true })
            if (response.code === 200) {
                navigate({ to: '/login' })
            } else {
                setLogoutError(response.msg || '登出失败')
            }
        } catch {
            setLogoutError('登出失败，请重试')
        }
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50 flex">
                <Sidebar className="border-r border-gray-200 bg-white">
                    <SidebarHeader className="p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">管理面板</h2>
                                <p className="text-sm text-gray-600">OAuth2 客户端管理</p>
                            </div>
                        </div>
                    </SidebarHeader>

                    <SidebarContent>
                        <SidebarNav>
                            {adminNavItems.map((item) => (
                                <SidebarNavItem
                                    key={item.id}
                                    active={item.active}
                                    onClick={() => handleNavigation(item.id)}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.label}
                                </SidebarNavItem>
                            ))}
                        </SidebarNav>
                    </SidebarContent>

                    <div className="p-4 border-t border-gray-200 mt-auto">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-3" />
                            登出
                        </Button>
                    </div>
                </Sidebar>

                <SidebarMain className="flex-1">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">OAuth2 客户端管理</h1>
                                <p className="text-gray-600 mt-1">管理 OAuth2 认证客户端</p>
                            </div>
                            <Button onClick={handleCreateClient} className="flex items-center gap-2">
                                <Plus className="h-4 w-4" />
                                新建客户端
                            </Button>
                        </div>

                        {/* Search Bar */}
                        <Card className="mb-6">
                            <CardContent className="p-4">
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="搜索客户端 ID 或名称..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Clients Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="h-5 w-5" />
                                    OAuth2 客户端列表
                                    <span className="text-sm font-normal text-gray-500">
                                        (共 {totalClients} 个客户端)
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                {loading ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <p className="mt-2 text-gray-600">加载中...</p>
                                    </div>
                                ) : (
                                    <>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>客户端 ID</TableHead>
                                                    <TableHead>客户端名称</TableHead>
                                                    <TableHead>授权类型</TableHead>
                                                    <TableHead>权限范围</TableHead>
                                                    <TableHead>创建时间</TableHead>
                                                    <TableHead className="text-right">操作</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {clients.map((client) => (
                                                    <TableRow key={client.id}>
                                                        <TableCell className="font-mono text-sm">
                                                            {client.clientId}
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {client.clientName}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-1 flex-wrap">
                                                                {client.authorizationGrantTypes?.split(',').slice(0, 2).map((type, index) => (
                                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                                        {type.trim()}
                                                                    </Badge>
                                                                ))}
                                                                {(client.authorizationGrantTypes?.split(',').length || 0) > 2 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        +{(client.authorizationGrantTypes?.split(',').length || 0) - 2}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-1 flex-wrap">
                                                                {client.scopes?.split(',').slice(0, 3).map((scope, index) => (
                                                                    <Badge key={index} variant="outline" className="text-xs">
                                                                        {scope.trim()}
                                                                    </Badge>
                                                                ))}
                                                                {(client.scopes?.split(',').length || 0) > 3 && (
                                                                    <Badge variant="outline" className="text-xs">
                                                                        +{(client.scopes?.split(',').length || 0) - 3}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {client.clientIdIssuedAt ? 
                                                                new Date(client.clientIdIssuedAt * 1000).toLocaleDateString() : 
                                                                '未知'
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-blue-50 hover:text-blue-600"
                                                                    onClick={() => handleViewClient(client.id!)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-green-50 hover:text-green-600"
                                                                    onClick={() => handleEditClient(client.id!)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-red-50 hover:text-red-600"
                                                                    onClick={() => handleDeleteClient(client)}
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
                                        {totalPages > 1 && (
                                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                                <div className="text-sm text-gray-600">
                                                    显示 {startIndex} - {endIndex} 条，共 {totalClients} 条记录
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm text-gray-600">跳转到</span>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            max={totalPages}
                                                            value={jumpToPage}
                                                            onChange={(e) => setJumpToPage(e.target.value)}
                                                            className="w-16 h-8 text-center"
                                                            onKeyPress={(e) => e.key === 'Enter' && handleJumpToPage()}
                                                        />
                                                        <span className="text-sm text-gray-600">页</span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleJumpToPage}
                                                            disabled={!jumpToPage}
                                                        >
                                                            跳转
                                                        </Button>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handlePreviousPage}
                                                            disabled={currentPage === 1}
                                                        >
                                                            <ChevronLeft className="h-4 w-4" />
                                                        </Button>
                                                        <span className="text-sm text-gray-600">
                                                            {currentPage} / {totalPages}
                                                        </span>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={handleNextPage}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </SidebarMain>

                <SidebarToggle />
            </div>

            {/* Error Display */}
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
            {showClientForm && (
                <OAuth2ClientForm
                    client={editingClient || undefined}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isLoading={formLoading}
                />
            )}

            {showClientDetail && selectedClient && (
                <OAuth2ClientDetailModal
                    client={selectedClient}
                    onClose={handleDetailClose}
                    onEdit={handleDetailEdit}
                />
            )}

            {showDeleteConfirmation && deletingClient && (
                <DeleteConfirmationModal
                    client={deletingClient}
                    onConfirm={handleConfirmDelete}
                    onCancel={handleCancelDelete}
                    isLoading={deleteLoading}
                />
            )}
        </SidebarProvider>
    )
}