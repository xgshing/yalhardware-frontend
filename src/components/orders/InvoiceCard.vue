<!-- 发票模块 -->
<!-- src/components/orders/InvoiceCard.vue -->
<template>
  <section class="card invoice-card">
    <h3 class="card-title">发票信息</h3>

    <!-- 已开票 -->
    <div
      v-if="order.invoice"
      class="rows"
    >
      <div class="row">
        <span>发票类型</span>
        <span>{{ order.invoice.type }}</span>
      </div>

      <div class="row">
        <span>发票抬头</span>
        <span>{{ order.invoice.title }}</span>
      </div>

      <div class="row">
        <span>发票状态</span>
        <span class="issued">已开具</span>
      </div>
    </div>

    <!-- 未开票占位 -->
    <div
      v-else
      class="placeholder"
    >
      <div class="title">未开具发票</div>
      <div class="desc">如需发票，请联系商家或在订单完成后申请</div>
    </div>
  </section>
</template>

<script setup lang="ts">
  defineProps<{
    order: any
  }>()
</script>

<style scoped>
  .invoice-card {
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

  .issued {
    color: #52c41a;
    font-weight: 500;
  }

  .placeholder {
    background: #fafafa;
    border: 1px dashed #ddd;
    border-radius: 8px;
    padding: 14px;
  }

  .title {
    font-weight: 500;
    margin-bottom: 4px;
  }

  .desc {
    color: #888;
    font-size: 12px;
  }
</style>
