import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import ConfirmationDemo from '@/page/confirmationDemo'

export const confirmationDemoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/confirmation-demo',
  component: ConfirmationDemo
})