import { homeRoute } from './home'
import { loginRoute } from './login'
import { rootRoute } from './router'
import { createRouter, createHashHistory } from '@tanstack/react-router'

const basepath = import.meta.env.VITE_BASE_PATH || ''

export const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
])

export const router = createRouter({
  routeTree,
  history: createHashHistory(), // ✅ 开启 Hash 模式
  basepath,
})
