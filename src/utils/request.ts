// src/utils/request.ts
import axios from 'axios'

import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios'

import {
  clearAdminToken,
  clearUserToken,
  getAdminAccessToken,
  getAdminRefreshToken,
  getUserAccessToken,
  getUserRefreshToken,
  setAdminToken,
  setUserToken,
} from './auth'
import { isTokenExpiringSoon } from './jwt'

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`

// ============================================================
// 创建带：
// 1. 主动提前刷新
// 2. 401 被动兜底
// 3. refresh 并发锁
// 的 axios 实例
// ============================================================

function createAuthInstance(options: {
  getAccess: () => string | null
  getRefresh: () => string | null
  setToken: (access: string, refresh: string) => void
  clearToken: () => void
}): AxiosInstance {
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
  })

  let refreshing = false
  let queue: Array<(token: string | null) => void> = []

  // 处理排队请求
  function resolveQueue(token: string | null) {
    queue.forEach((cb) => cb(token))
    queue = []
  }

  // 刷新 access token
  async function refreshToken(): Promise<string | null> {
    const refresh = options.getRefresh()
    if (!refresh) return null

    try {
      const res = await axios.post(`${BASE_URL}/auth/refresh/`, {
        refresh,
      })
      const newAccess = res.data.access as string
      options.setToken(newAccess, refresh)
      return newAccess
    } catch {
      options.clearToken()
      return null
    }
  }

  // ================= 请求拦截（主动提前刷新） =================
  instance.interceptors.request.use(async (config) => {
    let token = options.getAccess()

    // 如果 token 快过期，主动刷新
    if (token && isTokenExpiringSoon(token, 60)) {
      if (!refreshing) {
        refreshing = true
        const newToken = await refreshToken()
        resolveQueue(newToken)
        refreshing = false
        token = newToken
      } else {
        token = await new Promise((resolve) => {
          queue.push(resolve)
        })
      }
    }

    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  })

  // ================= 响应拦截（401 被动兜底） =================
  instance.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const original = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined

      if (!original || error.response?.status !== 401 || original._retry) {
        return Promise.reject(error)
      }

      original._retry = true

      if (refreshing) {
        return new Promise((resolve, reject) => {
          queue.push((token) => {
            if (!token) return reject(error)
            original.headers.Authorization = `Bearer ${token}`
            resolve(instance(original))
          })
        })
      }

      refreshing = true
      const newToken = await refreshToken()
      resolveQueue(newToken)
      refreshing = false

      if (!newToken) return Promise.reject(error)

      original.headers.Authorization = `Bearer ${newToken}`
      return instance(original)
    }
  )

  return instance
}

// 前台实例
export const frontendRequest = createAuthInstance({
  getAccess: getUserAccessToken,
  getRefresh: getUserRefreshToken,
  setToken: setUserToken,
  clearToken: clearUserToken,
})

// 后台实例
export const adminRequest = createAuthInstance({
  getAccess: getAdminAccessToken,
  getRefresh: getAdminRefreshToken,
  setToken: setAdminToken,
  clearToken: clearAdminToken,
})
