// src/constants/orderStatus.ts
export const ORDER_FLOW = [
  { key: 'PENDING', label: '待支付', timeKey: 'created_at' },
  { key: 'PAID', label: '已支付', timeKey: 'paid_at' },
  { key: 'SHIPPED', label: '已发货', timeKey: 'shipped_at' },
  { key: 'COMPLETED', label: '已完成', timeKey: 'completed_at' },
]
