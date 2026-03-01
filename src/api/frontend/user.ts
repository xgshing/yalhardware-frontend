// API 定义
// src/api/frontend/user.ts
import type { User } from '@/types'
import { frontendRequest } from '@/utils/request'

export const frontendUserApi = {
  me: () => frontendRequest.get<User>('/users/me/'),
}
