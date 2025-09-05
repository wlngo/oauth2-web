import {createRoute} from '@tanstack/react-router'
import oauth2ClientDemo from '../page/oauth2ClientDemo'
import {rootRoute} from './router'

export const oauth2ClientDemoRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/oauth2-demo',
    component: oauth2ClientDemo,
})