// HTTP 请求
// src/api/admin/users.ts
import type { User } from '@/types'
import { adminRequest } from '@/utils/request'

export const AdminUserApi = {
  list: () => adminRequest.get<User[]>('/users/admin/'),
  detail: (id: number) => adminRequest.get<User>(`/users/admin/${id}/`),
  update: (
    id: number,
    data: Partial<{ is_active: boolean; is_staff: boolean }>
  ) => adminRequest.patch(`/users/admin/${id}/`, data),
}
