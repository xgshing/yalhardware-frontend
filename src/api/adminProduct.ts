// src/api/adminProduct.ts
import request from '@/utils/request'
import type { Product } from '@/types/product'

interface UpdateProductPayload {
  is_featured?: boolean
  featured_order?: number
}

interface BatchUpdateProductItem {
  id: number
  is_featured?: boolean
  featured_order?: number
}

/**
 * 单个产品更新
 * payload 可以是 JSON 或 FormData
 */
export const updateProduct = async (
  id: number,
  payload: UpdateProductPayload | FormData
): Promise<Product> => {
  if (payload instanceof FormData) {
    // FormData 提交
    const res = await request.put(`/admin/products/${id}/`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } else {
    // JSON 提交
    const res = await request.put(`/admin/products/${id}/`, payload)
    return res.data
  }
}

/**
 * 批量更新推荐顺序和状态
 * payload 可以是 FormData 或数组对象
 */
export const updateProductsOrder = async (
  payload: FormData | BatchUpdateProductItem[]
): Promise<Product[]> => {
  if (payload instanceof FormData) {
    // FormData 提交
    const res = await request.put(`/admin/products/batch_update/`, payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data
  } else {
    // JSON 提交
    const res = await request.put(`/admin/products/batch_update/`, payload)
    return res.data
  }
}

/**
 * 获取推荐产品列表
 */
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const res = await request.get(
    `/admin/products/?is_featured=true&ordering=featured_order`
  )
  return res.data
}

/**
 * 创建新产品
 */
export const createProduct = async (payload: FormData): Promise<Product> => {
  const res = await request.post(`/admin/products/`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const adminProductApi = {
  updateProduct,
  updateProductsOrder,
  fetchFeaturedProducts,
  createProduct,
}
