// src/services/admin/product.service.ts

import { adminProductApi } from '@/api'
import type { Product } from '@/types/frontend/product'

/* ===================== 查询类 ===================== */

/**
 * 后台商品列表
 */
export async function fetchAdminProducts(
  params?: Record<string, any>
): Promise<Product[]> {
  const res = await adminProductApi.list(params)
  return res.data
}

/**
 * 后台商品详情
 */
export async function fetchAdminProductDetail(id: number): Promise<Product> {
  const res = await adminProductApi.detail(id)
  return res.data
}

/* ===================== 表单类 ===================== */

/**
 * 新建商品（FormData）
 */
export function createAdminProduct(data: FormData) {
  return adminProductApi.create(data)
}

/**
 * 更新商品（完整表单）
 * - 对应你后端 update() 重逻辑
 */
export function updateAdminProduct(id: number, data: FormData) {
  return adminProductApi.update(id, data)
}

/* ===================== 业务 Patch 类 ===================== */

/**
 * 更新商品状态（上架 / 推荐 / 排序）
 * ⚠️ 轻量接口，强烈建议保留
 */
export function patchAdminProduct(
  id: number,
  data: Partial<{
    is_active: boolean
    is_featured: boolean
    featured_order: number
  }>
) {
  return adminProductApi.patch(id, data)
}

/**
 * 推荐商品排序（批量）
 * 对应后端 @action reorder
 */
export function reorderFeaturedProducts(
  data: Array<{ id: number; featured_order: number }>
) {
  return adminProductApi.reorder(data)
}

/* ===================== 删除 ===================== */

/**
 * 删除商品
 */
export function deleteAdminProduct(id: number) {
  return adminProductApi.delete(id)
}
