// API 定义
// src/api/frontend/auth.ts
import type { LoginResponse } from '@/types'
import { frontendRequest } from '@/utils/request'

export const frontendAuthApi = {
  login: (data: { email: string; password: string }) =>
    frontendRequest.post<LoginResponse>('/users/auth/login/', data),

  register: (data: {
    email: string
    password: string
    confirm_password: string
    first_name: string
    last_name: string
  }) => frontendRequest.post('/users/auth/register/', data),
}

export const frontendTokenApi = {
  refresh: (refresh: string) =>
    frontendRequest.post<{ access: string }>('/token/refresh/', { refresh }),
}
