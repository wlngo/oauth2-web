import { createRoute, redirect } from '@tanstack/react-router'
import AdminDashboard from '../page/admin/dashboard'
import { rootRoute } from './router'
import { isAuthenticated } from './auth'

export const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({ to: '/login' })
    }
    // TODO: Add admin role check here
    // const hasAdminRole = await checkAdminRole()
    // if (!hasAdminRole) {
    //   throw redirect({ to: '/' })
    // }
    return true
  },
})