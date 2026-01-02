// src/services/http.ts
/**
 * HTTP 请求封装文件，负责创建一个统一的 Axios 实例
 * 统一配置 baseURL、timeout 等参数
 * 便于全局调用 http.get / post / put / delete
 * 可以后续加拦截器（请求/响应拦截、错误处理、token 注入等）
 */
// 导入Axios，是一个基于 Promise 的 HTTP 客户端，可以在浏览器和 Node.js 环境使用
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL

export const http = axios.create({
  baseURL: `${API_BASE}/api`, // 动态切换开发/生产 URL
  timeout: 10000,
})
