import { createRoute, redirect } from '@tanstack/react-router'
import profile from '../page/profile'
import { rootRoute } from './router'
import { isAuthenticated } from './auth'

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: profile,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({ to: '/login' })
    }
    return true
  },
})