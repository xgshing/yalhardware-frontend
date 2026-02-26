<!--  评论列表 -->
<!-- src/components/review/ReviewList.vue -->
<template>
  <div>
    <ReviewItem
      v-for="r in reviews"
      :key="r.id"
      :review="r"
      @helpful="$emit('helpful', $event)"
    />
    <p v-if="!loading && reviews.length === 0">We found 0 matching reviews</p>
  </div>
</template>

<script setup lang="ts">
  import type { Review } from '@/types'
  import ReviewItem from '../items/ReviewItem.vue'

  defineProps<{
    reviews: Review[]
    loading: boolean
  }>()

  defineEmits<{ (e: 'helpful', review: Review): void }>()
</script>
