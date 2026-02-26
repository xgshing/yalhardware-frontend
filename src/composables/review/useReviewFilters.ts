// 筛选逻辑（ALL/星级 / 媒体,互斥筛选）
// src/composables/review/useReviewFilters.ts
import type { ReviewFilterMode } from '@/types'
import { ref } from 'vue'

export function useReviewFilters() {
  const filter = ref<ReviewFilterMode>('all')

  const setFilter = (mode: ReviewFilterMode) => {
    filter.value = mode
  }

  return {
    filter,
    setFilter,
  }
}
