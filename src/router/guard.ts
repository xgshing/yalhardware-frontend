/* src/router/guard.ts */
import { useUserStore } from '@/stores/user'
import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()

    // 确保用户状态初始化完成
    if (!userStore.ready) {
      await userStore.bootstrap()
    }
    // ================= 未登录，访问需要登录的页面 =================
    if (to.meta.requiresAuth && !userStore.isLogin) {
      return {
        name: 'login',
        query: {
          purpose: 'Login',
          redirect: to.fullPath,
        },
      }
    }

    // ================= 已登录 → 禁止访问 guestOnly 页面 =================
    if (to.meta.guestOnly && userStore.isLogin) {
      return userStore.isAdmin
        ? { name: 'admin-product-list' }
        : { name: 'home' }
    }

    // ================= 非管理员 → 禁止访问后台 =================
    if (to.meta.requiresAdmin && !userStore.isAdmin) {
      return { name: 'home' }
    }
    return true
  })
}
