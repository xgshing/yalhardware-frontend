<!--  评论业务容器（拉数据）-->
<!-- src/components/review/ProductReviews.vue -->
<template>
  <section class="product-reviews">
    <ReviewStats :stats="stats" />

    <ReviewFilters v-model="filter" />

    <ReviewList
      :reviews="reviews"
      :loading="loading"
      @helpful="toggleHelpful"
    />
  </section>
</template>

<script setup lang="ts">
  import ReviewFilters from './blocks/ReviewFilters.vue'
  import ReviewList from './blocks/ReviewList.vue'
  import ReviewStats from './blocks/ReviewStats.vue'

  import {
    useReviewFilters,
    useReviewHelpful,
    useReviewStats,
    useReviews,
  } from '@/composables/review'

  const props = defineProps<{ productId: number }>()

  const { stats, fetchStats } = useReviewStats(props.productId)

  const { filter, setFilter } = useReviewFilters()

  const { reviews, loading, fetchReviews } = useReviews({
    productId: props.productId,
    filter: () => filter.value,
  })

  const { toggleHelpful } = useReviewHelpful()

  // v-model bridge
  const filterModel = {
    get: () => filter.value,
    set: (v: any) => setFilter(v),
  }

  fetchStats()
  fetchReviews()
</script>
