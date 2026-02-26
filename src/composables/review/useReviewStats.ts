// 评分统计逻辑（给 ReviewStats 跨页面用）
// src/composables/review/useReviewStats.ts
import { reviewService } from '@/services'
import type { ReviewStats } from '@/types'
import { ref } from 'vue'

export function useReviewStats(productId: number) {
  const stats = ref<ReviewStats | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchStats = async () => {
    loading.value = true
    error.value = null
    try {
      stats.value = await reviewService.getReviewStats(productId)
    } catch {
      error.value = 'Failed to load review statistics'
    } finally {
      loading.value = false
    }
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
  }
}
