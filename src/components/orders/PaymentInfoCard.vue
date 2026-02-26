<!-- 退款 / 取消后的金额 & 状态分支 -->
<!-- src/components/orders/PaymentInfoCard.vue -->
<template>
  <section class="payment-card">
    <h3 class="title">支付信息</h3>

    <!-- 金额区 -->
    <div class="row">
      <span class="label">订单金额</span>
      <span class="value">￥{{ format(order.total_amount) }}</span>
    </div>

    <div
      v-if="order.paid_amount != null"
      class="row"
    >
      <span class="label">实付金额</span>
      <span class="value strong">￥{{ format(order.paid_amount) }}</span>
    </div>

    <div
      v-if="order.refunded_amount"
      class="row refund"
    >
      <span class="label">已退款</span>
      <span class="value">-￥{{ format(order.refunded_amount) }}</span>
    </div>

    <div class="divider" />

    <!-- 支付方式 -->
    <div
      v-if="order.payment_method"
      class="row"
    >
      <span class="label">支付方式</span>
      <span class="value">{{ paymentMethodText }}</span>
    </div>

    <!-- 支付状态 -->
    <div class="row">
      <span class="label">支付状态</span>
      <span
        class="status"
        :class="paymentStatusClass"
      >
        {{ paymentStatusText }}
      </span>
    </div>

    <!-- 退款状态 -->
    <div
      v-if="order.refund_status && order.refund_status !== 'none'"
      class="row"
    >
      <span class="label">退款状态</span>
      <span class="status refund-status">
        {{ refundStatusText }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
  const props = defineProps<{ order: any }>()

  const format = (n: number) => Number(n).toFixed(2)

  const paymentMethodTextMap: Record<string, string> = {
    alipay: '支付宝',
    wechat: '微信支付',
    card: '银行卡',
  }

  const paymentMethodText =
    paymentMethodTextMap[props.order.payment_method] || '—'

  const paymentStatusTextMap: Record<string, string> = {
    unpaid: '未支付',
    paid: '已支付',
    refunded: '已退款',
    partially_refunded: '部分退款',
  }

  const paymentStatusClassMap: Record<string, string> = {
    unpaid: 'gray',
    paid: 'green',
    refunded: 'red',
    partially_refunded: 'orange',
  }

  const paymentStatusText =
    paymentStatusTextMap[props.order.payment_status] ||
    props.order.payment_status

  const paymentStatusClass =
    paymentStatusClassMap[props.order.payment_status] || 'gray'

  const refundStatusTextMap: Record<string, string> = {
    processing: '退款处理中',
    completed: '退款完成',
  }

  const refundStatusText =
    refundStatusTextMap[props.order.refund_status] || props.order.refund_status
</script>

<style scoped>
  .payment-card {
    background: #fff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .title {
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
    font-size: 13px;
    color: #666;
  }

  .value {
    font-size: 13px;
  }

  .value.strong {
    font-weight: 600;
  }

  .refund .value {
    color: #f5222d;
  }

  .divider {
    height: 1px;
    background: #f0f0f0;
    margin: 12px 0;
  }

  .status {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
  }

  .gray {
    background: #f5f5f5;
    color: #888;
  }

  .green {
    background: #e6fffb;
    color: #13c2c2;
  }

  .orange {
    background: #fff7e6;
    color: #fa8c16;
  }

  .red {
    background: #fff1f0;
    color: #f5222d;
  }
</style>
