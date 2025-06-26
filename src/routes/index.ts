import { homeRoute } from './home'
import { loginRoute } from './login'
import { rootRoute } from './router'
import { createRouter } from '@tanstack/react-router'

export const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
])
export const router = createRouter({
  routeTree,
})
