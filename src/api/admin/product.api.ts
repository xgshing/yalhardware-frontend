// src/api/admin/product.api.ts
import request from '@/utils/request'
import type { Product } from '@/types/frontend/product'
import type { AxiosResponse } from 'axios'

export const adminProductApi = {
  /* ===================== 查询 ===================== */

  list(params?: Record<string, any>): Promise<AxiosResponse<Product[]>> {
    return request.get('/admin/products/', { params })
  },

  detail(id: number): Promise<AxiosResponse<Product>> {
    return request.get(`/admin/products/${id}/`)
  },

  /* ===================== 表单 ===================== */

  create(data: FormData) {
    return request.post('/admin/products/', data)
  },

  /**
   * 完整更新（PUT）
   * 对应你后端 update()
   */
  update(id: number, data: FormData) {
    return request.put(`/admin/products/${id}/`, data)
  },

  /* ===================== 业务 PATCH ===================== */

  /**
   * 轻量字段更新
   * is_active / is_featured / featured_order
   */
  patch(
    id: number,
    data: Partial<{
      is_active: boolean
      is_featured: boolean
      featured_order: number
    }>
  ) {
    return request.patch(`/admin/products/${id}/`, data)
  },

  /**
   * 推荐商品排序
   * @action reorder
   */
  reorder(data: Array<{ id: number; featured_order: number }>) {
    return request.post('/admin/products/reorder/', data)
  },

  /* ===================== 删除 ===================== */

  delete(id: number) {
    return request.delete(`/admin/products/${id}/`)
  },
}
