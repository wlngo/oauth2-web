// src/routes/home.route.ts
import { createRoute } from '@tanstack/react-router'
import Home from '../page/Home'
import { rootRoute } from './router'

export const homeRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Home,
})
