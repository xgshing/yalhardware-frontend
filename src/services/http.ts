// src/services/http.ts
/**
 * HTTP 请求封装文件，负责创建一个统一的 Axios 实例
 * 统一配置 baseURL、timeout 等参数
 * 便于全局调用 http.get / post / put / delete
 * 可以后续加拦截器（请求/响应拦截、错误处理、token 注入等）
 */
// 导入Axios，是一个基于 Promise 的 HTTP 客户端，可以在浏览器和 Node.js 环境使用
import axios from 'axios'

// 创建Axios实例,使用 axios.create() 可以生成一个独立实例.可针对不同 API 创建不同实例（例如内部 API / 外部 API）
export const http = axios.create({
  // baseURL 会自动拼接请求路径.例如：http.get('/products/'),实际请求 URL 会是：http://localhost:8000/api/products/
  baseURL: 'http://localhost:8000/api',
  //设置请求超时时间.如果请求超时：Axios 会抛出错误
  timeout: 10000,
})
