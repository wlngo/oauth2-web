import {createRoute, redirect} from '@tanstack/react-router'
import userProfile from '../page/userProfile'
import {rootRoute} from './router'
import {isAuthenticated} from './auth'

export const userProfileRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/profile',
    component: userProfile,
    beforeLoad: async () => {
        const authed = await isAuthenticated()
        if (!authed) {
            throw redirect({to: '/login'})
        }
        return true
    },
})