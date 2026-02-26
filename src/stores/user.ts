// src/stores/user.ts
import { initUser, loginUser } from '@/services'
import type { User } from '@/types'
import { clearToken } from '@/utils/auth'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    ready: false, // 是否已完成一次用户态确认
  }),

  getters: {
    isLogin: (state) => !!state.user,
    isAdmin: (state) => !!state.user?.is_staff,
    fullName: (state) => {
      if (!state.user) return null
      const first = state.user.first_name || state.user.username
      const last = state.user.last_name || ''
      return `${first} ${last}`.trim()
    },
  },

  actions: {
    /** App 启动 / 刷新时调用 */
    async bootstrap() {
      try {
        // initUser() 返回 null 或 User 对象
        this.user = await initUser()
      } catch {
        this.user = null
      } finally {
        this.ready = true
      }
    },

    /** 登录（只做状态，不跳转） */
    async login(payload: { email: string; password: string }) {
      this.user = await loginUser(payload)
      this.ready = true
    },

    /** 登出 */
    logout() {
      this.user = null
      this.ready = true
      clearToken() // 清理 token（localStorage / cookie）
    },
  },
})
