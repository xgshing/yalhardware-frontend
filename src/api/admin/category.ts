// src/api/admin/category.ts
import { adminRequest } from '@/utils/request'

export const adminCategoryApi = {
  /** 分类树 */
  tree: () => adminRequest.get('/admin/categories/tree/'),
  /** 新建分类 */
  create: (data: any) => adminRequest.post('/admin/categories/', data),
}
