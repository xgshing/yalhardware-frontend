// stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { User } from '@/types/auth'

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
  const isAuthenticated = computed(() => {
    const hasToken = !!token.value
    const hasUser = !!user.value
    console.log(`🔐 检查认证: token=${hasToken}, user=${hasUser}`)
    return hasToken && hasUser
  })

  // 登录方法
  const login = async (username: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('🔐 开始登录:', username)

      const response = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      })

      console.log('✅ 登录成功，响应:', response.data)

      // 保存 token
      const { access, refresh } = response.data
      token.value = access
      localStorage.setItem('token', access)
      localStorage.setItem('refresh', refresh)

      // 获取用户信息
      await fetchUserInfo(access)

      console.log('🎉 登录流程完成')
      return { success: true }
    } catch (err: any) {
      console.error('❌ 登录失败:', err)

      error.value =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        '登录失败，请检查用户名和密码'

      // 清理无效的认证信息
      logout()

      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 获取用户信息
  const fetchUserInfo = async (accessToken: string) => {
    try {
      console.log('👤 获取用户信息...')

      const response = await axios.get('http://localhost:8000/api/user/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      console.log('✅ 用户信息:', response.data)

      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (err) {
      console.error('❌ 获取用户信息失败:', err)
      throw err
    }
  }

  // 验证 token
  const validateToken = async () => {
    if (!token.value) return false

    try {
      console.log('🔍 验证 token...')

      await axios.get('http://localhost:8000/api/token/verify/', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      console.log('✅ Token 有效')
      return true
    } catch (err) {
      console.warn('⚠️ Token 无效或已过期')

      // 尝试刷新 token
      try {
        await refreshToken()
        return true
      } catch {
        console.log('❌ 刷新 token 失败，需要重新登录')
        logout()
        return false
      }
    }
  }

  // 刷新 token
  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh')

    if (!refreshToken) {
      throw new Error('没有 refresh token')
    }

    console.log('🔄 刷新 token...')

    try {
      const response = await axios.post(
        'http://localhost:8000/api/token/refresh/',
        {
          refresh: refreshToken,
        }
      )

      const newAccessToken = response.data.access
      token.value = newAccessToken
      localStorage.setItem('token', newAccessToken)

      console.log('✅ Token 刷新成功')
      return newAccessToken
    } catch (err) {
      console.error('❌ 刷新 token 失败:', err)
      throw err
    }
  }

  // 注销
  const logout = () => {
    console.log('👋 注销用户')

    token.value = null
    user.value = null

    localStorage.removeItem('token')
    localStorage.removeItem('refresh')
    localStorage.removeItem('user')

    console.log('✅ 认证信息已清除')
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
