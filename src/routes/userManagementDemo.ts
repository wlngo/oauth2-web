import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import UserManagementDemo from '@/page/userManagementDemo'

export const userManagementDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/demo/users',
  component: UserManagementDemo,
})