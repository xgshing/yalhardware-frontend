<!--  图片 / 视频展示 -->
<!-- src/components/review/ReviewMedia.vue-->
<template>
  <div class="media">
    <template
      v-for="m in media"
      :key="m.id"
    >
      <img
        v-if="m.type === 'image'"
        :src="m.url"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import type { ReviewMedia } from '@/types'
  defineProps<{ media: ReviewMedia[] }>()
</script>
