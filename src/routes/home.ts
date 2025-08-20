// src/routes/home.route.ts
import {createRoute, redirect} from '@tanstack/react-router'
import home from '../page/home'
import {rootRoute} from './router'
import {isAuthenticated} from './auth'


export const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: home,
    beforeLoad: async () => {
        const authed = await isAuthenticated()
        if (!authed) {
            throw redirect({to: '/login'})
        }
        // 已登录则正常进入
        return true
    },
})