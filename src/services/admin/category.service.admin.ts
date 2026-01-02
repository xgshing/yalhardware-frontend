// src/services/admin/category.service.ts
import { http } from '@/services/http'

export function fetchCategoryTree() {
  return http.get('/admin/categories/tree/').then((res) => res.data)
}

export function createCategory(data: { name: string; parent?: number | null }) {
  return http.post('/admin/categories/', data)
}
