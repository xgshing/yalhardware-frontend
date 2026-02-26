// src/types/frontend/order.ts
// 订单与评论类型定义

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface ReviewFile {
  file: File
  preview: string
}

export interface OrderItem {
  id: number
  product_id: number
  product_title: string
  sku_title: string
  price: number
  quantity: number
  review: any
  can_review: boolean
  product_image?: string
  // 当前用户在页面上的评价表单
  reviewForm: {
    rating: number
    content: string
    images: ReviewFile[]
  }
  // 鼠标 hover 时高亮星星数
  hoverRating: number
  submitting?: boolean
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
