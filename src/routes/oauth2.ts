import { createRoute, redirect } from '@tanstack/react-router'
import oauth2Management from '../page/oauth2Management'
import { rootRoute } from './router'
import { isAuthenticated } from './auth'

export const oauth2Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/oauth2',
  component: oauth2Management,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({ to: '/login' })
    }
    return true
  },
})