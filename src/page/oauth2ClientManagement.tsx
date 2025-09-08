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
    Settings,
    ArrowLeft,
    User,
    Filter
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
import {Separator} from "@/components/ui/separator"
import {Checkbox} from "@/components/ui/checkbox"
import {MultipleUriInput} from "@/components/MultipleUriInput"
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

// OAuth2 Client Authentication Methods Enum
const CLIENT_AUTH_METHODS = {
    CLIENT_SECRET_BASIC: 'client_secret_basic',
    CLIENT_SECRET_POST: 'client_secret_post',
    CLIENT_SECRET_JWT: 'client_secret_jwt',
    PRIVATE_KEY_JWT: 'private_key_jwt',
    NONE: 'none',
    TLS_CLIENT_AUTH: 'tls_client_auth',
    SELF_SIGNED_TLS_CLIENT_AUTH: 'self_signed_tls_client_auth'
} as const

// Client Authentication Methods options for checkboxes
const CLIENT_AUTH_METHOD_OPTIONS = [
    { value: CLIENT_AUTH_METHODS.CLIENT_SECRET_BASIC, label: 'HTTP Basic 头传递', subLabel: 'client_secret_basic', description: '通过 HTTP Basic 头传递 client_id 和 client_secret' },
    { value: CLIENT_AUTH_METHODS.CLIENT_SECRET_POST, label: 'POST 请求体传递', subLabel: 'client_secret_post', description: '在 POST 请求体传递 client_id 和 client_secret' },
    { value: CLIENT_AUTH_METHODS.CLIENT_SECRET_JWT, label: '客户端密钥 JWT', subLabel: 'client_secret_jwt', description: '用 client_secret 签发 JWT 认证' },
    { value: CLIENT_AUTH_METHODS.PRIVATE_KEY_JWT, label: '私钥 JWT', subLabel: 'private_key_jwt', description: '用私钥签发 JWT 进行认证' },
    { value: CLIENT_AUTH_METHODS.NONE, label: '无认证', subLabel: 'none', description: '无客户端认证（公开客户端）' },
    { value: CLIENT_AUTH_METHODS.TLS_CLIENT_AUTH, label: 'TLS 证书认证', subLabel: 'tls_client_auth', description: '基于 TLS 证书的客户端认证' },
    { value: CLIENT_AUTH_METHODS.SELF_SIGNED_TLS_CLIENT_AUTH, label: '自签名 TLS 证书认证', subLabel: 'self_signed_tls_client_auth', description: '基于自签名 TLS 证书的客户端认证' }
]

// OAuth2 Grant Types Enum
const GRANT_TYPES = {
    AUTHORIZATION_CODE: 'authorization_code',
    REFRESH_TOKEN: 'refresh_token',
    CLIENT_CREDENTIALS: 'client_credentials',
    JWT_BEARER: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    DEVICE_CODE: 'urn:ietf:params:oauth:grant-type:device_code',
    TOKEN_EXCHANGE: 'urn:ietf:params:oauth:grant-type:token-exchange'
} as const

// Grant Types options for checkboxes
const GRANT_TYPE_OPTIONS = [
    { value: GRANT_TYPES.AUTHORIZATION_CODE, label: '授权码模式', subLabel: 'authorization_code', description: '授权码模式（推荐，最常用）' },
    { value: GRANT_TYPES.REFRESH_TOKEN, label: '刷新令牌', subLabel: 'refresh_token', description: '刷新令牌' },
    { value: GRANT_TYPES.CLIENT_CREDENTIALS, label: '客户端凭证模式', subLabel: 'client_credentials', description: '客户端凭证模式' },
    { value: GRANT_TYPES.JWT_BEARER, label: 'JWT断言授权', subLabel: 'jwt-bearer', description: 'JWT断言授权' },
    { value: GRANT_TYPES.DEVICE_CODE, label: '设备码授权', subLabel: 'device_code', description: '设备码授权' },
    { value: GRANT_TYPES.TOKEN_EXCHANGE, label: '令牌交换', subLabel: 'token-exchange', description: '令牌交换' }
]

// Common scopes options for quick selection
const COMMON_SCOPES = [
    { value: 'openid', label: 'OpenID Connect', description: '用于 OpenID Connect，标识要获取用户身份信息' },
    { value: 'profile', label: '用户基础公开信息', description: '用户的基础公开信息（如昵称、头像等）' },
    { value: 'email', label: '邮箱地址', description: '获取用户邮箱地址' },
    { value: 'address', label: '地址信息', description: '获取用户的地址信息' },
    { value: 'phone', label: '电话号码', description: '获取用户的电话号码' }
]

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
    const isEditMode = !!client
    const [formData, setFormData] = useState({
        clientId: client?.clientId || '',
        clientName: client?.clientName || '',
        clientSecret: client?.clientSecret || '',
        clientAuthenticationMethods: client?.clientAuthenticationMethods?.split(',').map(m => m.trim()) || [CLIENT_AUTH_METHODS.CLIENT_SECRET_BASIC],
        authorizationGrantTypes: client?.authorizationGrantTypes?.split(',').map(t => t.trim()) || [GRANT_TYPES.AUTHORIZATION_CODE, GRANT_TYPES.REFRESH_TOKEN],
        redirectUris: client?.redirectUris?.split(',').map(u => u.trim()).filter(u => u) || [],
        postLogoutRedirectUris: client?.postLogoutRedirectUris?.split(',').map(u => u.trim()).filter(u => u) || [],
        scopes: client?.scopes?.split(',').map(s => s.trim()) || ['read', 'write'],
        clientSettings: client?.clientSettings || '{}',
        tokenSettings: client?.tokenSettings || '{}'
    })
    
    // Add state for scope input field
    const [scopeInput, setScopeInput] = useState('')

    const handleChange = (field: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleAuthMethodToggle = (method: string) => {
        setFormData(prev => ({
            ...prev,
            clientAuthenticationMethods: prev.clientAuthenticationMethods.includes(method)
                ? prev.clientAuthenticationMethods.filter(m => m !== method)
                : [...prev.clientAuthenticationMethods, method]
        }))
    }

    const handleGrantTypeToggle = (grantType: string) => {
        setFormData(prev => ({
            ...prev,
            authorizationGrantTypes: prev.authorizationGrantTypes.includes(grantType)
                ? prev.authorizationGrantTypes.filter(t => t !== grantType)
                : [...prev.authorizationGrantTypes, grantType]
        }))
    }

    const handleScopeToggle = (scope: string) => {
        setFormData(prev => ({
            ...prev,
            scopes: prev.scopes.includes(scope)
                ? prev.scopes.filter(s => s !== scope)
                : [...prev.scopes, scope]
        }))
    }

    const handleAddScope = () => {
        if (scopeInput.trim() && !formData.scopes.includes(scopeInput.trim())) {
            setFormData(prev => ({
                ...prev,
                scopes: [...prev.scopes, scopeInput.trim()]
            }))
            setScopeInput('')
        }
    }

    const handleRemoveScope = (scope: string) => {
        setFormData(prev => ({
            ...prev,
            scopes: prev.scopes.filter(s => s !== scope)
        }))
    }

    const handleScopeInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleAddScope()
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const submitData = {
            ...formData,
            clientAuthenticationMethods: formData.clientAuthenticationMethods.join(','),
            authorizationGrantTypes: formData.authorizationGrantTypes.join(','),
            redirectUris: formData.redirectUris.join(','),
            postLogoutRedirectUris: formData.postLogoutRedirectUris.join(','),
            scopes: formData.scopes.join(',')
        }
        
        if (client?.id) {
            onSubmit({ ...submitData, id: client.id } as UpdateOAuth2ClientRequest)
        } else {
            onSubmit(submitData as CreateOAuth2ClientRequest)
        }
    }

    return (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                    {client ? '编辑 OAuth2 客户端' : '创建 OAuth2 客户端'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
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

                    {/* Client Secret - only visible during creation */}
                    {!isEditMode && (
                        <div>
                            <label className="block text-sm font-medium mb-2">客户端密钥 *</label>
                            <Input
                                type="password"
                                value={formData.clientSecret}
                                onChange={(e) => handleChange('clientSecret', e.target.value)}
                                required
                                placeholder="客户端密钥只在创建时可见，请妥善保存"
                            />
                            <p className="text-xs text-gray-500 mt-1">⚠️ 客户端密钥仅在创建时显示，请妥善保存</p>
                        </div>
                    )}

                    {/* Authentication Methods */}
                    <div>
                        <label className="block text-sm font-medium mb-3">认证方式 *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {CLIENT_AUTH_METHOD_OPTIONS.map(option => (
                                <Checkbox
                                    key={option.value}
                                    id={`auth-${option.value}`}
                                    checked={formData.clientAuthenticationMethods.includes(option.value)}
                                    onChange={() => handleAuthMethodToggle(option.value)}
                                >
                                    <div>
                                        <div className="font-medium text-sm">{option.label}</div>
                                        <div className="text-xs text-gray-500 font-mono">{option.subLabel}</div>
                                        <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                                    </div>
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    {/* Grant Types */}
                    <div>
                        <label className="block text-sm font-medium mb-3">授权类型 *</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {GRANT_TYPE_OPTIONS.map(option => (
                                <Checkbox
                                    key={option.value}
                                    id={`grant-${option.value}`}
                                    checked={formData.authorizationGrantTypes.includes(option.value)}
                                    onChange={() => handleGrantTypeToggle(option.value)}
                                >
                                    <div>
                                        <div className="font-medium text-sm">{option.label}</div>
                                        <div className="text-xs text-gray-500 font-mono">{option.subLabel}</div>
                                        <div className="text-xs text-gray-400 mt-1">{option.description}</div>
                                    </div>
                                </Checkbox>
                            ))}
                        </div>
                    </div>

                    <MultipleUriInput
                        label="重定向 URI"
                        value={formData.redirectUris}
                        onChange={(uris) => handleChange('redirectUris', uris)}
                        placeholder="http://localhost:8080/callback"
                    />

                    <MultipleUriInput
                        label="登出重定向 URI"
                        value={formData.postLogoutRedirectUris}
                        onChange={(uris) => handleChange('postLogoutRedirectUris', uris)}
                        placeholder="http://localhost:8080/logout"
                    />

                    {/* Scopes */}
                    <div>
                        <label className="block text-sm font-medium mb-3">权限范围 *</label>
                        
                        {/* Current selected scopes */}
                        {formData.scopes.length > 0 && (
                            <div className="mb-3">
                                <div className="text-sm text-gray-600 mb-2">已选择的权限范围:</div>
                                <div className="flex gap-2 flex-wrap">
                                    {formData.scopes.map((scope) => (
                                        <Badge
                                            key={scope}
                                            variant="outline"
                                            className="text-xs px-2 py-1 cursor-pointer hover:bg-red-50 hover:border-red-300"
                                            onClick={() => handleRemoveScope(scope)}
                                        >
                                            {scope}
                                            <span className="ml-1 text-red-500">×</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add custom scope */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="输入自定义权限范围 (例如: custom.read, api.access)"
                                    value={scopeInput}
                                    onChange={(e) => setScopeInput(e.target.value)}
                                    onKeyPress={handleScopeInputKeyPress}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddScope}
                                    disabled={!scopeInput.trim() || formData.scopes.includes(scopeInput.trim())}
                                    size="sm"
                                    variant="outline"
                                >
                                    添加
                                </Button>
                            </div>
                            
                            {/* Quick select common scopes */}
                            <div>
                                <div className="text-sm text-gray-600 mb-2">常用权限范围:</div>
                                <div className="flex gap-2 flex-wrap">
                                    {COMMON_SCOPES.map(option => (
                                        <Button
                                            key={option.value}
                                            type="button"
                                            size="sm"
                                            variant={formData.scopes.includes(option.value) ? "default" : "outline"}
                                            onClick={() => handleScopeToggle(option.value)}
                                            className="text-xs"
                                            disabled={formData.scopes.includes(option.value)}
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
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
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
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

                    {/* Client Secret - Hidden for security */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">客户端密钥</label>
                        <p className="text-sm bg-gray-50 p-2 rounded text-gray-500 italic">
                            🔒 出于安全考虑，客户端密钥已隐藏
                        </p>
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
                        {client.redirectUris && client.redirectUris.trim() ? (
                            <div className="flex gap-1 flex-wrap max-h-20 overflow-y-auto">
                                {client.redirectUris.split(',').map((uri, index) => (
                                    <Badge 
                                        key={index} 
                                        variant="outline"
                                        className="text-xs break-all"
                                        title={uri.trim()}
                                    >
                                        {uri.trim()}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm bg-gray-50 p-2 rounded text-gray-500">未设置</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">登出重定向 URI</label>
                        {client.postLogoutRedirectUris && client.postLogoutRedirectUris.trim() ? (
                            <div className="flex gap-1 flex-wrap max-h-20 overflow-y-auto">
                                {client.postLogoutRedirectUris.split(',').map((uri, index) => (
                                    <Badge 
                                        key={index} 
                                        variant="outline"
                                        className="text-xs break-all"
                                        title={uri.trim()}
                                    >
                                        {uri.trim()}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm bg-gray-50 p-2 rounded text-gray-500">未设置</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">权限范围</label>
                        <div className="flex gap-1 flex-wrap max-h-20 overflow-y-auto">
                            {client.scopes?.split(',').map((scope, index) => (
                                <Badge 
                                    key={index} 
                                    variant="outline"
                                    className="text-xs"
                                    title={scope.trim()}
                                >
                                    {scope.trim()}
                                </Badge>
                            ))}
                        </div>
                        {(client.scopes?.split(',').length || 0) > 6 && (
                            <div className="text-xs text-gray-500 mt-1">
                                共 {client.scopes?.split(',').length} 个权限范围
                            </div>
                        )}
                    </div>

                    {client.clientIdIssuedAt && (
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">创建时间</label>
                            <p className="text-sm bg-gray-50 p-2 rounded">
                                {new Date(client.clientIdIssuedAt).toLocaleString()}
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
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200">
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
            console.error('Failed to load OAuth2 clients:', err)
            setError(err instanceof Error ? err.message : '加载OAuth2客户端失败')
            // Fallback to empty list if API fails
            setClients([])
            setTotalClients(0)
        } finally {
            setLoading(false)
        }
    }, [currentPage, pageSize])

    // Load clients when page/size changes or search term changes (with debounce for search)
    useEffect(() => {
        if (searchTerm) {
            // Debounced search
            const timeoutId = setTimeout(() => {
                loadClients(searchTerm)
            }, 300) // 300ms debounce
            return () => clearTimeout(timeoutId)
        } else {
            // Immediate load for pagination or initial load
            loadClients()
        }
    }, [searchTerm, currentPage, pageSize, loadClients])

    // Pagination calculations
    const totalPages = Math.ceil(totalClients / pageSize)

    // Navigation handlers
    const adminNavItems = getAdminNavItems("oauth2-clients")

    const handleNavigation = (id: string) => {
        if (id === "oauth2-clients") {
            return // Already on this page
        }
        handleAdminNavigation(id, navigate)
    }

    const goHome = () => {
        navigate({to: "/"})
    }

    const goToProfile = () => {
        navigate({to: "/admin/profile"})
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

    // Pagination handlers - using inline functions for better readability

    const handleJumpToPage = () => {
        const page = parseInt(jumpToPage)
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            setJumpToPage("")
        } else {
            // Reset invalid input
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
        // Reset to first page when search changes
        setCurrentPage(1)
    }

    // Logout handler
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
                            <p className="text-xs text-sidebar-foreground/60">客户端管理</p>
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
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">OAuth2 客户端管理</h1>
                            <p className="text-muted-foreground">管理 OAuth2 认证客户端</p>
                        </div>
                        <Button onClick={handleCreateClient} className="w-fit">
                            <Plus className="h-4 w-4 mr-2"/>
                            新建客户端
                        </Button>
                    </div>

                    {/* Search and Filter */}
                    <Card>
                        <CardHeader>
                            <CardTitle>客户端列表</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 mb-6">
                                <div className="relative flex-1 max-w-sm">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                                    <Input
                                        placeholder="搜索客户端 ID 或名称..."
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
                                        <p className="text-muted-foreground">加载客户端列表中...</p>
                                    </div>
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <p className="text-red-600 mb-4">{error}</p>
                                        <Button onClick={() => loadClients(searchTerm || undefined)} variant="outline">
                                            重新加载
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && clients.length === 0 && (
                                <div className="flex items-center justify-center py-12">
                                    <div className="text-center">
                                        <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                                        <p className="text-muted-foreground mb-4">
                                            {searchTerm ? '未找到匹配的客户端' : '暂无OAuth2客户端'}
                                        </p>
                                        {searchTerm ? (
                                            <p className="text-muted-foreground mb-4">请尝试调整搜索条件</p>
                                        ) : (
                                            <Button onClick={handleCreateClient}>
                                                <Plus className="h-4 w-4 mr-2"/>
                                                创建第一个客户端
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                            {/* Clients Table - Mobile Responsive */}
                            {!loading && !error && clients.length > 0 && (
                                <div className="rounded-md border overflow-hidden">
                                    {/* Desktop Table */}
                                    <div className="hidden lg:block">
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
                                                            <div className="flex gap-1 flex-wrap max-w-48">
                                                                {client.scopes?.split(',').slice(0, 3).map((scope, index) => (
                                                                    <Badge 
                                                                        key={index} 
                                                                        variant="outline" 
                                                                        className="text-xs"
                                                                        title={scope.trim()}
                                                                    >
                                                                        {scope.trim()}
                                                                    </Badge>
                                                                ))}
                                                                {(client.scopes?.split(',').length || 0) > 3 && (
                                                                    <Badge 
                                                                        variant="outline" 
                                                                        className="text-xs cursor-help"
                                                                        title={`其他权限范围: ${client.scopes?.split(',').slice(3).map(s => s.trim()).join(', ')}`}
                                                                    >
                                                                        +{(client.scopes?.split(',').length || 0) - 3}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {client.clientIdIssuedAt ?
                                                                new Date(client.clientIdIssuedAt).toLocaleDateString() :
                                                                '未知'
                                                            }
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400"
                                                                    onClick={() => handleViewClient(client.id!)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400"
                                                                    onClick={() => handleEditClient(client.id!)}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400"
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
                                    </div>

                                    {/* Mobile Cards */}
                                    <div className="lg:hidden space-y-4 p-4">
                                        {clients.map((client) => (
                                            <Card key={client.id} className="p-4">
                                                <div className="space-y-4">
                                                    {/* Client Header */}
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                                                            <Settings className="h-6 w-6 text-blue-600" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate">{client.clientName}</div>
                                                            <div className="text-sm text-muted-foreground font-mono truncate">{client.clientId}</div>
                                                        </div>
                                                    </div>

                                                    {/* Grant Types */}
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">授权类型:</div>
                                                        <div className="flex gap-1 flex-wrap">
                                                            {client.authorizationGrantTypes?.split(',').map((type, index) => (
                                                                <Badge key={index} variant="secondary" className="text-xs">
                                                                    {type.trim()}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Scopes */}
                                                    <div className="space-y-2">
                                                        <div className="text-sm font-medium">权限范围:</div>
                                                        <div className="flex gap-1 flex-wrap">
                                                            {client.scopes?.split(',').map((scope, index) => (
                                                                <Badge key={index} variant="outline" className="text-xs">
                                                                    {scope.trim()}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Creation Date */}
                                                    {client.clientIdIssuedAt && (
                                                        <div className="text-sm text-muted-foreground">
                                                            创建时间: {new Date(client.clientIdIssuedAt).toLocaleDateString()}
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="space-y-2 pt-2 border-t bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 rounded-lg p-3 -mx-1">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-500 hover:border-blue-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                            onClick={() => handleViewClient(client.id!)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-2"/>
                                                            查看
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-500 hover:border-green-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                            onClick={() => handleEditClient(client.id!)}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2"/>
                                                            编辑
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-500 hover:border-red-600 shadow-md hover:shadow-lg transition-all duration-200"
                                                            onClick={() => handleDeleteClient(client)}
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
                            {!loading && totalClients > pageSize && (
                                <div className="flex flex-col gap-4 mt-4 pt-4 border-t">
                                    {/* Pagination info and controls */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            第 {currentPage} 页，共 {Math.ceil(totalClients / pageSize)} 页
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
                                                disabled={currentPage >= Math.ceil(totalClients / pageSize)}
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
                                            max={Math.ceil(totalClients / pageSize)}
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
                                            disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > Math.ceil(totalClients / pageSize)}
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
                                    显示 {clients.length} 个客户端，共 {totalClients} 个客户端
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