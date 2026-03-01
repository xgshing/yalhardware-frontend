// 业务封装/状态初始化
// src/services/frontend/auth.ts
import { frontendAuthApi, frontendUserApi } from '@/api'
import type { LoginPayload, User } from '@/types'
import { clearUserToken, getUserAccessToken, setUserToken } from '@/utils/auth'

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
export async function loginUser(data: LoginPayload): Promise<User> {
  const res = await frontendAuthApi.login({
    ...data,
    admin: false, // 明确声明前台登录
  })
  const { access, refresh, user } = res.data

  setUserToken(access, refresh)
  return user
}

/**
 * 初始化当前用户（应用启动 / 刷新时）
 */
export async function initUser(): Promise<User | null> {
  const token = getUserAccessToken()
  if (!token) return null

  try {
    const res = await frontendUserApi.me()
    return res.data
  } catch {
    clearUserToken()
    return null
  }
}
