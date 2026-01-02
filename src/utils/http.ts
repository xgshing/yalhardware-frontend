import axios from 'axios'

const http = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 10000,
})

// 请求拦截器：自动带 token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default http
