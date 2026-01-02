// src/services/admin/product.service.admin.ts
import { http } from '@/services/http'

/* ===================== List ===================== */
/** 产品列表（管理后台） */
export function fetchAdminProducts() {
  return http.get('/admin/products/').then((res) => res.data)
}

/** 更新产品（局部字段：推荐 / 上架 / 排序） */
export function patchAdminProduct(
  id: number,
  data: Partial<{
    is_active: boolean
    is_featured: boolean
    featured_order: number
  }>
) {
  return http.request({
    url: `/admin/products/${id}/`,
    method: 'PATCH',
    data: JSON.stringify(data), // ✅ 强制序列化 JSON
    headers: { 'Content-Type': 'application/json' },
  })
}

/** 推荐产品排序（B-1 批量接口） */
export function reorderFeaturedProducts(
  data: Array<{ id: number; featured_order: number }>
) {
  return http.request({
    url: '/admin/products/reorder/',
    method: 'POST',
    data: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' },
  })
}

/* ===================== Form ===================== */
/** 获取产品详情 */
export function fetchAdminProductDetail(id: number) {
  return http.get(`/admin/products/${id}/`).then((res) => res.data)
}

/** 新增产品 */
export function createAdminProduct(data: FormData) {
  return http.post('/admin/products/', data)
}

/** 更新产品（整体表单） */
export function updateAdminProduct(id: number, data: FormData) {
  return http.put(`/admin/products/${id}/`, data)
}

/** 删除某个详情图 */
export function deleteProductImage(productId: number, imageId: number) {
  return http.delete(`/admin/products/${productId}/images/${imageId}/`)
}

/** 删除产品 */
export const deleteAdminProduct = (id: number) => {
  return http.delete(`/admin/products/${id}/`)
}
