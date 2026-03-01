<!--  平均分 + 星级分布 -->
<!-- src/components/review/ReviewStats.vue -->
<template>
  <div v-if="stats">
    <div class="avg">
      <strong>{{ stats.avg_rating.toFixed(1) }}</strong>
      <el-rate
        :model-value="stats.avg_rating"
        disabled
      />
    </div>
    <p>{{ stats.total }} reviews</p>
  </div>
</template>

<script setup lang="ts">
  import type { ReviewStats } from '@/types/api/review'

  defineProps<{
    stats: ReviewStats | null
  }>()
</script>

<style scoped>
  .avg {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
