// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { User } from '@/types/frontend/auth'
import request from '@/utils/request'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 从 localStorage 初始化
  const initializeAuth = () => {
    console.log('🔄 初始化认证状态...')

    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    console.log('📥 从 localStorage 读取:')
    console.log('  token:', storedToken ? '存在' : '不存在')
    console.log('  user:', storedUser ? '存在' : '不存在')

    if (storedToken) {
      token.value = storedToken
      console.log('✅ Token 已设置:', storedToken.substring(0, 20) + '...')
    }

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        console.log('✅ 用户信息已设置:', user.value)
      } catch (e) {
        console.error('❌ 解析用户信息失败:', e)
        localStorage.removeItem('user')
      }
    }

    // 验证 token 是否有效
    if (token.value) {
      validateToken()
    }
  }

  // 计算属性
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  // 登录方法
  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      const { data } = await request.post('/token/', {
        username,
        password,
      })

      token.value = data.access
      localStorage.setItem('token', data.access)
      localStorage.setItem('refresh', data.refresh)

      await fetchUserInfo()
      return { success: true }
    } catch (err: any) {
      error.value = '登录失败'
      logout()
      return { success: false }
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserInfo = async () => {
    const { data } = await request.get('/user/')
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  const validateToken = async () => {
    try {
      await request.get('/token/verify/')
      return true
    } catch {
      try {
        await refreshToken()
        return true
      } catch {
        logout()
        return false
      }
    }
  }

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh')
    if (!refresh) throw new Error('no refresh token')

    const { data } = await request.post('/token/refresh/', {
      refresh,
    })

    token.value = data.access
    localStorage.setItem('token', data.access)
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.clear()
  }
  // 初始化
  initializeAuth()

  return {
    // 状态
    token,
    user,
    isLoading,
    error,

    // 计算属性
    isAuthenticated,

    // 方法
    login,
    logout,
    validateToken,
    refreshToken,
    fetchUserInfo,
  }
})
