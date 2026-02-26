<!-- 
  订单详情页
  包含商品行、评价、操作区
  -->
<!-- src/views/orders/OrderDetail.vue -->
<template>
  <div class="order-detail-page">
    <div class="container">
      <div v-if="orderLoaded">
        <!-- 页面头部 -->
        <div class="page-header">
          <div class="header-left">
            <router-link
              to="/orders"
              class="back-link"
            >
              ← 返回订单列表
            </router-link>

            <h1>订单详情</h1>
            <div class="order-no">订单号：{{ order.order_no }}</div>
            <div class="order-status-text">
              当前状态：{{ currentStatusLabel }}
            </div>
          </div>
        </div>

        <!-- 状态时间轴 -->
        <OrderStatusTimeline :order="order" />

        <div class="layout">
          <div class="main">
            <!-- 商品列表 + 评价 -->
            <section class="card">
              <h2>商品信息</h2>
              <!-- 批量评价组件 -->
              <OrderReview :orderItems="order.items" />
            </section>

            <!-- 金额、物流、支付、发票 -->
            <OrderAmountSummary :order="order" />
            <LogisticsCard :order="order" />
            <PaymentMethodCard :order="order" />
            <InvoiceCard :order="order" />

            <!-- 订单记录 -->
            <section class="card">
              <h2>订单记录</h2>
              <div class="timeline">
                <div
                  v-for="step in completedSteps"
                  :key="step.key"
                  class="time-item"
                >
                  <span>{{ step.label }}</span>
                  <span>{{ formatTime(order[step.timeKey]) }}</span>
                </div>
              </div>
            </section>
          </div>

          <!-- 侧边栏 -->
          <aside class="sidebar">
            <section class="card">
              <h3>订单操作</h3>
              <OrderActionsBar
                v-if="order.items"
                :order="order"
                @updated="load"
              />
            </section>

            <section class="card">
              <h3>收货信息</h3>
              <div class="address">
                <div>{{ order.receiver_name || '—' }}</div>
                <div>{{ order.receiver_phone || '—' }}</div>
                <div>{{ order.receiver_address || '—' }}</div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      <div
        v-else
        class="loading-placeholder"
      >
        加载中...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ORDER_FLOW } from '@/constants/orderStatus'
  import { orderService } from '@/services/frontend/order'
  import { computed, onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import InvoiceCard from '@/components/orders/InvoiceCard.vue'
  import LogisticsCard from '@/components/orders/LogisticsCard.vue'
  import OrderActionsBar from '@/components/orders/OrderActionsBar.vue'
  import OrderAmountSummary from '@/components/orders/OrderAmountSummary.vue'
  import OrderStatusTimeline from '@/components/orders/OrderStatusTimeline.vue'
  import PaymentMethodCard from '@/components/orders/PaymentMethodCard.vue'
  import OrderReview from '@/components/review/OrderReview.vue'

  const route = useRoute()
  const router = useRouter()
  const order = ref<any>({})
  const orderLoaded = ref(false)

  // 当前状态显示
  const currentStatusLabel = computed(() => {
    return ORDER_FLOW.find((s) => s.key === order.value.status)?.label || '—'
  })

  // 已完成步骤
  const completedSteps = computed(() =>
    ORDER_FLOW.filter(
      (step) =>
        order.value[step.timeKey] &&
        ORDER_FLOW.findIndex((s) => s.key === step.key) <=
          ORDER_FLOW.findIndex((s) => s.key === order.value.status)
    )
  )

  function formatTime(time?: string) {
    return time ? new Date(time).toLocaleString() : '—'
  }

  // 加载订单详情
  const load = async () => {
    order.value = await orderService.fetchDetail(String(route.params.id))
    orderLoaded.value = true
  }

  // 跳转到商品评价页
  function goToProductReview(productId: number) {
    router.push({ name: 'product-review', params: { id: productId } })
  }

  onMounted(load)
</script>

<style scoped>
  .order-detail-page {
    background: #f6f7f9;
    min-height: 100vh;
    padding: 24px 0;
  }
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .back-link {
    font-size: 14px;
    color: #6b7280; /* 灰色 */
    text-decoration: none;
    cursor: pointer;
  }

  .back-link:hover {
    color: #111827;
    text-decoration: underline;
  }

  .order-no {
    font-size: 13px;
    color: #666;
    margin-top: 4px;
  }
  .layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }
  .card {
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
  }
  h2,
  h3 {
    font-size: 15px;
    margin-bottom: 12px;
  }

  .timeline {
    font-size: 13px;
    color: #555;
  }
  .time-item {
    display: flex;
    justify-content: space-between;
    padding: 4px 0;
  }
  .address {
    font-size: 14px;
    line-height: 1.6;
  }
  .loading-placeholder {
    text-align: center;
    padding: 50px 0;
    color: #999;
  }
  .product-row {
    margin-bottom: 16px;
  }

  /* 商品评价按钮 */
  .btn-review {
    margin-top: 8px;
    background-color: #409eff;
    color: #fff;
    border: 1px solid #409eff;
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 13px;
    cursor: pointer;
  }
  .btn-review:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
</style>
