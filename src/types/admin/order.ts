// src/types/admin/order.ts
export interface AdminOrder {
  id: number
  order_no: string
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  total_amount: number
  created_at: string
  paid_at?: string

  user: {
    id: number
    username: string
    email: string
  }

  items: Array<{
    id: number
    product_title: string
    sku_title: string
    quantity: number
    price: number
  }>

  shipping?: {
    company: string
    tracking_no: string
    shipped_at: string
  }
}

export interface AdminOrderListResponse {
  count: number
  results: AdminOrder[]
}
