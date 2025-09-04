import { createRoute, redirect } from '@tanstack/react-router'
import { rootRoute } from './router'
import { isAuthenticated } from './auth'

export const adminRedirectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({to: '/login'})
    }
    // Redirect to users management as the default admin page
    throw redirect({to: '/admin/users'})
  },
})