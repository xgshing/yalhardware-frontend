<!--  商家回复 -->
<!-- src/components/review/ReviewReplyBlock.vue -->
<template>
  <div class="merchant-reply">
    <strong>商家回复：</strong>
    <p>{{ reply.content }}</p>
  </div>
</template>

<script setup lang="ts">
  import type { ReviewReply } from '@/types'
  defineProps<{ reply: ReviewReply }>()
</script>
