import { request, getRequest, formRequest } from '@/lib/http'

// API response wrapper interface
interface ApiResponse<T> {
    code: number
    msg: string
    data: T
    identifier: boolean
}

// Paginated response interface
interface PaginatedResponse<T> {
    list: T[]
    total: number
    pageNum: number
    pageSize: number
}

// OAuth2 Client interface matching the API specification
export interface OAuth2Client {
    id?: string
    clientId: string
    clientName: string
    clientSecret: string
    clientAuthenticationMethods?: string
    authorizationGrantTypes?: string
    redirectUris?: string
    postLogoutRedirectUris?: string
    scopes?: string
    clientSettings?: string
    tokenSettings?: string
    clientIdIssuedAt?: number
    clientSecretExpiresAt?: number | null
}

// Create OAuth2 client request interface
export interface CreateOAuth2ClientRequest {
    clientId: string
    clientName: string
    clientSecret: string
    clientAuthenticationMethods?: string
    authorizationGrantTypes?: string
    redirectUris?: string
    postLogoutRedirectUris?: string
    scopes?: string
    clientSettings?: string
    tokenSettings?: string
}

// Update OAuth2 client request interface
export interface UpdateOAuth2ClientRequest {
    id: string
    clientId: string
    clientName: string
    clientSecret: string
    clientAuthenticationMethods?: string
    authorizationGrantTypes?: string
    redirectUris?: string
    postLogoutRedirectUris?: string
    scopes?: string
    clientSettings?: string
    tokenSettings?: string
}

// Get all OAuth2 clients with pagination and search
export async function getAllOAuth2Clients(page: number = 1, size: number = 10, keyword?: string): Promise<PaginatedResponse<OAuth2Client>> {
    const response = await formRequest<ApiResponse<PaginatedResponse<OAuth2Client>>>('/api/oauth2-clients/getAllClients',
        {
            page: page,
            size: size,
            ...(keyword ? { keyword } : {})
        }, {
            method: 'POST',
            csrf: true
        })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch OAuth2 clients')
    }

    return response.data
}

// Get OAuth2 client by ID
export async function getOAuth2ClientById(id: string): Promise<OAuth2Client> {
    const response = await getRequest<ApiResponse<OAuth2Client>>(`/api/oauth2-clients/findById/${id}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch OAuth2 client')
    }

    return response.data
}

// Get OAuth2 client by client ID
export async function getOAuth2ClientByClientId(clientId: string): Promise<OAuth2Client> {
    const response = await getRequest<ApiResponse<OAuth2Client>>(`/api/oauth2-clients/findByClientId/${clientId}`)

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to fetch OAuth2 client')
    }

    return response.data
}

// Create new OAuth2 client
export async function createOAuth2Client(clientData: CreateOAuth2ClientRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/oauth2-clients/createClient', {
        method: 'POST',
        body: JSON.stringify(clientData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to create OAuth2 client')
    }

    return response.data
}

// Update existing OAuth2 client
export async function updateOAuth2Client(clientData: UpdateOAuth2ClientRequest): Promise<number> {
    const response = await request<ApiResponse<number>>('/api/oauth2-clients/updateClient', {
        method: 'POST',
        body: JSON.stringify(clientData),
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to update OAuth2 client')
    }

    return response.data
}

// Delete OAuth2 client
export async function deleteOAuth2Client(id: string): Promise<number> {
    const response = await request<ApiResponse<number>>(`/api/oauth2-clients/deleteClient/${id}`, {
        method: 'DELETE',
        csrf: true
    })

    if (response.code !== 200) {
        throw new Error(response.msg || 'Failed to delete OAuth2 client')
    }

    return response.data
}