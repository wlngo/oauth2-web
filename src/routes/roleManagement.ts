import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './router'
import RoleManagement from '@/page/roleManagement'
import { isAuthenticated } from './auth'

export const roleManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: RoleManagement,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({to: '/login'})
    }
    return true
  },
})