<!-- 订单商品行 -->
<!-- src/components/orders/OrderItemRow.vue -->
<template>
  <div class="order-item-row">
    <!-- 商品图 -->
    <img
      :src="item.product_image"
      class="item-image"
      alt=""
    />

    <!-- 商品信息 -->
    <div class="item-info">
      <div class="item-title">
        {{ item.product_title }}
      </div>

      <div
        v-if="item.sku_title"
        class="item-sku"
      >
        {{ item.sku_title }}
      </div>

      <div class="item-meta">
        <span class="item-price">￥{{ Number(item.price).toFixed(2) }}</span>
        <span class="multiply">×</span>
        <span class="item-qty">{{ item.quantity }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ item: any }>()
  console.log('OrderItemRow item =', props.item)
</script>

<style scoped>
  /* 商品行整体 */
  .order-item-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  /* 商品图 */
  .item-image {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 6px;
    background: #f5f5f5;
    flex-shrink: 0;
  }

  /* 右侧信息区 */
  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* 商品标题（核心） */
  .item-title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.4;
    color: #111;
  }

  /* SKU / 规格 */
  .item-sku {
    font-size: 12px;
    color: #888;
  }

  /* 价格 × 数量 */
  .item-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
  }

  .item-price {
    font-size: 13px;
    font-weight: 500;
  }

  .multiply {
    font-size: 12px;
    color: #999;
  }

  .item-qty {
    font-size: 13px;
  }

  /* 商品行之间留白（像 Amazon） */
  .order-item-row + .order-item-row {
    margin-top: 12px;
  }
</style>
