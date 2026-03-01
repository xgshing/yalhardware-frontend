/* src/router/index.ts */
import {
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { setupRouterGuard } from './guard'

import adminRoutes from './routes/admin'
import frontendRoutes from './routes/frontend'
import publicRoutes from './routes/public'

const isProd = import.meta.env.PROD

const router = createRouter({
  history: isProd
    ? createWebHashHistory(import.meta.env.BASE_URL) // 生产：GitHub Pages
    : createWebHistory(), // 本地开发
  routes: [...publicRoutes, ...frontendRoutes, ...adminRoutes],

  //“逻辑跳转 + 视觉回到顶部”
  scrollBehavior() {
    return { top: 0 }
  },
})

// 注册权限守卫
setupRouterGuard(router)

export default router
