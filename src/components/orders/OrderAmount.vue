<!-- 金额汇总块” -->
<!-- src/components/orders/OrderAmount.vue-->
<template>
  <div class="order-amount">
    <span>总金额：</span>
    <span class="amount">￥{{ amount }}</span>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ amount: number }>()
</script>

<style scoped>
  .order-amount {
    text-align: right;
    font-weight: bold;
    margin-top: 8px;
  }
  .amount {
    color: #f56c6c;
    margin-left: 4px;
  }
</style>
