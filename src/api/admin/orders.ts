// src/api/admin/orders.ts
import { adminRequest } from '@/utils/request'

// 订单列表
export function fetchAdminOrders(params?: {
  page?: number
  page_size?: number
  status?: string
}) {
  return adminRequest.get('/admin/orders/', { params })
}

// 订单详情
export function fetchAdminOrderDetail(id: number | string) {
  return adminRequest.get(`/admin/orders/${id}/`)
}

// 发货
export function adminShipOrder(
  id: number,
  payload: {
    carrier: string
    tracking_no: string
    items: Array<{
      order_item_id: number
      quantity: number
    }>
  }
) {
  return adminRequest.post(`/admin/orders/${id}/ship/`, payload)
}
