import { getRequest } from "@/lib/http"

export async function isAuthenticated(): Promise<boolean> {
  try {
    const res = await getRequest('/api/auth/me', {}, {
      csrf: true,
      csrfUseCache: false
    });
    // 根据实际接口判断是否登录，比如有 user 字段或 code 字段等
    // 这里假设只要接口能正常返回就算已登录
    return true;
  } catch (e) {
    return false;
  }
}