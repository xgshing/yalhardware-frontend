// API 定义
// src/api/frontend/user.ts
import type { User } from '@/types'
import request from '@/utils/request'

export const frontendUserApi = {
  me: () => request.get<User>('/users/me/'),
}
