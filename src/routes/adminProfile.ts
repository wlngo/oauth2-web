import {createRoute, redirect} from '@tanstack/react-router'
import adminProfile from '../page/adminProfile'
import {rootRoute} from './router'
import {isAuthenticated} from './auth'

export const adminProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/profile',
    component: adminProfile,
    beforeLoad: async () => {
        const authed = await isAuthenticated()
        if (!authed) {
            throw redirect({to: '/login'})
        }
        return true
    },
})