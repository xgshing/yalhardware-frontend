// src/types/frontend/order.ts
import type { Review } from './review'

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface OrderItem {
  id: number
  product_id: number
  product_title: string
  sku_title: string
  price: number
  quantity: number

  review: Review | null
  can_review: boolean
  product_image?: string
}

export interface OrderDetail {
  id: number
  order_no: string
  status: OrderStatus
  total_amount: number
  created_at: string
  items: OrderItem[]

  can_cancel: boolean
  can_pay: boolean
  can_confirm: boolean
}

export interface OrderCardDTO {
  id: number
  order_no: string
  status: OrderStatus
  status_label: string
  created_at: string
  total_amount: number
  currency: string
  items: OrderItem[]
  available_actions: string[]
}
