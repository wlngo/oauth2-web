import { getRequest } from "@/lib/http"

export interface UserInfo {
  id: string;
  username: string;
  email?: string;
  name?: string;
  roles?: string[];
  createdAt?: string;
  lastLoginAt?: string;
}

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

export async function getUserInfo(): Promise<UserInfo | null> {
  try {
    const res = await getRequest('/api/auth/me', {}, {
      csrf: true,
      csrfUseCache: false
    });
    return res;
  } catch {
    return null;
  }
}