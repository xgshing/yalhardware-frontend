// src/services/admin/auth.ts
import { adminAuthApi, frontendAuthApi } from '@/api'
import type { User } from '@/types'
import {
  clearAdminToken,
  getAdminAccessToken,
  setAdminToken,
} from '@/utils/auth'

/**
 * 管理员登录
 * - 返回完整 admin 信息
 */
export async function loginAdmin(data: {
  email: string
  password: string
}): Promise<User> {
  const res = await frontendAuthApi.login(data)
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
    console.log('initAdmin error:', e)
    clearAdminToken()
    return null
  }
}
