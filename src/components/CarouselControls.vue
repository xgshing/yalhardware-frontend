<!-- src/components/CarouselControls.vue -->
<template>
  <div v-show="show" ref="rootRef" class="carousel-controls">
    <!-- Progress Bar -->
    <div ref="trackRef" class="progress-track" @click="onTrackClick">
      <div class="progress-thumb" :style="thumbStyle" @mousedown="onThumbMouseDown" />
    </div>

    <!-- Arrow Buttons -->
    <div class="navigation-buttons">
      <button class="nav-button" :disabled="localIndex === 0" @click="emitPrev">
        ←
      </button>
      <button class="nav-button" :disabled="localIndex >= maxIndex" @click="emitNext">
        →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  nextTick,
  onMounted,
  onBeforeUnmount
} from 'vue'
import type { StyleValue } from 'vue'

/* ---------- props / emits ---------- */

const props = defineProps<{
  total: number
  perView: number
  currentIndex: number
}>()

const emit = defineEmits<{
  (e: 'update:index', value: number): void
  (e: 'prev'): void
  (e: 'next'): void
}>()

/* ---------- refs ---------- */

const rootRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

/* ---------- state ---------- */

const trackWidth = ref(0)
const dragging = ref(false)
const startX = ref(0)
const startThumbX = ref(0)

/** ⭐ 内部 index（拖拽时不被父组件打断） */
const localIndex = ref(props.currentIndex)

/* ---------- computed ---------- */

const show = computed(() => props.total > props.perView)
const maxIndex = computed(() => Math.max(0, props.total - props.perView))

const thumbWidth = computed(() => {
  if (!trackWidth.value) return 0
  const pages = maxIndex.value + 1
  return Math.max(24, trackWidth.value / pages)
})

const maxMove = computed(() =>
  Math.max(0, trackWidth.value - thumbWidth.value)
)

const thumbX = computed(() => {
  if (!maxIndex.value || !maxMove.value) return 0
  return (localIndex.value / maxIndex.value) * maxMove.value
})

const thumbStyle = computed<StyleValue>(() => ({
  width: `${thumbWidth.value}px`,
  transform: `translateX(${thumbX.value}px)`
}))

/* ---------- methods ---------- */

const emitPrev = () => emit('prev')
const emitNext = () => emit('next')

const updateTrackWidth = () => {
  nextTick(() => {
    if (trackRef.value) {
      trackWidth.value = trackRef.value.offsetWidth
    }
  })
}

const emitIndex = (index: number) => {
  const clamped = Math.max(0, Math.min(index, maxIndex.value))
  localIndex.value = clamped
  emit('update:index', clamped)
}

/* ---------- events ---------- */

const onTrackClick = (e: MouseEvent) => {
  if (!trackRef.value || dragging.value) return
  const rect = trackRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  emitIndex(Math.round((x / trackWidth.value) * maxIndex.value))
}

const onThumbMouseDown = (e: MouseEvent) => {
  dragging.value = true
  startX.value = e.clientX
  startThumbX.value = thumbX.value

  const onMove = (ev: MouseEvent) => {
    if (!dragging.value) return
    const delta = ev.clientX - startX.value
    const x = Math.max(0, Math.min(startThumbX.value + delta, maxMove.value))
    emitIndex(Math.round((x / maxMove.value) * maxIndex.value))
  }

  const onUp = () => {
    dragging.value = false
    document.removeEventListener('mousemove', onMove)
    document.removeEventListener('mouseup', onUp)
  }

  document.addEventListener('mousemove', onMove)
  document.addEventListener('mouseup', onUp)
}

/* ---------- sync ---------- */

/** 父组件 index → 控制器 */
watch(
  () => props.currentIndex,
  v => {
    if (!dragging.value) {
      localIndex.value = v
    }
  },
  { immediate: true }
)

/** 显示 / 数据变化 → 重新测量 */
watch(
  () => [show.value, props.total, props.perView],
  () => {
    if (show.value) updateTrackWidth()
  },
  { immediate: true }
)

onMounted(updateTrackWidth)
window.addEventListener('resize', updateTrackWidth)

onBeforeUnmount(() => {
  dragging.value = false
  window.removeEventListener('resize', updateTrackWidth)
})
</script>

<style scoped>
.carousel-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.progress-track {
  flex: 1;
  height: 3px;
  /* 用 thumb 的高度 */
  display: flex;
  align-items: center;
  /* ⭐ 垂直居中 */
  background: #e9ecef;
  border-radius: 8px;
  position: relative;
  cursor: pointer;
}

.progress-thumb {
  position: absolute;
  left: 0;
  height: 5px;
  background: #7b5a43;
  border-radius: 8px;
  cursor: grab;
  user-select: none;
}

.navigation-buttons {
  display: flex;
  gap: 15px;
}

.nav-button {
  width: 44px;
  height: 44px;
  border: none;
  background: none;
  color: #7b5a43;
  font-size: 32px;
  cursor: pointer;
}

.nav-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
