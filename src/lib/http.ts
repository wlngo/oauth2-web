const BASE_URL = import.meta.env.VITE_API_BASE || '/oauth2-service'

export type RequestOptions = RequestInit & {
    csrf?: boolean,
    csrfUseCache?: boolean, // 新增是否使用缓存，默认 true
}

// 获取并缓存 CSRF Token
async function getCsrfToken(useCache = true): Promise<{ token: string; headerName: string }> {
    if (useCache) {
        const cached = sessionStorage.getItem('csrfToken')
        if (cached != null) {
            return JSON.parse(cached)
        }
    }
    const res = await fetch(`${BASE_URL}/csrf`, { credentials: 'include' })
    if (!res.ok) throw new Error('Failed to fetch CSRF token')

    const data = await res.json()
    const tokenInfo = {
        token: data.token,
        headerName: data.headerName || 'X-CSRF-TOKEN',
    }
    if (useCache) {
        sessionStorage.setItem('csrfToken', JSON.stringify(tokenInfo))
    }
    if (!useCache) {
        sessionStorage.removeItem('csrfToken')
    }
    return tokenInfo
}

// 添加 CSRF Token 到 headers
async function attachCsrfToken(
    headers: Record<string, string>,
    enable: boolean | undefined,
    useCache: boolean = true
) {
    if (enable) {
        const { token, headerName } = await getCsrfToken(useCache)
        headers[headerName] = token
    }
}

// JSON 请求
export async function request<T = any>(
    url: string,
    options: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    }

    await attachCsrfToken(headers, options.csrf, options.csrfUseCache ?? true)

    const response = await fetch(`${BASE_URL}${url}`, {
        ...options,
        headers,
        credentials: 'include',
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
}

// x-www-form-urlencoded 请求
export async function formRequest<T = any>(
    url: string,
    formData: Record<string, any>,
    options: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
    }

    await attachCsrfToken(headers, options.csrf, options.csrfUseCache ?? true)

    const urlEncoded = new URLSearchParams()
    for (const key in formData) {
        const value = formData[key]
        if (value !== undefined && value !== null) {
            urlEncoded.append(key, String(value))
        }
    }

    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        ...options,
        body: urlEncoded.toString(),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
}

// multipart/form-data 请求
export async function multipartRequest<T = any>(
    url: string,
    formData: FormData,
    options: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {
        ...(options.headers as Record<string, string> || {}),
        'Accept': 'application/json',
    }

    await attachCsrfToken(headers, options.csrf, options.csrfUseCache ?? true)

    const response = await fetch(`${BASE_URL}${url}`, {
        method: 'POST',
        headers,
        credentials: 'include',
        ...options,
        body: formData,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
}

export async function getRequest<T = any>(
    url: string,
    params?: Record<string, any>,
    options: RequestOptions = {}
): Promise<T> {
    const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
    };

    // 拼接 query 参数
    let fullUrl = `${BASE_URL}${url}`;
    if (params && Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        for (const key in params) {
            const value = params[key];
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        }
        fullUrl += (url.includes('?') ? '&' : '?') + searchParams.toString();
    }

    const response = await fetch(fullUrl, {
        ...options,
        method: 'GET',
        headers,
        credentials: 'include',
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
}