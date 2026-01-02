// src/utils/request.ts
import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const API_BASE = import.meta.env.VITE_API_BASE_URL

const request = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 10000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('access_token')

    // // Axios 5.x 要保证 headers 是对象
    // config.headers = config.headers ?? {} // 如果 undefined 就初始化为空对象

    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }

    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => response,
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
