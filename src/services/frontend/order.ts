// src/services/frontend/order.ts
import { orderApi } from '@/api'

// 把金额转换为数字
const normalizeOrderAmount = (order: any) => ({
  ...order,
  total_amount: Number(order.total_amount),
})

export const orderService = {
  fetchMyOrders: async () => {
    const res = await orderApi.list()
    return res.data.map(normalizeOrderAmount)
  },
  // 订单详情
  fetchDetail: async (id: string) => {
    const res = await orderApi.detail(id)
    return normalizeOrderAmount(res.data)
  },
  cancelOrder: async (id: number) => {
    await orderApi.cancel(id)
  },
  payOrder: async (id: number) => {
    await orderApi.pay(id)
  },
  confirmOrder: async (id: number) => {
    await orderApi.confirm(id)
  },
  // 提交订单
  submit: async (payload: any) => {
    const res = await orderApi.submit(payload)
    return normalizeOrderAmount(res.data)
  },
}
