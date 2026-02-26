// src/api/admin/comments.ts
import request from '@/utils/request'

export function fetchAdminComments(params?: {
  product?: number
  user?: number
}) {
  return request.get('/admin/comments/', { params })
}

export function deleteAdminComment(id: number) {
  return request.delete(`/admin/comments/${id}/`)
}
