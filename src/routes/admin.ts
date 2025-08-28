import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import AdminDashboard from '@/page/admin'

export const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
})