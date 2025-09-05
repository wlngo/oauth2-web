import {createRoute, redirect} from '@tanstack/react-router'
import oauth2ClientManagement from '../page/oauth2ClientManagement'
import {rootRoute} from './router'
import {isAuthenticated} from './auth'

export const oauth2ClientManagementRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/admin/oauth2-clients',
    component: oauth2ClientManagement,
    beforeLoad: async () => {
        const authed = await isAuthenticated()
        if (!authed) {
            throw redirect({to: '/login'})
        }
        // 已登录则正常进入
        return true
    },
})