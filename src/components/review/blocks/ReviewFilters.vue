<!--  筛选（星级 / 有媒体） -->
<!-- src/components/review/ReviewFilters.vue -->
<template>
  <div class="review-filters">
    <button
      v-for="mode in modes"
      :key="mode"
      :class="{ active: modelValue === mode }"
      @click="onSelect(mode)"
    >
      {{ labelMap[mode] }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { ReviewFilterMode } from '@/types'

  const props = defineProps<{
    modelValue: ReviewFilterMode
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: ReviewFilterMode): void
  }>()

  const modes: ReviewFilterMode[] = ['all', 'with_media', 5, 4, 3, 2, 1]

  const labelMap: Record<ReviewFilterMode, string> = {
    all: 'ALL',
    with_media: 'WITH_MEDIA',
    5: '5星',
    4: '4星',
    3: '3星',
    2: '2星',
    1: '1星',
  }

  function onSelect(mode: ReviewFilterMode) {
    if (mode !== props.modelValue) {
      emit('update:modelValue', mode)
    }
  }
</script>

<style scoped>
  .review-filters {
    display: flex;
    gap: 12px;
    margin: 16px 0;
  }

  button {
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }

  button.active {
    font-weight: bold;
    border-bottom: 2px solid #000;
  }
</style>
