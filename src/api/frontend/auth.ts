// API 定义
// src/api/frontend/auth.ts
import request from '@/utils/request'

export const frontendAuthApi = {
  register: (data: {
    email: string
    password: string
    confirm_password: string
    first_name: string
    last_name: string
  }) => request.post('/users/auth/register/', data),

  login: (data: { email: string; password: string }) =>
    request.post('/users/auth/login/', data),
}

export function refreshToken(refresh: string) {
  return request.post('/token/refresh/', { refresh }) // SimpleJWT 默认地址
}
