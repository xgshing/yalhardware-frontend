<!-- src/views/orders/OrderPay.vue -->
<!-- 订单信息卡片 -->
<template>
  <div
    v-if="order"
    class="order-pay-page"
  >
    <!-- Header -->
    <header class="order-header">
      <div>
        <h1 class="order-no">Order #{{ order.order_no }}</h1>
        <p class="order-date">Placed on {{ formatDate(order.created_at) }}</p>
      </div>

      <span
        class="order-status"
        :class="order.status"
      >
        {{ statusText(order.status) }}
      </span>
    </header>

    <!-- Items -->
    <section class="order-items">
      <div
        v-for="item in order.items"
        :key="item.id"
        class="order-item"
      >
        <!-- Image -->
        <img
          class="item-image"
          :src="item.product_image"
          alt=""
        />

        <!-- Info -->
        <div class="item-info">
          <h3 class="item-title">{{ item.product_title }}</h3>

          <p
            v-if="item.sku_title"
            class="item-sku"
          >
            Spec: {{ item.sku_title }}
          </p>

          <p class="item-qty">Qty × {{ item.quantity }}</p>
        </div>

        <!-- Price -->
        <div class="item-price">
          ￥{{ (Number(item.price) * item.quantity).toFixed(2) }}
        </div>
      </div>
    </section>

    <!-- Summary -->
    <section class="order-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>￥{{ order.total_amount }}</span>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <span>￥{{ order.total_amount }}</span>
      </div>

      <!-- Actions -->
      <div class="order-actions">
        <button
          v-if="order.can_pay"
          class="btn primary"
          @click="payOrder"
        >
          Pay now
        </button>

        <button
          v-if="order.can_cancel"
          class="btn danger"
          @click="cancelOrder"
        >
          Cancel order
        </button>
      </div>
    </section>
  </div>

  <!-- Loading -->
  <div
    v-else
    class="order-loading"
  >
    Loading order…
  </div>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { orderService } from '@/services'
  import { useCartStore } from '@/stores/cart'
  import type { OrderDetail, OrderStatus } from '@/types'

  const route = useRoute()
  const router = useRouter()
  const cartStore = useCartStore()

  const order = ref<OrderDetail | null>(null)

  const formatDate = (date: string) => new Date(date).toLocaleString()

  const statusText = (status: OrderStatus) =>
    ({
      PENDING: 'Pending payment',
      PAID: 'Paid',
      SHIPPED: 'Shipped',
      COMPLETED: 'Completed',
      CANCELLED: 'Canceled',
    })[status]

  onMounted(async () => {
    try {
      order.value = await orderService.fetchDetail(route.params.id as string)
    } catch {
      ElMessage.error('Failed to load order')
    }
  })

  const payOrder = async () => {
    if (!order.value) return

    await orderService.payOrder(order.value.id)

    cartStore.clearCheckedItems()

    ElMessage.success('Payment successful')
    router.replace({
      name: 'order-detail',
      params: { id: order.value.id },
    })
  }

  const cancelOrder = async () => {
    if (!order.value) return

    await orderService.cancelOrder(order.value.id)

    ElMessage.success('Order canceled')
    router.push('/orders')
  }
</script>

<style scoped>
  .order-pay-page {
    max-width: 900px;
    margin: 40px auto;
    padding: 0 16px;
  }

  /* Header */
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 1px solid #eee;
    padding-bottom: 16px;
    margin-bottom: 24px;
  }

  .order-no {
    font-size: 22px;
    font-weight: 600;
  }

  .order-date {
    font-size: 13px;
    color: #888;
  }

  .order-status {
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 500;
  }

  .order-status.PENDING {
    background: #fff7e6;
    color: #d48806;
  }

  .order-status.PAID {
    background: #e6fffb;
    color: #08979c;
  }

  .order-status.COMPLETED {
    background: #f6ffed;
    color: #389e0d;
  }

  .order-status.CANCELLED {
    background: #fff1f0;
    color: #cf1322;
  }

  /* Items */
  .order-items {
    border: 1px solid #eee;
    border-radius: 12px;
    overflow: hidden;
  }

  .order-item {
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 16px;
    padding: 16px;
    border-bottom: 1px solid #eee;
  }

  .order-item:last-child {
    border-bottom: none;
  }

  .item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 8px;
    background: #f5f5f5;
  }

  .item-title {
    font-size: 15px;
    font-weight: 500;
    margin-bottom: 4px;
  }

  .item-sku,
  .item-qty {
    font-size: 13px;
    color: #666;
  }

  .item-price {
    font-size: 15px;
    font-weight: 500;
    align-self: center;
  }

  /* Summary */
  .order-summary {
    margin-top: 24px;
    border-top: 1px solid #eee;
    padding-top: 16px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;
  }

  .summary-row.total {
    font-size: 16px;
    font-weight: 600;
  }

  /* Actions */
  .order-actions {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    border: none;
  }

  .btn.primary {
    background: #1677ff;
    color: #fff;
  }

  .btn.primary:hover {
    background: #0958d9;
  }

  .btn.danger {
    background: #fff;
    color: #cf1322;
    border: 1px solid #ffccc7;
  }

  .btn.danger:hover {
    background: #fff1f0;
  }

  /* Loading */
  .order-loading {
    text-align: center;
    padding: 80px;
    color: #888;
  }
</style>
