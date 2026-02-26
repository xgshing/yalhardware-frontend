// 评论 API 封装
// src/api/frontend/reviews.ts
import type { ReviewListResponse, ReviewPermission, ReviewStats } from '@/types'
import request from '@/utils/request'

export const reviewApi = {
  // 根据商品获取评价列表
  getProductReviews(params: {
    productId: number
    filter?: string | number
    page: number
    pageSize: number
  }) {
    return request.get<ReviewListResponse>('/reviews/', {
      params,
    })
  },

  // 获取商品评价统计
  getReviewStats(productId: number) {
    return request.get<ReviewStats>(`/reviews/stats/`, {
      params: { product_id: productId }, // 注意后端 query param 名称
    })
  },

  // 点赞评价
  toggleHelpful(reviewId: number) {
    return request.post(`/reviews/${reviewId}/helpful/`)
  },

  // 获取某个订单项的评价（单条）
  getOrderItemReview(orderItemId: number) {
    return request.get('/reviews/', {
      params: { order_item_id: orderItemId },
    })
  },

  // 获取某个订单项是否可以评价
  getReviewPermission(orderItemId: number) {
    return request.get<ReviewPermission>(
      `/reviews/order-item/${orderItemId}/permission/`
    )
  },

  // 创建评价
  createReview(payload: {
    order_item_id: number
    rating: number
    content: string
    media_ids?: number[]
  }) {
    return request.post('/reviews/', payload)
  },

  // 追加评价
  appendReview(payload: { review_id: number; content: string }) {
    return request.post('/reviews/append/', payload)
  },
}
