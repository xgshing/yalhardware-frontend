// src/services/admin/category.service.admin.ts
import request from '@/utils/request'

export function fetchCategoryTree() {
  return request.get('/admin/categories/tree/').then((res) => res.data)
}

export function createCategory(data: { name: string; parent?: number | null }) {
  return request.post('/admin/categories/', data)
}
