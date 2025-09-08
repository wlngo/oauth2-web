import {createRoute} from '@tanstack/react-router'
import oauth2ScopeTest from '../page/oauth2ScopeTest'
import {rootRoute} from './router'

export const oauth2ScopeTestRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/oauth2-scope-test',
    component: oauth2ScopeTest,
})