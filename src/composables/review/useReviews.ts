// 评论列表 + 分页
// src/composables/review/useReviews.ts
import { reviewService } from '@/services'
import type { Review, ReviewFilterMode, ReviewListResponse } from '@/types'
import { ref, watch } from 'vue'

interface UseReviewsOptions {
  productId?: number
  order_item_id?: number
  filter: () => ReviewFilterMode
  pageSize?: number
}

export function useReviews(options: UseReviewsOptions) {
  const { productId, order_item_id, filter, pageSize = 10 } = options

  const reviews = ref<Review[]>([])
  const total = ref(0)
  const page = ref(1)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchReviews = async () => {
    loading.value = true
    error.value = null

    try {
      const res: ReviewListResponse = await reviewService.getReviews({
        productId,
        order_item_id,
        filter: filter(),
        page: page.value,
        pageSize,
      })

      reviews.value = res.results
      total.value = res.total
    } catch {
      error.value = 'Failed to load reviews'
    } finally {
      loading.value = false
    }
  }

  // ⚠️ 这是商业级必须要有的
  watch(filter, () => {
    page.value = 1
    fetchReviews()
  })

  return {
    reviews,
    total,
    page,
    loading,
    error,
    fetchReviews,
  }
}
