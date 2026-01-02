<!-- src/components/Drawer.vue -->
<template>
  <!-- 半透明遮罩层 -->
  <div v-if="showDrawer" class="drawer-overlay" @click="close"></div>

  <!-- 右侧滑出抽屉 -->
  <div class="drawer" :style="{ transform: showDrawer ? 'translateX(0)' : 'translateX(100%)' }" @click.stop>

    <div class="drawer-header-wrapper" :class="{ 'with-shadow': headerShadow }">
      <button class="close-btn" @click="close">× CLOSE</button>
      <header class="drawer-header">
        <h2>Cart</h2>
        <div class="total-items">
          {{ cartStore.itemCount }} item{{ cartStore.itemCount !== 1 ? 's' : '' }}
          ({{ cartStore.totalItems }} total)
        </div>
      </header>
    </div>

    <div ref="drawerBodyRef" class="drawer-body" @scroll="handleScroll">
      <div class="myCart-container" v-if="cartStore.items.length > 0">
        <div class="cart-item" v-for="(item, index) in cartStore.items" :key="item.id">
          <img class="product-img" :src="item.image" alt="product" />

          <div class="product-info">
            <div class="cartProduct-name">{{ item.name }}</div>
            <div class="cart-case-type">{{ item.caseType }}</div>

            <div class="caculate-price">
              <div class="cart-quantity-selector">
                <div class="cart-quantity-btn" @click="cartStore.updateQuantity(index, 'decrease')">－</div>
                <input class="cart-quantity-input" :value="item.quantity" readonly />
                <div class="cart-quantity-btn" @click="cartStore.updateQuantity(index, 'increase')">＋</div>
              </div>

              <div class="item-total-price">
                <span class="price-symbol">$</span>
                <span class="price-money">{{ cartStore.calculateItemTotal(item) }}</span>
              </div>
            </div>

            <div class="remove-btn" @click="cartStore.removeItem(index)">
              <span class="closeBtn-icon">✕</span>
              <span class="remove"> REMOVE</span>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-cart" v-else>
        <span>Your cart is empty</span>
      </div>
    </div>

    <div class="drawer-footer" v-if="cartStore.items.length > 0" :class="{ 'with-shadow': footerShadow }">
      <div class="subtotal-price-container">
        <span class="sub-title">Subtotal</span>
        <div class="subtotal-price">
          <span class="price-symbol">$</span>
          <span class="sub-price">{{ cartStore.subtotal }}</span>
        </div>
      </div>

      <div class="shipping-protection">
        <div class="navidium-wrapper">
          <img src="https://app.navidiumapp.com/dashboard/img/navidium-shipping-icon.png" alt="Navidium icon"
            class="navidium-icon">
          <!-- 右下角叠加勾选状态 -->
          <ShippingProtectionIcon :active="shippingEnabled" class="status-icon" />
        </div>

        <div class="shipping-content">
          <div class="Shipping-control">
            <h3>Shipping Protection</h3>
            <!-- 选择开关 -->
            <label class="switch">
              <input type="checkbox" v-model="shippingEnabled" />
              <span class="slider"></span>
            </label>
          </div>
          <span>from Damage, Loss & Theft for $11.25</span>
          <span>Get peace of mind with Delivery Guarantee in the event your delivery is damaged, stolen, or lost during
            transit.</span>
        </div>
      </div>

      <div class="order check-out">Check Out</div>
      <div class="order view-the-cart">
        <span>View My Cart</span>
        <icon-lucide-shopping-bag />
      </div>

      <p class="tax-note">
        Taxes and
        <!-- 
          target="_blank"新浏览器标签页 / 窗口 打开目标页面
        -->
        <a class="policy-link" href="/shipping-policy">
          shipping
        </a>
        calculated at checkout
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted, onMounted, nextTick, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import ShippingProtectionIcon from '@/components/icons/ShippingProtectionIcon.vue'

// 使用 Pinia store
const cartStore = useCartStore()

const shippingEnabled = ref(true)

const drawerBodyRef = ref<HTMLElement | null>(null)
const headerShadow = ref(false)
const footerShadow = ref(false)

const handleScroll = () => {
  const el = drawerBodyRef.value
  if (!el) return

  const { scrollTop, scrollHeight, clientHeight } = el

  headerShadow.value = scrollTop > 0
  footerShadow.value = scrollTop + clientHeight < scrollHeight - 1
}

// 使用 computed 确保响应式
const showDrawer = computed(() => {
  return cartStore.isDrawerOpen
})


// 关闭抽屉
const close = () => {
  console.log('🔄 点击关闭按钮')
  cartStore.closeDrawer()
}

// 监听状态变化
watch(
  () => cartStore.isDrawerOpen,
  async (open) => {
    // 1️⃣ 控制 body 滚动（原逻辑）
    document.body.classList.toggle('no-scroll', open)

    // 2️⃣ 抽屉打开后，初始化阴影状态
    if (open) {
      await nextTick()
      handleScroll()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(2px);
  z-index: 100;
}

/* 抽屉主体 - 简化，transform 由内联样式控制 */
.drawer {
  position: fixed;
  right: 0;
  top: 0;
  width: 420px;
  max-width: 90%;
  height: 100vh;

  background: #fff;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s ease;
  /* 保留过渡效果 */
  z-index: 200;
  overflow: hidden;
  /* 🔴 关键：抽屉本身不滚 */
}

.drawer-header-wrapper {
  position: relative;
  z-index: 2;
  transition: box-shadow 0.2s ease;
  padding: 30px 30px 0 30px;
}

.drawer-header-wrapper.with-shadow {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.close-btn {
  background: none;
  border: none;
  font-size: 12px;
  cursor: pointer;
  float: right;
  /* 浮动到右边,close-btn下方元素需要配合clear: both;使用 */
}

.drawer-header {
  clear: both;
  /* 确保header在按钮下方正常显示 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-header h2 {
  font-size: 3rem;
  font-weight: 400;
  margin: 0;
  color: #333;
}

.total-items {
  font-size: 12px;
  color: #666;
}


/* ---------------------购物车数据集--------------------- */
.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 0 30px;
}

.myCart-container {
  height: 50px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
}

.product-img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  margin-right: 30px;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 10px;
}

.cartProduct-name {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 10px;
}

.cart-case-type {
  font-size: 12px;
  color: #666;
  margin-bottom: 20px;
}

.caculate-price {
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 20px;
}

.cart-quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  height: 30px;
  overflow: hidden;
  /* 防止子元素边框溢出 */
}

.cart-quantity-btn {
  width: 30px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
}

.cart-quantity-input {
  width: 40px;
  height: 100%;
  text-align: center;
  border: none;
}

.item-total-price {
  margin-left: auto;
  /* 吸收左边所有剩余空间 */
  margin-right: 30px;
  /* 现在应该有效了 */
}

.remove-btn {
  font-size: 12px;
  color: #666;
  cursor: pointer;
}

.price-symbol {
  color: #333;
}

.price-money {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.empty-cart {
  text-align: center;
  padding: 100px 0;
  color: #999;
  font-size: 28px;
}

.drawer-footer {
  position: relative;
  z-index: 2;
  transition: box-shadow 0.2s ease;
  padding: 30px 30px 0 30px;
}

.drawer-footer.with-shadow {
  box-shadow: 0 -6px 12px rgba(0, 0, 0, 0.08);
}

.subtotal-price-container {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bolder;
}

.shipping-protection {
  display: flex;
  align-items: center;
  padding: 20px 0;
}



.shipping-content {
  display: flex;
  flex-direction: column;
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
  content: "";
  position: absolute;
  width: calc(var(--h) - var(--p) * 2);
  height: calc(var(--h) - var(--p) * 2);
  left: var(--p);
  bottom: var(--p);
  background-color: white;
  border-radius: 50%;
  transition: 0.2s;
}

.switch input:checked+.slider {
  background-color: #008060;
}

.switch input:checked+.slider::before {
  transform: translateX(calc(var(--w) - var(--h)));
}







.order {
  display: flex;
  align-items: center;
  width: auto;
  height: 50px;
  font-size: 12px;
  font-weight: bold;
  border: 1px solid #7b5a43;
  border-radius: 5px;
  margin-top: 10px;
}

.check-out {
  background-color: #333;
  color: white;
  padding-left: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.check-out:hover {
  background-color: black;
}

.view-the-cart {
  display: flex;
  justify-content: space-between;
  color: #7b5a43;
  padding: 0 30px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-the-cart:hover {
  background-color: #7b5a43;
  color: white;
}


.tax-note {
  font-size: 12px;
  color: #666;
}

.policy-link {
  color: inherit;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  cursor: pointer;
}

.policy-link:hover {
  color: #333;
}
</style>