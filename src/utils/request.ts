// src/utils/request.ts
/**
 * Axios HTTP 客户端配置(管理接口的基础配置)
 * 封装了与后端 API 的通信逻辑，包括请求拦截、响应拦截和错误处理
 * 使用环境变量配置 API 基础地址，支持 JWT 认证
 */
// src/utils/request.ts
import axios from 'axios'
import { clearToken, getAccessToken, getRefreshToken, setToken } from './auth'

/**
 * ===============================
 * 创建 Axios 实例
 * 配置基础的 API 请求设置
 * ===============================
 */
const request = axios.create({
  // 基础 API URL：从环境变量 VITE_API_BASE_URL 获取，拼接 /api 路径
  // 支持不同环境（开发 / 测试 / 生产）
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 30000,
})

/**
 * =================================
 * 刷新 Token 专用实例（不带拦截器）
 * 与主 request 完全隔离
 * =================================
 */
const refreshClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
})

/**
 * ===============================
 * 请求拦截器
 * 自动为普通请求添加 access token
 * ===============================
 */
request.interceptors.request.use((config) => {
  // refresh token 的请求，绝对不加 Authorization
  if (config.url?.includes('/token/refresh/')) {
    return config
  }

  // 从localStorage(本地存储API）中获取访问令牌（JWT Token)
  const token = getAccessToken()

  // 如果存在Token，将其添加到请求头的Autharization字段
  if (token) {
    config.headers = config.headers ?? {}

    // Bearer Token认证方案，格式Bearer<token>
    config.headers.Authorization = `Bearer ${token}`
  }
  // 返回处理后的配置对象，继续请求发送流程
  return config
})

/**
 * ===============================
 * 响应拦截器
 * 处理 access token 过期并自动刷新
 * ===============================
 */
let isRefreshing = false
let queue: Array<(token: string) => void> = []

request.interceptors.response.use(
  (res) => res,
  async (err) => {
    const status = err.response?.status
    const original = err.config

    if (status === 401 && !original._retry) {
      original._retry = true

      const refresh = getRefreshToken()
      if (!refresh) {
        clearToken()
        return Promise.reject(err)
      }

      // === 当前没有在刷新 ===
      if (!isRefreshing) {
        isRefreshing = true

        try {
          // 使用 refreshClient，而不是 request
          const { data } = await refreshClient.post('/token/refresh/', {
            refresh,
          })

          // 保存新 access token（refresh 不变）
          setToken(data.access, refresh)

          isRefreshing = false

          // 释放队列
          queue.forEach((cb) => cb(data.access))
          queue = []

          // 重试原请求
          original.headers.Authorization = `Bearer ${data.access}`
          return request(original)
        } catch (err) {
          isRefreshing = false
          queue = []
          clearToken()
          return Promise.reject(err)
        }
      }

      // === 正在刷新，进入队列 ===
      return new Promise((resolve) => {
        queue.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`
          resolve(request(original))
        })
      })
    }

    return Promise.reject(err)
  }
)

export default request
