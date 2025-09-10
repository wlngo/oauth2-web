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
    Filter,
    X
} from "lucide-react"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Select} from "@/components/ui/select"
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

// Signature Algorithm options for dropdown
const SIGNATURE_ALGORITHM_OPTIONS = [
    { value: '', label: '请选择签名算法', description: '' },
    { value: 'RS256', label: 'RS256 - RSA + SHA-256', description: 'RSA 算法配合 SHA-256 哈希' },
    { value: 'RS384', label: 'RS384 - RSA + SHA-384', description: 'RSA 算法配合 SHA-384 哈希' },
    { value: 'RS512', label: 'RS512 - RSA + SHA-512', description: 'RSA 算法配合 SHA-512 哈希' },
    { value: 'ES256', label: 'ES256 - ECDSA + SHA-256', description: 'ECDSA 椭圆曲线算法配合 SHA-256 哈希' },
    { value: 'ES384', label: 'ES384 - ECDSA + SHA-384', description: 'ECDSA 椭圆曲线算法配合 SHA-384 哈希' },
    { value: 'ES512', label: 'ES512 - ECDSA + SHA-512', description: 'ECDSA 椭圆曲线算法配合 SHA-512 哈希' },
    { value: 'PS256', label: 'PS256 - RSA-PSS + SHA-256', description: 'RSA-PSS 算法配合 SHA-256 哈希' },
    { value: 'PS384', label: 'PS384 - RSA-PSS + SHA-384', description: 'RSA-PSS 算法配合 SHA-384 哈希' },
    { value: 'PS512', label: 'PS512 - RSA-PSS + SHA-512', description: 'RSA-PSS 算法配合 SHA-512 哈希' }
]

// Default client settings structure based on requirements
const getDefaultClientSettings = () => ({
    isRequireProofKey: false,
    isRequireAuthorizationConsent: false,
    jwkSetUrl: null,
    tokenEndpointAuthenticationSigningAlgorithm: null
})

// Default token settings structure based on requirements
const getDefaultTokenSettings = () => ({
    authorizationCodeTimeToLive: 300, // seconds
    accessTokenTimeToLive: 300, // seconds
    accessTokenFormat: 'self-contained', // 'self-contained' | 'reference'
    deviceCodeTimeToLive: 300, // seconds
    isReuseRefreshTokens: true,
    refreshTokenTimeToLive: 3600, // seconds
    idTokenSignatureAlgorithm: 'RS256' // SignatureAlgorithm enum value
})

// Access Token Format options
const ACCESS_TOKEN_FORMAT_OPTIONS = [
    { value: 'self-contained', label: 'Self-contained', description: '自包含令牌格式' },
    { value: 'reference', label: 'Reference', description: '引用令牌格式' }
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
    
    // Parse existing client settings or use defaults
    const parseClientSettings = (settingsJson?: string) => {
        try {
            if (settingsJson) {
                const parsed = JSON.parse(settingsJson)
                return {
                    isRequireProofKey: parsed.isRequireProofKey || false,
                    isRequireAuthorizationConsent: parsed.isRequireAuthorizationConsent || false,
                    jwkSetUrl: parsed.jwkSetUrl || '',
                    tokenEndpointAuthenticationSigningAlgorithm: parsed.tokenEndpointAuthenticationSigningAlgorithm || '',
                    x509CertificateSubjectDn: parsed['x509-certificate-subject-dn'] || ''
                }
            }
        } catch (e) {
            console.warn('Failed to parse client settings JSON:', e)
        }
        // Return defaults if parsing fails or no settings provided
        const defaults = getDefaultClientSettings()
        return {
            isRequireProofKey: defaults.isRequireProofKey,
            isRequireAuthorizationConsent: defaults.isRequireAuthorizationConsent,
            jwkSetUrl: '',
            tokenEndpointAuthenticationSigningAlgorithm: '',
            x509CertificateSubjectDn: ''
        }
    }

    // Parse existing token settings or use defaults
    const parseTokenSettings = (settingsJson?: string) => {
        try {
            if (settingsJson && settingsJson !== '{}') {
                const parsed = JSON.parse(settingsJson)
                
                // Handle the Spring Boot format with class name arrays
                const extractValue = (field: unknown) => {
                    if (Array.isArray(field) && field.length === 2) {
                        return field[1] // Take the value, ignore the class name
                    }
                    return field
                }
                
                return {
                    authorizationCodeTimeToLive: extractValue(parsed.authorizationCodeTimeToLive) || 300,
                    accessTokenTimeToLive: extractValue(parsed.accessTokenTimeToLive) || 300,
                    accessTokenFormat: parsed.accessTokenFormat || 'self-contained',
                    deviceCodeTimeToLive: extractValue(parsed.deviceCodeTimeToLive) || 300,
                    isReuseRefreshTokens: parsed.isReuseRefreshTokens ?? true,
                    refreshTokenTimeToLive: extractValue(parsed.refreshTokenTimeToLive) || 3600,
                    idTokenSignatureAlgorithm: extractValue(parsed.idTokenSignatureAlgorithm) || 'RS256'
                }
            }
        } catch (e) {
            console.warn('Failed to parse token settings JSON:', e)
        }
        // Return defaults if parsing fails or no settings provided
        return getDefaultTokenSettings()
    }

    const [formData, setFormData] = useState({
        clientId: client?.clientId || '',
        clientName: client?.clientName || '',
        clientSecret: client?.clientSecret || '',
        clientAuthenticationMethods: client?.clientAuthenticationMethods?.split(',').map(m => m.trim()) || [CLIENT_AUTH_METHODS.CLIENT_SECRET_BASIC],
        authorizationGrantTypes: client?.authorizationGrantTypes?.split(',').map(t => t.trim()) || [GRANT_TYPES.AUTHORIZATION_CODE, GRANT_TYPES.REFRESH_TOKEN],
        redirectUris: client?.redirectUris?.split(',').map(u => u.trim()).filter(u => u) || [],
        postLogoutRedirectUris: client?.postLogoutRedirectUris?.split(',').map(u => u.trim()).filter(u => u) || [],
        scopes: client?.scopes?.split(',').map(s => s.trim()) || ['read', 'write']
    })

    // Separate client settings state
    const [clientSettingsData, setClientSettingsData] = useState(parseClientSettings(client?.clientSettings))
    
    // Separate token settings state
    const [tokenSettingsData, setTokenSettingsData] = useState(parseTokenSettings(client?.tokenSettings))
    
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

    const handleClientSettingChange = (field: string, value: string | boolean | null) => {
        setClientSettingsData(prev => ({ ...prev, [field]: value }))
    }

    const handleTokenSettingChange = (field: string, value: string | number | boolean) => {
        setTokenSettingsData(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        // Serialize client settings back to JSON
        const clientSettingsJson = JSON.stringify({
            isRequireProofKey: clientSettingsData.isRequireProofKey,
            isRequireAuthorizationConsent: clientSettingsData.isRequireAuthorizationConsent,
            jwkSetUrl: clientSettingsData.jwkSetUrl || null,
            tokenEndpointAuthenticationSigningAlgorithm: clientSettingsData.tokenEndpointAuthenticationSigningAlgorithm || null,
            ...(clientSettingsData.x509CertificateSubjectDn && {
                'x509-certificate-subject-dn': clientSettingsData.x509CertificateSubjectDn
            })
        })
        
        // Serialize token settings back to JSON with Spring Boot format
        const tokenSettingsJson = JSON.stringify({
            authorizationCodeTimeToLive: ['java.time.Duration', tokenSettingsData.authorizationCodeTimeToLive],
            accessTokenTimeToLive: ['java.time.Duration', tokenSettingsData.accessTokenTimeToLive],
            accessTokenFormat: tokenSettingsData.accessTokenFormat,
            deviceCodeTimeToLive: ['java.time.Duration', tokenSettingsData.deviceCodeTimeToLive],
            isReuseRefreshTokens: tokenSettingsData.isReuseRefreshTokens,
            refreshTokenTimeToLive: ['java.time.Duration', tokenSettingsData.refreshTokenTimeToLive],
            idTokenSignatureAlgorithm: ['org.springframework.security.oauth2.jose.jws.SignatureAlgorithm', tokenSettingsData.idTokenSignatureAlgorithm]
        })
        
        const submitData = {
            ...formData,
            clientAuthenticationMethods: formData.clientAuthenticationMethods.join(','),
            authorizationGrantTypes: formData.authorizationGrantTypes.join(','),
            redirectUris: formData.redirectUris.join(','),
            postLogoutRedirectUris: formData.postLogoutRedirectUris.join(','),
            scopes: formData.scopes.join(','),
            clientSettings: clientSettingsJson,
            tokenSettings: tokenSettingsJson
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
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">
                        {client ? '编辑 OAuth2 客户端' : '创建 OAuth2 客户端'}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
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
                                    <Plus className="h-4 w-4" />
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

                    {/* Client Settings */}
                    <div>
                        <label className="block text-sm font-medium mb-3">客户端设置</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Boolean settings as checkboxes */}
                            <Checkbox
                                id="isRequireProofKey"
                                checked={clientSettingsData.isRequireProofKey}
                                onChange={(checked) => handleClientSettingChange('isRequireProofKey', checked)}
                            >
                                <div>
                                    <div className="font-medium text-sm">需要 PKCE 验证</div>
                                    <div className="text-xs text-gray-500 font-mono">isRequireProofKey: {clientSettingsData.isRequireProofKey ? 'true' : 'false'}</div>
                                    <div className="text-xs text-gray-400 mt-1">控制是否需要 PKCE (Proof Key for Code Exchange) 验证，提高授权码模式的安全性</div>
                                </div>
                            </Checkbox>

                            <Checkbox
                                id="isRequireAuthorizationConsent"
                                checked={clientSettingsData.isRequireAuthorizationConsent}
                                onChange={(checked) => handleClientSettingChange('isRequireAuthorizationConsent', checked)}
                            >
                                <div>
                                    <div className="font-medium text-sm">需要授权同意确认</div>
                                    <div className="text-xs text-gray-500 font-mono">isRequireAuthorizationConsent: {clientSettingsData.isRequireAuthorizationConsent ? 'true' : 'false'}</div>
                                    <div className="text-xs text-gray-400 mt-1">控制是否需要用户授权同意确认，让用户明确知道授权的权限范围</div>
                                </div>
                            </Checkbox>

                            {/* Input field settings */}
                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">JWK 密钥集合 URL</div>
                                    <div className="text-xs text-gray-500 font-mono">jwkSetUrl: {clientSettingsData.jwkSetUrl ? `"${clientSettingsData.jwkSetUrl}"` : 'null'}</div>
                                    <div className="text-xs text-gray-400 mt-1">JWK Set URL，用于获取公钥验证 JWT 令牌的数字签名</div>
                                    <Input
                                        id="jwkSetUrl"
                                        value={clientSettingsData.jwkSetUrl}
                                        onChange={(e) => handleClientSettingChange('jwkSetUrl', e.target.value)}
                                        placeholder="https://example.com/.well-known/jwks.json（可选）"
                                        className="text-sm mt-2"
                                    />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">令牌端点认证签名算法</div>
                                    <div className="text-xs text-gray-500 font-mono">tokenEndpointAuthenticationSigningAlgorithm: {clientSettingsData.tokenEndpointAuthenticationSigningAlgorithm || 'null'}</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {clientSettingsData.tokenEndpointAuthenticationSigningAlgorithm ? (
                                            `🔐 ${SIGNATURE_ALGORITHM_OPTIONS.find(opt => opt.value === clientSettingsData.tokenEndpointAuthenticationSigningAlgorithm)?.description || 'Token认证签名算法'}`
                                        ) : (
                                            'ℹ️ 未选择签名算法，将使用默认配置'
                                        )}
                                    </div>
                                    <Select
                                        id="tokenEndpointAuthenticationSigningAlgorithm"
                                        value={clientSettingsData.tokenEndpointAuthenticationSigningAlgorithm || ''}
                                        onChange={(e) => handleClientSettingChange('tokenEndpointAuthenticationSigningAlgorithm', e.target.value || null)}
                                        className="text-sm mt-2"
                                    >
                                        {SIGNATURE_ALGORITHM_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            <div className="md:col-span-2 p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">X.509 证书主题专有名称</div>
                                    <div className="text-xs text-gray-500 font-mono">x509CertificateSubjectDn: {clientSettingsData.x509CertificateSubjectDn ? `"${clientSettingsData.x509CertificateSubjectDn}"` : '未设置'}</div>
                                    <div className="text-xs text-gray-400 mt-1">用于 TLS 客户端认证的 X.509 证书主题专有名称，增强客户端身份验证安全性</div>
                                    <Input
                                        id="x509CertificateSubjectDn"
                                        value={clientSettingsData.x509CertificateSubjectDn}
                                        onChange={(e) => handleClientSettingChange('x509CertificateSubjectDn', e.target.value)}
                                        placeholder="CN=client.example.com,O=Example Corp,C=US（可选）"
                                        className="text-sm mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Token Settings */}
                    <div>
                        <label className="block text-sm font-medium mb-3">令牌设置</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Duration settings */}
                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">授权码有效期</div>
                                    <div className="text-xs text-gray-500 font-mono">authorizationCodeTimeToLive: {tokenSettingsData.authorizationCodeTimeToLive}s</div>
                                    <div className="text-xs text-gray-400 mt-1">授权码的有效期（秒）</div>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={tokenSettingsData.authorizationCodeTimeToLive}
                                        onChange={(e) => handleTokenSettingChange('authorizationCodeTimeToLive', parseInt(e.target.value) || 300)}
                                        placeholder="300"
                                        className="text-sm mt-2"
                                    />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">访问令牌有效期</div>
                                    <div className="text-xs text-gray-500 font-mono">accessTokenTimeToLive: {tokenSettingsData.accessTokenTimeToLive}s</div>
                                    <div className="text-xs text-gray-400 mt-1">访问令牌的有效期（秒）</div>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={tokenSettingsData.accessTokenTimeToLive}
                                        onChange={(e) => handleTokenSettingChange('accessTokenTimeToLive', parseInt(e.target.value) || 300)}
                                        placeholder="300"
                                        className="text-sm mt-2"
                                    />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">设备码有效期</div>
                                    <div className="text-xs text-gray-500 font-mono">deviceCodeTimeToLive: {tokenSettingsData.deviceCodeTimeToLive}s</div>
                                    <div className="text-xs text-gray-400 mt-1">设备码的有效期（秒）</div>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={tokenSettingsData.deviceCodeTimeToLive}
                                        onChange={(e) => handleTokenSettingChange('deviceCodeTimeToLive', parseInt(e.target.value) || 300)}
                                        placeholder="300"
                                        className="text-sm mt-2"
                                    />
                                </div>
                            </div>

                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">刷新令牌有效期</div>
                                    <div className="text-xs text-gray-500 font-mono">refreshTokenTimeToLive: {tokenSettingsData.refreshTokenTimeToLive}s</div>
                                    <div className="text-xs text-gray-400 mt-1">刷新令牌的有效期（秒）</div>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={tokenSettingsData.refreshTokenTimeToLive}
                                        onChange={(e) => handleTokenSettingChange('refreshTokenTimeToLive', parseInt(e.target.value) || 3600)}
                                        placeholder="3600"
                                        className="text-sm mt-2"
                                    />
                                </div>
                            </div>

                            {/* Boolean setting */}
                            <Checkbox
                                id="isReuseRefreshTokens"
                                checked={tokenSettingsData.isReuseRefreshTokens}
                                onChange={(checked) => handleTokenSettingChange('isReuseRefreshTokens', checked)}
                            >
                                <div>
                                    <div className="font-medium text-sm">重用刷新令牌</div>
                                    <div className="text-xs text-gray-500 font-mono">isReuseRefreshTokens: {tokenSettingsData.isReuseRefreshTokens ? 'true' : 'false'}</div>
                                    <div className="text-xs text-gray-400 mt-1">是否重用刷新令牌</div>
                                </div>
                            </Checkbox>

                            {/* Access Token Format */}
                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">访问令牌格式</div>
                                    <div className="text-xs text-gray-500 font-mono">accessTokenFormat: "{tokenSettingsData.accessTokenFormat}"</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {tokenSettingsData.accessTokenFormat === 'self-contained' ? (
                                            '🔒 自包含令牌格式'
                                        ) : (
                                            '🔗 引用令牌格式'
                                        )}
                                    </div>
                                    <Select
                                        id="accessTokenFormat"
                                        value={tokenSettingsData.accessTokenFormat}
                                        onChange={(e) => handleTokenSettingChange('accessTokenFormat', e.target.value)}
                                        className="text-sm mt-2"
                                    >
                                        {ACCESS_TOKEN_FORMAT_OPTIONS.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>

                            {/* ID Token Signature Algorithm */}
                            <div className="p-3 rounded-lg border border-gray-200">
                                <div>
                                    <div className="font-medium text-sm">ID令牌签名算法</div>
                                    <div className="text-xs text-gray-500 font-mono">idTokenSignatureAlgorithm: "{tokenSettingsData.idTokenSignatureAlgorithm}"</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {tokenSettingsData.idTokenSignatureAlgorithm ? (
                                            `🔐 ${SIGNATURE_ALGORITHM_OPTIONS.find(opt => opt.value === tokenSettingsData.idTokenSignatureAlgorithm)?.description || 'ID Token签名算法'}`
                                        ) : (
                                            'ℹ️ 未选择签名算法，将使用默认配置'
                                        )}
                                    </div>
                                    <Select
                                        id="idTokenSignatureAlgorithm"
                                        value={tokenSettingsData.idTokenSignatureAlgorithm || ''}
                                        onChange={(e) => handleTokenSettingChange('idTokenSignatureAlgorithm', e.target.value || 'RS256')}
                                        className="text-sm mt-2"
                                    >
                                        {SIGNATURE_ALGORITHM_OPTIONS.filter(opt => opt.value !== '').map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                            </div>
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
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">OAuth2 客户端详情</h3>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => onEdit(client)}>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                        </Button>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
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

                    {/* Client Settings */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">客户端设置</label>
                        {(() => {
                            // Parse client settings for display
                            const parseClientSettingsForDisplay = (settingsJson?: string) => {
                                try {
                                    if (settingsJson) {
                                        return JSON.parse(settingsJson)
                                    }
                                } catch (e) {
                                    console.warn('Failed to parse client settings JSON:', e)
                                }
                                return getDefaultClientSettings()
                            }
                            
                            const clientSettings = parseClientSettingsForDisplay(client.clientSettings)
                            
                            return (
                                <div className="bg-gray-50 p-3 rounded space-y-2">
                                    <div>
                                        <span className="text-sm font-medium">需要 PKCE 验证: </span>
                                        <span className="text-sm font-mono">{clientSettings.isRequireProofKey ? 'true' : 'false'}</span>
                                        <span className="text-xs text-gray-500 ml-2">({clientSettings.isRequireProofKey ? '需要' : '不需要'} PKCE 验证)</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">需要授权同意确认: </span>
                                        <span className="text-sm font-mono">{clientSettings.isRequireAuthorizationConsent ? 'true' : 'false'}</span>
                                        <span className="text-xs text-gray-500 ml-2">({clientSettings.isRequireAuthorizationConsent ? '需要' : '不需要'}用户授权同意)</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">JWK 密钥集合 URL: </span>
                                        <span className="text-sm font-mono break-all">{clientSettings.jwkSetUrl || 'null'}</span>
                                        {clientSettings.jwkSetUrl && (
                                            <div className="text-xs text-gray-500 mt-1">💡 用于获取公钥验证 JWT 令牌</div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">令牌端点认证签名算法: </span>
                                        <span className="text-sm font-mono">{clientSettings.tokenEndpointAuthenticationSigningAlgorithm || 'null'}</span>
                                        {clientSettings.tokenEndpointAuthenticationSigningAlgorithm && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                🔐 {SIGNATURE_ALGORITHM_OPTIONS.find(opt => opt.value === clientSettings.tokenEndpointAuthenticationSigningAlgorithm)?.description || 'Token认证签名算法'}
                                            </div>
                                        )}
                                    </div>
                                    {clientSettings['x509-certificate-subject-dn'] && (
                                        <div>
                                            <span className="text-sm font-medium">X.509 证书主题专有名称: </span>
                                            <span className="text-sm font-mono break-all">"{clientSettings['x509-certificate-subject-dn']}"</span>
                                            <div className="text-xs text-gray-500 mt-1">🛡️ 用于TLS客户端认证</div>
                                        </div>
                                    )}
                                </div>
                            )
                        })()}
                    </div>

                    {/* Token Settings Display */}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">令牌设置</label>
                        {(() => {
                            const parseTokenSettingsForDisplay = (settingsJson?: string) => {
                                try {
                                    if (settingsJson && settingsJson !== '{}') {
                                        return JSON.parse(settingsJson)
                                    }
                                } catch (e) {
                                    console.warn('Failed to parse token settings JSON:', e)
                                }
                                return getDefaultTokenSettings()
                            }
                            
                            const tokenSettings = parseTokenSettingsForDisplay(client.tokenSettings)
                            
                            // Helper function to extract values from Spring Boot format
                            const extractValue = (field: unknown) => {
                                if (Array.isArray(field) && field.length === 2) {
                                    return field[1] // Take the value, ignore the class name
                                }
                                return field
                            }

                            return (
                                <div className="bg-gray-50 p-3 rounded space-y-2">
                                    <div>
                                        <span className="text-sm font-medium">授权码有效期: </span>
                                        <span className="text-sm font-mono">{extractValue(tokenSettings.authorizationCodeTimeToLive)}秒</span>
                                        <span className="text-xs text-gray-500 ml-2">(授权码过期时间)</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">访问令牌有效期: </span>
                                        <span className="text-sm font-mono">{extractValue(tokenSettings.accessTokenTimeToLive)}秒</span>
                                        <span className="text-xs text-gray-500 ml-2">(访问令牌过期时间)</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">设备码有效期: </span>
                                        <span className="text-sm font-mono">{extractValue(tokenSettings.deviceCodeTimeToLive)}秒</span>
                                        <span className="text-xs text-gray-500 ml-2">(设备码过期时间)</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">刷新令牌有效期: </span>
                                        <span className="text-sm font-mono">{extractValue(tokenSettings.refreshTokenTimeToLive)}秒</span>
                                        <span className="text-xs text-gray-500 ml-2">(刷新令牌过期时间)</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">重用刷新令牌: </span>
                                        <span className="text-sm font-mono">{tokenSettings.isReuseRefreshTokens ? 'true' : 'false'}</span>
                                        <span className="text-xs text-gray-500 ml-2">({tokenSettings.isReuseRefreshTokens ? '重用' : '不重用'}刷新令牌)</span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">访问令牌格式: </span>
                                        <span className="text-sm font-mono">"{tokenSettings.accessTokenFormat}"</span>
                                        <span className="text-xs text-gray-500 ml-2">
                                            ({tokenSettings.accessTokenFormat === 'self-contained' ? '自包含格式' : '引用格式'})
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium">ID令牌签名算法: </span>
                                        <span className="text-sm font-mono">"{extractValue(tokenSettings.idTokenSignatureAlgorithm)}"</span>
                                        {extractValue(tokenSettings.idTokenSignatureAlgorithm) && (
                                            <div className="text-xs text-gray-500 mt-1">
                                                🔐 {SIGNATURE_ALGORITHM_OPTIONS.find(opt => opt.value === extractValue(tokenSettings.idTokenSignatureAlgorithm))?.description || 'ID Token签名算法'}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })()}
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