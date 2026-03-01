// src/types/auth.ts

import type { User } from './index'

// 登录响应数据
export interface LoginResponse {
  access: string
  refresh: string
  user: User
}

export interface LoginPayload {
  email: string
  password: string
  admin?: boolean
}
