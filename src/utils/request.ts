// 管理接口的基础配置
// src/utils/request.ts
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  // 接口基础地址
  // 使用 Vite 环境变量，支持不同环境（开发 / 测试 / 生产）
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  timeout: 10000,
})

// 请求拦截器，自动携带 token,统一设置请求头
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器,统一处理接口返回结构,针对 401 等状态码做登录失效处理,网络异常时给用户统一提示
request.interceptors.response.use(
  // 成功响应直接返回
  (response: AxiosResponse) => response,
  // 统一处理错误响应
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      ElMessage.error('登录已过期，请重新登录')
    } else if (status === 403) {
      ElMessage.error('没有权限')
    } else if (status && status >= 500) {
      ElMessage.error('服务器错误')
    }
    return Promise.reject(error)
  }
)

export default request
