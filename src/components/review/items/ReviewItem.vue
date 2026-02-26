<!--  单条评论 -->
<!-- src/components/review/ReviewItem.vue-->
<template>
  <div class="review-item">
    <div class="header">
      <strong>{{ review.user_display_name }}</strong>
      <span>{{ review.rating }} ★</span>
    </div>

    <p class="content">{{ review.content }}</p>

    <ReviewMedia :media="review.media" />

    <div class="actions">
      <button @click="$emit('helpful', review)">
        👍 {{ review.helpful.count }}
      </button>
    </div>

    <ReviewReplyBlock
      v-if="review.reply"
      :reply="review.reply"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Review } from '@/types'
  import ReviewReplyBlock from '../blocks/ReviewReplyBlock.vue'
  import ReviewMedia from './ReviewMedia.vue'

  defineProps<{ review: Review }>()
  defineEmits<{ (e: 'helpful', review: Review): void }>()
</script>
