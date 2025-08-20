import {getRequest} from "@/lib/http"

export async function isAuthenticated(): Promise<boolean> {
    try {
        const res = await getRequest('/api/auth/me', {}, {
            csrf: true,
            csrfUseCache: false
        });
        // 这里假设只要接口能正常返回就算已登录
        return res;
    } catch {
        return false;
    }
}