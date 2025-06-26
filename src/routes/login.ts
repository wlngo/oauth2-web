import { createRoute } from '@tanstack/react-router'
import login from '../page/login'
import { rootRoute } from './router'

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: login,
})
