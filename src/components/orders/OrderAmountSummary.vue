<!-- 金额明细模块 -->
<!-- src/components/orders/OrderAmountSummary.vue -->
<template>
  <section class="card amount-card">
    <h3 class="card-title">金额明细</h3>

    <div class="rows">
      <div class="row">
        <span>商品小计</span>
        <span>{{ currency(subtotal) }}</span>
      </div>

      <div
        v-if="shippingFee > 0"
        class="row"
      >
        <span>运费</span>
        <span>{{ currency(shippingFee) }}</span>
      </div>

      <div
        v-if="discount > 0"
        class="row discount"
      >
        <span>优惠</span>
        <span>-{{ currency(discount) }}</span>
      </div>

      <div class="divider" />

      <div class="row total">
        <span>实付金额</span>
        <span>{{ currency(total) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  const props = defineProps<{
    order: any
  }>()

  const subtotal = props.order.subtotal_amount ?? props.order.total_amount
  const shippingFee = props.order.shipping_fee ?? 0
  const discount = props.order.discount_amount ?? 0
  const total = props.order.total_amount

  function currency(value: number) {
    return `¥${value.toFixed(2)}`
  }
</script>

<style scoped>
  .amount-card {
    padding: 16px;
  }

  .card-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .rows {
    font-size: 13px;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .discount {
    color: #52c41a;
  }

  .divider {
    height: 1px;
    background: #eee;
    margin: 10px 0;
  }

  .total {
    font-size: 14px;
    font-weight: 600;
  }
</style>
