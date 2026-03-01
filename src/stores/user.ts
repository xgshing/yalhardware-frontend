// src/stores/user.ts

import { initUser, loginUser } from '@/services/frontend/auth'
import type { LoginPayload, User } from '@/types'
import { clearUserToken } from '@/utils/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    ready: false,
    loading: false,
  }),

  getters: {
    /**
     * 是否已登录
     */
    isLogin: (state) => !!state.user,

    /**
     * 是否管理员
     */
    isAdmin: (state) => !!state.user?.is_staff,

    /**
     * 当前角色
     */
    role: (state): 'guest' | 'user' | 'admin' => {
      if (!state.user) return 'guest'
      if (state.user.is_staff) return 'admin'
      return 'user'
    },

    /**
     * 用户全名
     */
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.first_name ?? ''} ${
        state.user.last_name ?? ''
      }`.trim()
    },
  },

  actions: {
    /**
     * 登录
     */
    async login(payload: LoginPayload) {
      this.loading = true

      try {
        const user = await loginUser(payload)
        this.user = user
      } finally {
        this.loading = false
        this.ready = true
      }
    },

    /**
     * 退出登录
     */
    logout() {
      clearUserToken()
      this.user = null
      this.ready = true
    },

    /**
     * 手动设置用户
     */
    setUser(user: User | null) {
      this.user = user
      this.ready = true
    },

    /**
     * 启动时恢复登录态
     * - 页面刷新时调用
     * - 调用 /auth/me/ 验证 token
     */
    async bootstrap() {
      if (this.ready) return

      try {
        const user = await initUser()
        this.user = user
      } catch {
        this.user = null
      } finally {
        this.ready = true
      }
    },
  },
})
