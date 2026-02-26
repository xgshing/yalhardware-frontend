/* 购物车状态管理文件(把跨页面、跨组件共享的数据放到 Pinia) */
// src/stores/cart.ts
import type { AddToCartItem, CartItem } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

// 定义购物车状态存储
export const useCartStore = defineStore('cart', () => {
  // ========== 响应式状态 ==========
  // 购物车商品数组
  const items = ref<CartItem[]>([])
  // 控制购物车侧边抽屉的显示/隐藏
  const isDrawerOpen = ref(false)

  // ========== 计算属性 ==========
  /**
   * 计算购物车中所有商品的总数量
   * @returns 商品总数量
   */
  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + i.quantity, 0)
  )

  const checkedItems = computed(() => items.value.filter((i) => i.checked))

  /**
   * 计算购物车小计金额
   * @returns 格式化后的小计金额（保留两位小数）
   */
  const subtotal = computed(
    () =>
      checkedItems.value
        .reduce((sum, i) => sum + i.price * i.quantity, 0)
        .toFixed(2) //将计算结果保留两位小数
  )

  /**
   * 计算购物车中商品的种类数量
   * @returns 商品种类数量
   */
  const itemCount = computed(() => items.value.length)

  const isAllchecked = computed({
    get() {
      return items.value.length > 0 && items.value.every((i) => i.checked)
    },
    set(val: boolean) {
      items.value.forEach((i) => (i.checked = val))
      saveToStorage()
    },
  })

  // ========== 操作方法 ==========
  /**
   * 添加商品到购物车
   * 如果商品已存在（相同ID和款式），则增加数量
   * 否则添加新商品项
   * @param item - 要添加的商品信息
   */
  const addItem = (payload: AddToCartItem) => {
    const existing = items.value.find(
      (i) =>
        i.productId === payload.productId && i.variant_id === payload.variant_id
    )

    if (existing) {
      existing.quantity += payload.quantity
    } else {
      items.value.push({
        ...payload,
        checked: true,
      })
    }

    // 保存到本地存储
    saveToStorage()
  }

  /**
   * 更新商品数量
   * @param index - 商品在数组中的索引
   * @param type - 更新类型：增加或减少
   */
  const updateQuantity = (index: number, type: 'increase' | 'decrease') => {
    // 获取指定索引的商品对象，如不存在则直接返回
    const item = items.value[index]
    if (!item) return

    // 根据操作类型处理数量变更
    if (type === 'increase') item.quantity++
    else {
      // 减少数量，当数量为1时移除商品
      if (item.quantity > 1) item.quantity--
      else removeItem(index)
    }
    saveToStorage()
  }

  const toggleChecked = (index: number) => {
    const item = items.value[index]
    if (!item) return
    item.checked = !item.checked
    saveToStorage()
  }

  /**
   * 从购物车移除商品
   * @param index - 商品在数组中的索引
   */
  const removeItem = (index: number) => {
    // 从数组中删除指定位置的元素(从index位置开始删除1个元素)
    items.value.splice(index, 1)
    saveToStorage()
  }

  const clearCheckedItems = () => {
    items.value = items.value.filter((i) => !i.checked)
    saveToStorage()
  }
  /**
   * 清空购物车
   */
  const clearCart = () => {
    items.value = []
    // 清除本地存储中的购物车数据
    localStorage.removeItem('cart')
  }

  /**
   * 计算单个商品的总价
   * @param item - 购物车商品项
   * @returns 格式化后的单个商品总价（保留两位小数）
   */
  const calculateItemTotal = (item: CartItem) =>
    (item.price * item.quantity).toFixed(2)

  // ================= 下单专用 =================
  const buildOrderPayload = () => ({
    items: checkedItems.value.map((i) => ({
      variant_id: i.variant_id,
      quantity: i.quantity,
    })),
  })

  // ========== 本地存储相关操作 ==========
  /**
   * 从本地存储加载购物车数据
   */
  const loadFromStorage = () => {
    const raw = localStorage.getItem('cart')
    if (!raw) return

    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        items.value = parsed.map((i) => ({
          ...i,
          checked: i.checked ?? true,
        }))
      }
    } catch {
      items.value = []
    }
  }

  /**
   * 保存购物车数据到本地存储
   */
  const saveToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // ========== 初始化 ==========
  // 应用启动时从本地存储加载购物车数据
  loadFromStorage()

  // ========== 购物车侧边抽屉状态 ==========

  /**
   * 打开购物车侧边抽屉
   */
  const openDrawer = () => (isDrawerOpen.value = true)

  /**
   * 关闭购物车侧边抽屉
   */
  const closeDrawer = () => (isDrawerOpen.value = false)

  /**
   * 切换购物车侧边抽屉状态
   */
  const toggleDrawer = () => (isDrawerOpen.value = !isDrawerOpen.value)

  // ========== 导出所有状态和方法 ==========
  return {
    // 状态
    items,
    isDrawerOpen,

    // 计算属性
    totalItems,
    subtotal,
    itemCount,
    checkedItems,
    isAllchecked,

    // 操作方法
    addItem,
    updateQuantity,
    toggleChecked,
    removeItem,
    clearCheckedItems,
    clearCart,

    calculateItemTotal,
    buildOrderPayload,

    // 工具方法
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
})
