// src/services/admin/auth.ts
import { adminAuthApi, frontendAuthApi } from '@/api'
import type { LoginPayload, User } from '@/types'
import {
  clearAdminToken,
  getAdminAccessToken,
  setAdminToken,
} from '@/utils/auth'

/**
 * 管理员登录
 * - 返回完整 admin 信息
 */
export async function loginAdmin(data: LoginPayload): Promise<User> {
  const res = await frontendAuthApi.login({
    ...data,
    admin: true, // 👈 明确声明后台登录
  })
  const { access, refresh, user } = res.data
  setAdminToken(access, refresh)
  return user
}

/**
 * 初始化管理员登录态
 * - 页面刷新或首次访问时调用
 * - 如果 token 无效或请求失败，则清理 token
 */
export async function initAdmin(): Promise<User | null> {
  const token = getAdminAccessToken()
  if (!token) return null

  try {
    const res = await adminAuthApi.me()
    return res.data
  } catch (e) {
    clearAdminToken()
    return null
  }
}
