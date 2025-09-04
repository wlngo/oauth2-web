import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './router'
import UserManagement from '@/page/userManagement'
import { isAuthenticated } from './auth'

export const userManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UserManagement,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({to: '/login'})
    }
    return true
  },
})