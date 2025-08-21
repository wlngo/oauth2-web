import {getRequest} from "@/lib/http"

type AuthResponse = {
    code: number
    data?: unknown
    msg?: string
}

export async function isAuthenticated(): Promise<boolean> {
    try {
        const res = await getRequest<AuthResponse>('/api/auth/me', {}, {
            csrf: true,
            csrfUseCache: false
        });
        // 这里假设只要接口能正常返回就算已登录
        return res != null;
    } catch {
        return false;
    }
}