// src/routes/adminDashboard.route.ts
import {createRoute, redirect} from '@tanstack/react-router'
import adminDashboard from '../page/adminDashboard'
import {rootRoute} from './router'
import {isAuthenticated} from './auth'

export const adminDashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin',
    component: adminDashboard,
    beforeLoad: async () => {
        const authed = await isAuthenticated()
        if (!authed) {
            throw redirect({to: '/login'})
        }
        // For this demo, we'll allow any authenticated user to access admin
        // In a real app, you'd check for admin role here
        return true
    },
})