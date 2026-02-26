// 点赞系统
// src/composables/review/useReviewHelpful.ts
import { reviewService } from '@/services'
import type { Review, ReviewHelpfulResponse } from '@/types'

export function useReviewHelpful() {
  const toggleHelpful = async (review: Review) => {
    const res: ReviewHelpfulResponse = await reviewService.toggleHelpful(
      review.id
    )

    review.helpful.count = res.count
    review.helpful.liked_by_me = res.liked_by_me
  }

  return {
    toggleHelpful,
  }
}
