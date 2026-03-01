// src/types/ui
import type { OrderItem } from '@/types/api/order'

export interface ReviewFile {
  file: File
  preview: string
}

export interface OrderItemUI extends OrderItem {
  reviewForm: {
    rating: number
    content: string
    images: ReviewFile[]
  }

  appendForm: {
    content: string
  }

  hoverRating: number
  submitting: boolean
}
