// src/api/admin/inventory.ts
import request from '@/utils/request'

/**
 * 库存流水列表
 * 支持按 variant / order 过滤
 */
export function fetchInventoryRecords(params?: {
  variant?: number
  order?: string
}) {
  return request.get('/admin/inventory-records/', { params })
}
