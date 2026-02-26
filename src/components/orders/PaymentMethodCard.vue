<!-- 支付方式模块 -->
<!-- src/components/orders/PaymentMethodCard.vue -->
<template>
  <section class="card payment-card">
    <h3 class="card-title">支付方式</h3>

    <div class="row">
      <span class="label">支付方式</span>
      <span class="value">
        {{ paymentLabel }}
      </span>
    </div>

    <div class="row">
      <span class="label">支付状态</span>
      <span
        class="value"
        :class="statusClass"
      >
        {{ statusText }}
      </span>
    </div>

    <div
      v-if="order.paid_at"
      class="row"
    >
      <span class="label">支付时间</span>
      <span class="value">{{ formatTime(order.paid_at) }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{
    order: any
  }>()

  const paymentLabel = computed(() => {
    return props.order.payment_method_label || props.order.payment_method || '—'
  })

  const statusText = computed(() => {
    if (props.order.status === 'paid') return '已支付'
    if (props.order.status === 'pending') return '待支付'
    return '—'
  })

  const statusClass = computed(() => {
    return props.order.status === 'paid' ? 'paid' : 'pending'
  })

  function formatTime(time: string) {
    return new Date(time).toLocaleString()
  }
</script>

<style scoped>
  .payment-card {
    padding: 16px;
    font-size: 13px;
  }

  .card-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .label {
    color: #888;
  }

  .value {
    color: #111;
  }

  .paid {
    color: #52c41a;
    font-weight: 500;
  }

  .pending {
    color: #faad14;
  }
</style>
