// src/services/admin/comment.ts
import { deleteAdminComment, fetchAdminComments } from '@/api'

export async function getAdminComments(params?: any) {
  const { data } = await fetchAdminComments(params)
  return data
}

export async function removeComment(id: number) {
  return deleteAdminComment(id)
}
