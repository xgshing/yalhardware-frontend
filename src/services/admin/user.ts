// 业务封装 / 字段整理
// src/services/admin/user.ts
import { AdminUserApi } from '@/api'
import type { User } from '@/types'

/* ================= 工具函数 ================= */
function normalizeAdminUser(U: User) {
  return {
    ...U,
    isAdmin: U.is_staff,
    isActive: U.is_active,
  }
}

/**
 *  获取所有用户（后台）
 */
export async function fetchAdminUsers(): Promise<User[]> {
  const res = await AdminUserApi.list()
  return res.data.map(normalizeAdminUser)
}

/**
 * 单个用户详情（后台）
 */
export async function fetchAdminUserDetail(id: number) {
  const res = await AdminUserApi.detail(id)
  return normalizeAdminUser(res.data)
}

/**
 * 启用/禁用用户、设置/取消管理员
 */
export async function toggleUserActive(user: User): Promise<void> {
  await AdminUserApi.update(user.id, { is_active: !user.is_active })
}

/**
 * 设置/取消管理员
 */
export async function toggleUserStaff(user: User): Promise<void> {
  await AdminUserApi.update(user.id, { is_staff: !user.is_staff })
}
