import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import RolePermissionRelationManagement from '@/page/rolePermissionRelationManagement'

export const rolePermissionRelationManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/role-permissions',
  component: RolePermissionRelationManagement,
})