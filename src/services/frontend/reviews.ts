// src/services/frontend/reviews.ts
import { reviewApi } from '@/api/frontend/reviews'
import type { Review, ReviewListResponse } from '@/types'

export const reviewService = {
  async getReviews(params: {
    productId?: number
    order_item_id?: number
    filter?: string | number
    page: number
    pageSize: number
  }): Promise<ReviewListResponse> {
    if (params.productId) {
      const res = await reviewApi.getProductReviews({
        productId: params.productId,
        filter: params.filter,
        page: params.page,
        pageSize: params.pageSize,
      })
      return res.data
    }

    if (params.order_item_id) {
      const res = await reviewApi.getOrderItemReview(params.order_item_id)

      // 后端返回可能是对象或空，需要统一为数组
      return {
        results: res.data ? [res.data as Review] : [],
        total: res.data ? 1 : 0,
      }
    }

    return { results: [], total: 0 }
  },

  createReview(payload: {
    order_item_id: number
    rating: number
    content: string
    images?: string[]
  }) {
    return reviewApi.createReview(payload)
  },

  appendReview(payload: { review_id: number; content: string }) {
    return reviewApi.appendReview(payload)
  },
}
