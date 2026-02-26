<!-- src/components/Drawer.vue -->
<!-- 购物车侧边抽屉组件 -->
<template>
  <!-- 半透明遮罩层：点击可关闭抽屉 -->
  <div
    v-if="cartStore.isDrawerOpen"
    class="drawer-overlay"
    @click="close"
  ></div>

  <!-- 
    右侧滑出抽屉主体 
    @click.stop 阻止点击事件冒泡到遮罩层 
    -->
  <div
    class="drawer"
    :class="{ open: cartStore.isDrawerOpen }"
    @click.stop
  >
    <!-- 
      抽屉头部区域 
      with-shadow: 根据滚动状态添加阴影效果
      -->
    <div
      class="drawer-header-wrapper"
      :class="{ 'with-shadow': headerShadow }"
    >
      <button
        class="close-btn"
        @click="close"
      >
        × CLOSE
      </button>
      <header class="drawer-header">
        <h2>Cart</h2>
        <div class="total-items">
          {{ cartStore.itemCount }} {{ itemLabel }} ({{ cartStore.totalItems }}
          total)
        </div>
      </header>
    </div>

    <!-- 
      抽屉内容区域 
      @scroll: 监听滚动事件，更新阴影状态
      -->
    <div
      ref="drawerBodyRef"
      class="drawer-body"
      @scroll="handleScroll"
    >
      <!-- 购物车有商品时的显示 -->
      <div
        class="myCart-container"
        v-if="cartStore.items.length > 0"
      >
        <div
          class="cart-item"
          v-for="(item, index) in cartStore.items"
          :key="item.variant_id"
        >
          <el-checkbox
            :model-value="item.checked"
            @change="() => cartStore.toggleChecked(index)"
          />
          <img
            class="product-img"
            :src="item.image"
            alt="product"
          />

          <div class="product-info">
            <div class="cartProduct-name">{{ item.name }}</div>
            <div class="cart-case-type">{{ item.caseType }}</div>

            <div class="caculate-price">
              <div class="cart-quantity-selector">
                <button
                  class="cart-quantity-btn"
                  @click="cartStore.updateQuantity(index, 'decrease')"
                >
                  －
                </button>
                <input
                  class="cart-quantity-input"
                  :value="item.quantity"
                  readonly
                />
                <button
                  class="cart-quantity-btn"
                  @click="cartStore.updateQuantity(index, 'increase')"
                >
                  ＋
                </button>
              </div>

              <span class="price"
                >${{ cartStore.calculateItemTotal(item) }}</span
              >
            </div>

            <div
              class="remove-btn"
              @click="cartStore.removeItem(index)"
            >
              <span class="closeBtn-icon">✕</span>
              <span class="remove"> REMOVE</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 购物车为空时的显示 -->
      <div
        class="empty-cart"
        v-else
      >
        <span>Your cart is empty</span>
      </div>
    </div>

    <!-- 抽屉底部区域（购物车有商品时显示） -->
    <div
      class="drawer-footer"
      v-if="cartStore.items.length > 0"
      :class="{ 'with-shadow': footerShadow }"
    >
      <div class="subtotal-price-container">
        <span class="sub-title">Subtotal</span>
        <span class="sub-price">${{ cartStore.subtotal }}</span>
      </div>

      <ShippingProtection />

      <button
        :disabled="cartStore.checkedItems.length === 0"
        @click="goCheckout"
        class="order check-out"
      >
        Check Out
      </button>
      <div
        class="order view-the-cart"
        @click="openCart"
      >
        <span>View My Cart</span>
        <icon-lucide-shopping-bag />
      </div>

      <p class="tax-note">
        Taxes and
        <!-- 
          target="_blank"新浏览器标签页 / 窗口 打开目标页面
        -->
        <a
          class="policy-link"
          href="/shipping-policy"
        >
          shipping
        </a>
        calculated at checkout
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  // ========== 导入模块 ==========
  import { useCartStore } from '@/stores/cart'
  import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // ========== 使用 Pinia store ==========
  const cartStore = useCartStore()

  // ========== 响应式状态 ==========
  const drawerBodyRef = ref<HTMLElement | null>(null)
  // 头部阴影显示状态
  const headerShadow = ref(false)
  // 底部阴影显示状态
  const footerShadow = ref(false)

  // ========== 事件处理函数 ==========
  /**
   * 处理滚动事件，更新头部和底部的阴影状态
   */
  const handleScroll = () => {
    const el = drawerBodyRef.value
    if (!el) return

    // 判断是否滚动到顶部
    const atTop = el.scrollTop === 0
    // 判断是否滚动到底部（有1像素的容差）
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1

    // 更新阴影状态
    headerShadow.value = !atTop // 不在顶部时显示顶部阴影
    footerShadow.value = !atBottom // 不在底部时显示底部阴影
  }

  // ========== 方法 ==========
  /**
   * 关闭抽屉
   * 调用 store 的 closeDrawer 方法
   */
  const close = () => {
    cartStore.closeDrawer()
  }

  const itemLabel = computed(() =>
    cartStore.itemCount === 1 ? 'item' : 'items'
  )

  // 控制 body 元素滚动锁定 / 解锁
  const toggleBodyScroll = (lock: boolean) => {
    document.body.classList.toggle('no-scroll', lock)
  }

  // ===================== 跳转到购物车 =====================
  const openCart = () => {
    router.push({
      name: 'cart',
      query: {
        purpose: 'Your Shopping Cart',
      },
    })
    cartStore.closeDrawer()
  }

  const goCheckout = () => {
    router.push({ name: 'order-confirm' })
    cartStore.closeDrawer()
  }
  // ========== 生命周期和监听器 ==========
  /**
   * 监听购物车抽屉的打开/关闭状态变化
   * @param open - 抽屉是否打开
   */
  watch(
    () => cartStore.isDrawerOpen,
    async (open) => {
      toggleBodyScroll(open)

      // 抽屉打开后，初始化阴影状态
      if (open) {
        await nextTick()
        handleScroll()
      }
    },
    // 立即执行：初始化时也执行一次
    { immediate: true }
  )

  /**
   * 组件卸载时清理
   * 移除 body 上的滚动锁定类
   */
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
    transform: translateX(100%);
    transition: transform 0.35s ease;
    /* 保留过渡效果 */
    z-index: 200;
    overflow: hidden;
    /* 抽屉本身不滚 */
  }

  .drawer.open {
    transform: translateX(0);
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

  .price {
    margin-left: auto;
    /* 吸收左边所有剩余空间 */
    margin-right: 30px;

    font-size: 12px;
    font-weight: bold;
    color: #333;
  }

  .remove-btn {
    font-size: 12px;
    color: #666;
    cursor: pointer;
  }

  .sub-price {
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
