import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import UserManagement from '@/page/userManagement'

export const userManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: UserManagement,
})