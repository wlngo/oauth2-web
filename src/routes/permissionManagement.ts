import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import PermissionManagement from '@/page/permissionManagement'

export const permissionManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/permissions',
  component: PermissionManagement,
})