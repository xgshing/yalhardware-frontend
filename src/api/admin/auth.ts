// src/api/admin/auth.ts
import type { User } from '@/types'
import { adminRequest } from '@/utils/request'

export const adminAuthApi = {
  me: () => adminRequest.get<User>('/users/me/'),
}
