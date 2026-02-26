// src/services/frontend/reviews.ts
import { reviewApi } from '@/api/frontend/reviews'
import type {
  Review,
  ReviewHelpfulResponse,
  ReviewListResponse,
  ReviewPermission,
  ReviewStats,
} from '@/types'

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
      return {
        results: res.data ? [res.data as Review] : [],
        total: res.data ? 1 : 0,
      }
    }

    return { results: [], total: 0 }
  },

  async getReviewStats(productId: number): Promise<ReviewStats> {
    const res = await reviewApi.getReviewStats(productId)
    return res.data
  },

  async toggleHelpful(reviewId: number): Promise<ReviewHelpfulResponse> {
    const res = await reviewApi.toggleHelpful(reviewId)
    return res.data
  },

  async getPermission(orderItemId: number): Promise<ReviewPermission> {
    const res = await reviewApi.getReviewPermission(orderItemId)
    return res.data
  },

  createReview(payload: {
    order_item_id: number
    rating: number
    content: string
    media_ids?: number[]
  }) {
    return reviewApi.createReview(payload)
  },

  appendReview(payload: { review_id: number; content: string }) {
    return reviewApi.appendReview(payload)
  },
}
