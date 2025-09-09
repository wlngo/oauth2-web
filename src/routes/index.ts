import {homeRoute} from './home'
import {loginRoute} from './login'
import {oauth2Consent} from './oauth2Consent'
import {userProfileRoute} from './userProfile'
import {adminProfileRoute} from './adminProfile'
import {adminRedirectRoute} from './adminRedirect'
import {userManagementRoute} from './userManagement'
import {userManagementDemoRoute} from './userManagementDemo'
import {roleManagementRoute} from './roleManagement'
import {permissionManagementRoute} from './permissionManagement'
import {oauth2ClientManagementRoute} from './oauth2ClientManagement'
import {oauth2ClientDemoRoute} from './oauth2ClientDemo'
import {oauth2ClientTestRoute} from './oauth2ClientTest'
import {oauth2ScopeTestRoute} from './oauth2ScopeTest'
import {rootRoute} from './router'
import {createRouter, createHashHistory,createBrowserHistory} from '@tanstack/react-router'

const basepath = import.meta.env.VITE_BASE_PATH || ''
const useHash = import.meta.env.VITE_ROUTER_HASH !== 'false' // 默认为true
const history = useHash ? createHashHistory() : createBrowserHistory()
export const routeTree = rootRoute.addChildren([
    homeRoute,
    loginRoute,
    oauth2Consent,
    userProfileRoute,
    adminProfileRoute,
    adminRedirectRoute,
    userManagementRoute,
    userManagementDemoRoute,
    roleManagementRoute,
    permissionManagementRoute,
    oauth2ClientManagementRoute,
    oauth2ClientDemoRoute,
    oauth2ClientTestRoute,
    oauth2ScopeTestRoute
])

export const router = createRouter({
    routeTree,
    history: history, // ✅ 开启 Hash 模式
    basepath,
})
