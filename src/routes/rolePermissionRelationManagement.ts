import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './router'
import RolePermissionRelationManagement from '@/page/rolePermissionRelationManagement'
import { isAuthenticated } from './auth'

export const rolePermissionRelationManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/role-permissions',
  component: RolePermissionRelationManagement,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({to: '/login'})
    }
    return true
  },
})