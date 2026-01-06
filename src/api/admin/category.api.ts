// src/api/admin/category.api.ts
import request from '@/utils/request'

export const adminCategoryApi = {
  /** 分类树 */
  tree: () => request.get('/admin/categories/tree/'),
  /** 新建分类 */
  create: (data: any) => request.post('/admin/categories/', data),
}
