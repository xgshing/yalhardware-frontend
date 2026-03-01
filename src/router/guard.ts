// src/router/guard.ts
import { useAdminStore } from '@/stores/admin'
import { useUserStore } from '@/stores/user'
import type { Router } from 'vue-router'

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore()
    const adminStore = useAdminStore()

    // ---------- 初始化状态 ----------
    if (!userStore.ready) {
      try {
        await userStore.bootstrap()
        console.log('User Store Bootstrap Success:', userStore.user)
      } catch {}
    }
    if (!adminStore.ready) {
      try {
        await adminStore.bootstrap()
        console.log('Admin Store Bootstrap Success:', adminStore.admin)
      } catch {}
    }

    console.log('guard.ts | to:', to.name)
    console.log('guard.ts | adminStore.isLogin:', adminStore.isLogin)
    console.log('guard.ts | userStore.isLogin:', userStore.isLogin)

    // ---------- 首页永远允许 ----------
    if (to.name === 'home') return true

    // ---------- 管理员路由保护 ----------
    if (to.meta.requiresAdmin) {
      if (!adminStore.isLogin) {
        console.log('Redirecting to admin-login')
        return { name: 'admin-login', query: { redirect: to.fullPath } }
      }
      return true // 管理员已登录
    }

    // ---------- 前台用户路由保护 ----------
    if (to.meta.requiresAuth) {
      if (!userStore.isLogin) {
        console.log('Redirecting to login')
        return { name: 'login', query: { redirect: to.fullPath } }
      }
      return true
    }

    return true
  })
}
