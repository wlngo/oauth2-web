import { createRoute, redirect } from '@tanstack/react-router'
import consent from '../page/oauth2Consent'
import { rootRoute } from './router'
import { isAuthenticated } from './auth'
export const oauth2Consent = createRoute({
    getParentRoute: () => rootRoute,
    path: '/oauth2/consent',
    component: consent,
    beforeLoad: async () => {
        const authed = await isAuthenticated()
        if (!authed) {
            throw redirect({ to: '/login' })
        }
        // 已登录则正常进入
        return true
    },
})