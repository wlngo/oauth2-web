import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './router'
import PermissionManagement from '@/page/permissionManagement'
import { isAuthenticated } from './auth'

export const permissionManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/permissions',
  component: PermissionManagement,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({to: '/login'})
    }
    return true
  },
})