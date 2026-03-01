<!--  评论业务容器（拉数据）-->
<!-- src/components/review/ProductReviews.vue -->
<template>
  <section class="product-reviews">
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

  import {
    useReviewFilters,
    useReviewHelpful,
    useReviews,
  } from '@/composables/review'

  const props = defineProps<{ productId: number }>()

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

  fetchReviews()
</script>
