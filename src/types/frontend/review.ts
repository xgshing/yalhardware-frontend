// src/types/frontend/review.ts

export type ReviewState =
  | 'UNREVIEWED'
  | 'REVIEWED'
  | 'APPENDABLE'
  | 'APPENDED'
  | 'MERCHANT_REPLIED'
  | 'CLOSED'

export type ReviewFilterMode = 'all' | 'with_media' | 1 | 2 | 3 | 4 | 5

export interface ReviewMedia {
  id: number
  url: string
  type: 'image' | 'video'
}

export interface ReviewHelpful {
  count: number
  liked_by_me: boolean
}

export interface ReviewReply {
  id: number
  content: string
  created_at: string
}

export interface Review {
  id: number
  product_id: number
  order_item_id: number
  user_display_name: string
  rating: number
  content: string
  media: ReviewMedia[]
  helpful: ReviewHelpful
  reply?: ReviewReply
  state: ReviewState
  created_at: string
}

export interface ReviewStats {
  total: number
  average: number
  counts: Record<1 | 2 | 3 | 4 | 5, number>
  with_media: number
}

export interface ReviewListResponse {
  results: Review[]
  total: number
}

export interface ReviewPermission {
  can_review: boolean
  can_append: boolean
  reason?: string
}

export interface ReviewHelpfulResponse {
  count: number
  liked_by_me: boolean
}
