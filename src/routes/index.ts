import {homeRoute} from './home'
import {loginRoute} from './login'
import {oauth2Consent} from './oauth2Consent'
import {userProfileRoute} from './userProfile'
import {oauth2Route} from './oauth2'
import {settingsRoute} from './settings'
import {rootRoute} from './router'
import {createRouter, createHashHistory} from '@tanstack/react-router'

const basepath = import.meta.env.VITE_BASE_PATH || ''

export const routeTree = rootRoute.addChildren([
    homeRoute,
    loginRoute,
    oauth2Consent,
    userProfileRoute,
    oauth2Route,
    settingsRoute
])

export const router = createRouter({
    routeTree,
    history: createHashHistory(), // ✅ 开启 Hash 模式
    basepath,
})
