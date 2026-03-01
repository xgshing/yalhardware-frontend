// src/api/admin/comments.ts
import { adminRequest } from '@/utils/request'

export function fetchAdminComments(params?: {
  product?: number
  user?: number
}) {
  return adminRequest.get('/admin/comments/', { params })
}

export function deleteAdminComment(id: number) {
  return adminRequest.delete(`/admin/comments/${id}/`)
}
