<!-- 订单状态时间轴 -->
<!-- src/components/orders/OrderStatusTimeline.vue -->
<template>
  <div
    class="order-timeline"
    :class="{ compact }"
  >
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      class="timeline-step"
    >
      <!-- 指示器 -->
      <div class="indicator">
        <!-- 圆点 -->
        <div
          :class="{
            dot: true,
            completed: step.completed && !step.current,
            current: step.current,
          }"
        >
          <span v-if="step.completed && !step.current">✓</span>
        </div>

        <!-- 竖线 -->
        <div
          v-if="index < steps.length - 1"
          :class="{ line: true, completed: steps[index + 1]?.completed }"
        />
      </div>

      <!-- 标签和时间 -->
      <div class="label">
        <div class="title">{{ step.label }}</div>
        <div
          v-if="!compact && step.time"
          class="time"
        >
          {{ step.time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ORDER_FLOW } from '@/constants/orderStatus'
  import { computed } from 'vue'

  const props = defineProps<{
    order: Record<string, any>
    compact?: boolean
  }>()

  // 时间格式化
  function formatTime(time?: string) {
    return time ? new Date(time).toLocaleString() : ''
  }

  // 完整时间轴逻辑，使用多条发货记录最新时间
  const steps = computed(() => {
    const shippedTime =
      props.order.fulfillments?.[props.order.fulfillments.length - 1]
        ?.shipped_at

    const currentIndex = ORDER_FLOW.findIndex(
      (s) => s.key === props.order.status
    )

    return ORDER_FLOW.map((step, index) => {
      let stepTime
      if (step.key === 'PAID') stepTime = props.order.paid_at
      else if (step.key === 'SHIPPED') stepTime = shippedTime
      else if (step.key === 'COMPLETED') stepTime = props.order.completed_at
      else if (step.key === 'PENDING') stepTime = props.order.created_at

      return {
        ...step,
        completed: !!stepTime || index < currentIndex,
        current: step.key === props.order.status,
        time: stepTime ? formatTime(stepTime) : '',
      }
    })
  })
</script>

<style scoped>
  /* 父容器 */
  .order-timeline {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    border-left: 2px solid #e0e0e0; /* Stripe / Shopify 风格灰线 */
  }

  /* 每一步 */
  .timeline-step {
    display: flex;
    align-items: flex-start;
    position: relative;
    margin-bottom: 24px;
  }

  /* 指示器区域 */
  .indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 12px;
    position: relative;
  }

  /* 圆点样式 */
  .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ccc; /* 默认灰色 */
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #fff;
    z-index: 1;
    transition:
      background-color 0.3s,
      border 0.3s;
  }

  .dot.completed {
    background-color: #4caf50; /* 已完成绿色 */
  }

  .dot.current {
    border: 2px solid #1976d2; /* 当前蓝色高亮 */
    background-color: #fff;
    color: #1976d2;
  }

  /* 竖线 */
  .line {
    width: 2px;
    flex-grow: 1;
    background-color: #e0e0e0; /* 灰色 */
    margin-top: 0;
    transition: background-color 0.3s;
  }

  .line.completed {
    background-color: #4caf50; /* 已完成绿色 */
  }

  /* 标签区域 */
  .label {
    display: flex;
    flex-direction: column;
    margin-top: -2px;
  }

  .label .title {
    font-weight: 500;
    color: #333;
    font-size: 14px;
  }

  .label .time {
    font-size: 12px;
    color: #757575;
    margin-top: 4px;
  }

  /* compact 模式 */
  .order-timeline.compact .timeline-step {
    margin-bottom: 12px;
  }

  .order-timeline.compact .label .time {
    display: none;
  }
</style>
