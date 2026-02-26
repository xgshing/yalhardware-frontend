<!-- 单个订单卡片（列表页核心） -->
<!-- src/components/orders/OrderCard.vue -->
<template>
  <div class="order-card">
    <!-- Header：订单号 / 时间 / 状态 -->
    <div class="order-header">
      <div class="header-left">
        <div class="order-no">订单号 {{ order.order_no }}</div>
        <div class="order-time">{{ formatTime(order.created_at) }}</div>
      </div>

      <div class="status-tag">
        {{ order.status }}
      </div>
    </div>

    <!-- 状态条 -->
    <OrderStatusTimeline
      :order="order"
      compact
    />

    <!-- 商品列表（最多 2 条） -->
    <div class="order-items">
      <OrderItemRow
        v-for="item in displayItems"
        :key="item.id"
        :item="item"
      />

      <div
        v-if="order.items.length > 2"
        class="more-items"
      >
        共 {{ order.items.length }} 件商品
      </div>
      <p
        class="view-detail"
        @click="viewDetail"
      >
        查看订单详情
      </p>
    </div>

    <!-- 底部：金额 + 操作 -->
    <div class="order-footer">
      <div class="order-amount">
        <span class="label">实付金额</span>
        <span class="amount"
          >￥{{ Number(order.total_amount).toFixed(2) }}</span
        >
      </div>

      <div class="footer-actions">
        <OrderActionsBar
          v-if="order.available_actions?.length"
          :order="order"
          @updated="$emit('updated')"
        />

        <!-- 仅已完成订单显示去评价 -->
        <button
          v-if="order.status === 'COMPLETED'"
          class="btn btn-review"
          @click="goToReview(order)"
        >
          ⭐ 去评价
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import OrderActionsBar from './OrderActionsBar.vue'
  import OrderItemRow from './OrderItemRow.vue'
  import OrderStatusTimeline from './OrderStatusTimeline.vue'

  const props = defineProps<{ order: any }>()
  defineEmits<{ (e: 'updated'): void }>()
  const router = useRouter()

  /**
   * 只展示前 2 条商品（电商通用做法）
   */
  const displayItems = props.order.items.slice(0, 2)

  function formatTime(t: string) {
    return new Date(t).toLocaleString()
  }

  /**
   * 查看订单详情
   */
  function viewDetail() {
    router.push({ name: 'order-detail', params: { id: props.order.id } })
  }

  // 去评价：直接跳转到批量评价页
  function goToReview(order: any) {
    router.push({ name: 'order-detail', params: { id: order.id } })
  }
</script>

<style scoped>
  /* 卡片整体 */
  .order-card {
    background: #fff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
  }

  /* Header */
  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .order-no {
    font-size: 13px;
    font-weight: 500;
  }

  .order-time {
    font-size: 12px;
    color: #999;
  }

  /* 状态标签（电商级） */
  .status-tag {
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 999px;
    font-weight: 500;
    white-space: nowrap;
  }

  .status-pending {
    background: #fff7e6;
    color: #fa8c16;
  }

  .status-paid {
    background: #e6fffb;
    color: #13c2c2;
  }

  .status-shipped {
    background: #e6f4ff;
    color: #1677ff;
  }

  .status-completed {
    background: #f6ffed;
    color: #52c41a;
  }

  .status-cancelled {
    background: #fff1f0;
    color: #f5222d;
  }

  /* 商品区 */
  .order-items {
    border-top: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    padding: 12px 0;
  }

  .more-items {
    font-size: 12px;
    color: #666;
    margin-top: 6px;
  }

  .view-detail {
    font-size: 12px;
    color: #666;
    margin-top: 6px;
    cursor: pointer;
  }

  .view-detail:hover {
    color: black;
  }
  /* Footer */
  .order-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
  }

  .order-amount {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .order-amount .label {
    font-size: 12px;
    color: #666;
  }

  .order-amount .amount {
    font-size: 16px;
    font-weight: 600;
  }

  .footer-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .btn-review {
    background-color: #409eff;
    color: #fff;
    border: 1px solid #409eff;
    border-radius: 4px;
    padding: 6px 14px;
    font-size: 13px;
    cursor: pointer;
  }
  .btn-review:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
</style>
