// 业务封装/状态初始化
// src/services/frontend/auth.ts
import { frontendAuthApi, frontendUserApi } from '@/api'
import type { LoginResponse, User } from '@/types'
import { clearToken, getAccessToken, setToken } from '@/utils/auth'
/**
 * 用户注册
 */
export async function registerUser(data: {
  email: string
  password: string
  confirm_password: string
  first_name: string
  last_name: string
}) {
  // 调用前端认证API的注册接口register
  const res = await frontendAuthApi.register(data)
  // 直接返回API响应数据
  return res.data
}

/**
 * 用户登录（业务入口）
 * - 保存 token
 * - 返回 user
 */
export async function loginUser(data: {
  email: string
  password: string
}): Promise<User> {
  // 调用登录接口login
  const res = await frontendAuthApi.login(data)
  // 类型断言：将响应数据转换为已知的LoginResponse类型
  const { access, refresh, user } = res.data as LoginResponse
  // 保存认证令牌到本地存储
  setToken(access, refresh)
  // 返回用户令牌供调用者使用
  return user
}

/**
 * 初始化当前用户（应用启动 / 刷新时）
 */
export async function initUser(): Promise<User | null> {
  const token = getAccessToken()
  if (!token) return null

  try {
    const res = await frontendUserApi.me()
    return res.data
  } catch {
    clearToken()
    return null
  }
}

/**
 * 用户退出
 */
export function logoutUser() {
  clearToken()
}
