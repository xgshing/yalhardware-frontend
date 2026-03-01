// src/types/api/review.ts

export interface ReviewReply {
  merchant_reply: string
  merchant_replied_at: string | null
}

export interface Review {
  id: number
  rating: number
  content: string
  images: string[]
  created_at: string

  append_content: string
  append_at: string | null

  reply: ReviewReply | null
  can_append: boolean
}

export interface ReviewListResponse {
  results: Review[]
  total: number
}
