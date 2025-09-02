import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import RoleManagement from '@/page/roleManagement'

export const roleManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: RoleManagement,
})