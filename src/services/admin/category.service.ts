// services/admin/category.service.ts
import { adminCategoryApi } from '@/api'
import type { ProductCategory } from '@/types/frontend/product'

/** 获取分类树（管理后台） */
export const fetchCategoryTree = async (): Promise<ProductCategory[]> => {
  const res = await adminCategoryApi.tree()
  return res.data
}

/** 新建分类 */
export const createCategory = async (data: {
  name: string
  parent?: number | null
}): Promise<ProductCategory> => {
  const res = await adminCategoryApi.create(data)
  return res.data
}
