<!-- src/components/ShippingProtection.vue -->
<!-- 运输保险 -->
<template>
  <div class="shipping-protection">
    <div class="navidium-wrapper">
      <img
        src="https://app.navidiumapp.com/dashboard/img/navidium-shipping-icon.png"
        alt="Navidium icon"
        class="navidium-icon"
      />
      <!-- 右下角叠加勾选状态 -->
      <ShippingProtectionIcon
        :active="shippingEnabled"
        class="status-icon"
      />
    </div>
    <div class="shipping-content">
      <div class="Shipping-control">
        <h3>Shipping Protection</h3>
        <!-- 选择开关 -->
        <label class="switch">
          <input
            type="checkbox"
            v-model="shippingEnabled"
          />
          <span class="slider"></span>
        </label>
      </div>
      <span>from Damage, Loss & Theft for $11.25</span>
      <span
        >Get peace of mind with Delivery Guarantee in the event your delivery is
        damaged, stolen, or lost during transit.</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  // ========== 响应式状态 ==========
  // 运输保护开关状态
  const shippingEnabled = ref(true)
</script>

<style scoped>
  .shipping-protection {
    display: flex;
    align-items: center;
    padding: 20px 0;
  }

  .shipping-content {
    display: flex;
    flex-direction: column;
    width: 300px;
    font-size: 12px;
    color: #666;
  }

  .Shipping-control {
    display: flex;
    justify-content: space-between;
  }

  .shipping-content h3 {
    font-size: 12px;
    color: #333;
    margin: 5px;
  }

  /* Navidium 图标容器 */
  .navidium-wrapper {
    position: relative;
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }

  .navidium-icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  /* 右下角勾 */
  .status-icon {
    position: absolute;
    right: 4px;
    bottom: 4px;
  }

  /* 标题行 */
  .shipping-title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* -------- 开关样式 -------- */
  .switch {
    --h: 15px;
    --w: 30px;
    --p: 3px;

    position: relative;
    width: var(--w);
    height: var(--h);
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #ccc;
    border-radius: var(--h);
    transition: 0.2s;
  }

  .slider::before {
    content: '';
    position: absolute;
    width: calc(var(--h) - var(--p) * 2);
    height: calc(var(--h) - var(--p) * 2);
    left: var(--p);
    bottom: var(--p);
    background-color: white;
    border-radius: 50%;
    transition: 0.2s;
  }

  .switch input:checked + .slider {
    background-color: #008060;
  }

  .switch input:checked + .slider::before {
    transform: translateX(calc(var(--w) - var(--h)));
  }
</style>
