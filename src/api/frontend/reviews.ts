// 评论 API 封装
// src/api/frontend/reviews.ts
import type { ReviewListResponse } from '@/types'
import { frontendRequest } from '@/utils/request'

export const reviewApi = {
  // 根据商品获取评价列表
  getProductReviews(params: {
    productId: number
    filter?: string | number
    page: number
    pageSize: number
  }) {
    return frontendRequest.get<ReviewListResponse>('/reviews/', {
      params,
    })
  },

  // 获取某个订单项的评价（单条）
  getOrderItemReview(orderItemId: number) {
    return frontendRequest.get('/reviews/', {
      params: { order_item_id: orderItemId },
    })
  },

  // 创建评价
  createReview(payload: {
    order_item_id: number
    rating: number
    content: string
    images?: string[]
  }) {
    return frontendRequest.post('/reviews/', payload)
  },

  // 追加评价
  appendReview(payload: { review_id: number; content: string }) {
    return frontendRequest.post('/reviews/append/', payload)
  },
}
