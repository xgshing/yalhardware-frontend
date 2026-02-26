// HTTP 请求
// src/api/admin/users.ts
import type { User } from '@/types'
import request from '@/utils/request'

export const AdminUserApi = {
  // 获取用户列表
  list: () => request.get<User[]>('/users/admin/'),

  // 获取单个用户
  detail: (id: number) => request.get<User>(`/users/admin/${id}/`),

  // 启用/禁用用户、设置/取消管理员
  update: (
    id: number,
    data: Partial<{ is_active: boolean; is_staff: boolean }>
  ) => request.patch(`/users/admin/${id}/`, data),
}
