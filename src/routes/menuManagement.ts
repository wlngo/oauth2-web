import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import MenuManagement from '@/page/menuManagement'

export const menuManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/menus',
  component: MenuManagement,
})