/**
 * 认证相关类型定义
 */
// src/types/frontend/user.ts
// 用户基本信息接口
export interface User {
  id: number
  email: string
  first_name: string
  last_name: string

  // ===== 权限相关 =====
  is_active?: boolean
  is_staff?: boolean
  is_superuser?: boolean

  // ===== 可选扩展 =====
  username: string
  date_joined?: string
  last_login?: string

  isAdmin?: boolean
  isActive?: boolean
}

// 登录请求参数
export interface LoginCredentials {
  username: string
  password: string
}

// 刷新 token 请求参数
export interface RefreshTokenRequest {
  refresh: string
}

// 刷新 token 响应数据
export interface RefreshTokenResponse {
  access: string
}

// 认证状态接口
export interface AuthState {
  token: string | null
  refresh: string | null
  user: User | null
  isLoading: boolean
  error: string | null
}

// 验证 token 请求参数
export interface TokenVerifyRequest {
  token: string
}
