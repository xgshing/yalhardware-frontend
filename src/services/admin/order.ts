// src/services/admin/order.ts
import {
  adminShipOrder,
  fetchAdminOrderDetail,
  fetchAdminOrders,
} from '@/api/admin/orders'

// 后台订单列表
export async function getAdminOrders(params?: {
  page?: number
  page_size?: number
}) {
  const { data } = await fetchAdminOrders(params)
  // 返回整个分页对象
  return data
}

// 后台订单详情
export async function getAdminOrderDetail(id: number | string) {
  const { data } = await fetchAdminOrderDetail(id)
  return data
}

// 后台发货
export async function shipAdminOrder(
  id: number,
  payload: {
    carrier: string
    tracking_no: string
    items: Array<{ order_item_id: number; quantity: number }>
  }
) {
  await adminShipOrder(id, payload)
}
