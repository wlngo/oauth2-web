import { createRoute, redirect } from '@tanstack/react-router'
import systemSettings from '../page/systemSettings'
import { rootRoute } from './router'
import { isAuthenticated } from './auth'

export const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: systemSettings,
  beforeLoad: async () => {
    const authed = await isAuthenticated()
    if (!authed) {
      throw redirect({ to: '/login' })
    }
    return true
  },
})