<!-- src/views/cart.vue -->
<template>
  <div class="body">
    <NavBar />

    <!-- ================= 导航 ================= -->
    <Breadcrumb
      :items="[{ label: 'Home', clickable: true }, { label: purpose }]"
      @item-click="handleClick"
    />

    <div class="title">
      <h1>Shopping Cart</h1>
      <div>Continue shopping</div>
    </div>

    <div class="cart-style">
      <p>Product</p>
      <p class="price-title">Price</p>
      <p>Quantity</p>
      <p>Total</p>
    </div>

    <div class="cart-header">
      <el-checkbox v-model="cartStore.isAllchecked"> select All </el-checkbox>
    </div>

    <div
      v-for="(item, index) in cartStore.items"
      :key="item.variant_id"
      class="cart-item"
    >
      <el-checkbox
        :model-value="item.checked"
        @change="() => cartStore.toggleChecked(index)"
      />

      <div class="pic-product-info">
        <!-- 商品图片 -->
        <img
          :src="item.image"
          :alt="item.name"
          class="item-img"
        />
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p class="case-type">Case Type: {{ item.caseType }}</p>
        </div>
      </div>
      <p class="price">${{ item.price }}</p>

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

      <div class="price">${{ cartStore.calculateItemTotal(item) }}</div>

      <button
        class="remove-btn"
        @click="cartStore.removeItem(index)"
      >
        <span class="closeBtn-icon">✕</span>
        <span class="remove"> REMOVE</span>
      </button>
    </div>

    <!-- ================= 运费保险 ================= -->
    <ShippingProtection class="shipping-protection" />
  </div>

  <div class="subtotal-pay">
    <div>
      <p class="subtotal">Subtotal: ${{ cartStore.subtotal }}</p>
      <p class="tax-note">
        Taxes and
        <a
          class="policy-link"
          href="/shipping-policy"
        >
          shipping
        </a>
        calculated at checkout
      </p>
    </div>

    <el-button
      type="primary"
      class="order check-out"
      :disabled="cartStore.checkedItems.length === 0"
      @click="checkout"
    >
      <span>Check Out</span>
      <Icon icon="fluent-mdl2:payment-card" />
    </el-button>
  </div>
</template>

<script setup lang="ts">
  import { useCartStore } from '@/stores/cart'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { orderService } from '@/services'
  import { Icon } from '@iconify/vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const router = useRouter()

  // ========== 获取 Pinia 存储（Store）实例 ==========
  const cartStore = useCartStore()

  /* ================== Purpose 计算属性 ================== */
  const purpose = computed(() => {
    // 获取 query 参数
    const purposeValue = route.query.purpose as string

    // 返回处理后的值
    return purposeValue || '默认页面'
  })

  /* ================== 导航 ================== */
  const handleClick = (index: number) => {
    if (index === 0) {
      router.push({ name: 'home' })
    }
  }

  const checkout = async () => {
    try {
      // 构建订单payload
      const payload = cartStore.buildOrderPayload()

      console.log('Submitting payload:')
      console.log(JSON.stringify(payload, null, 2))
      console.log('Cart store items:', cartStore.items)

      if (!payload.items || payload.items.length === 0) {
        ElMessage.warning('Please select items to checkout')
        return
      }

      // 调用后端创建订单
      const order = await orderService.submit(payload)
      ElMessage.success('Order created successfully')

      // 成功后跳转到确认面（带id)
      router.push({
        name: 'order-pay',
        params: {
          id: order.id,
        },
      })
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log('Response data:', err.response?.data)
        ElMessage.error(err.response?.data?.detail || 'Failed to create order')
      } else {
        ElMessage.error('Unexpected error occurred')
      }
    }
  }
</script>

<style scoped>
  /* 页面主容器样式 */
  .body {
    margin: 0 30px;
    height: 100vh;
  }

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;
    color: #999;
  }
  .title h1 {
    font-size: 3.5rem;
    font-weight: 500;
    color: #111;
  }

  .cart-style {
    display: flex;
    flex-direction: row;
    gap: 11rem;
    background-color: #f7f3f3;
    padding: 0 30px;
  }

  .price-title {
    padding-left: 20rem;
  }
  .cart-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #ddd;
    gap: 150px;
  }

  .pic-product-info {
    display: flex;
    flex-direction: row;
  }
  .item-img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    margin-right: 30px;
  }

  .item-info {
    font-size: 0.8rem;
  }

  .item-info h3 {
    width: 20rem;
  }
  .case-type {
    color: #999;
  }

  .cart-quantity-selector {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 5px;
    height: 30px;
    overflow: hidden; /* 防止子元素边框溢出 */
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

  .remove-btn {
    font-size: 12px;
    color: #666;
    cursor: pointer;
  }

  .shipping-protection {
    display: flex;
    justify-content: center;
  }

  .subtotal-pay {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #f7f3f3;
    gap: 5rem;
    padding: 10rem;
  }

  .subtotal {
    font-size: 1rem;
    font-weight: 600;
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

  .order {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    width: auto;
    height: 60px;
    font-size: 15px;
    font-weight: bold;
    border-radius: 5px;
  }

  .check-out {
    background-color: #333;
    width: 15rem;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .check-out:hover {
    background-color: black;
  }
</style>
