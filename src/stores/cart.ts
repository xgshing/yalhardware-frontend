/* src/stores/cart.ts */
/* 购物车状态管理文件 */
// src/stores/cart.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem } from '@/types/product'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  // 安全提取价格数字的辅助函数
  const extractPriceNumber = (priceStr?: string): number => {
    if (!priceStr) return 0

    // 方法1: 使用更安全的正则匹配
    const match = priceStr.match(/\$?(\d+(?:\.\d+)?)/)
    if (!match || !match[1]) return 0

    const price = parseFloat(match[1])
    return isNaN(price) ? 0 : price

    // 方法2: 使用更简单的提取方式
    // const numbers = priceStr.replace(/[^\d.]/g, '')
    // const price = parseFloat(numbers)
    // return isNaN(price) ? 0 : price
  }

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return items.value
      .reduce((total, item) => {
        const priceNum = extractPriceNumber(item.unitPrice)
        return total + priceNum * item.quantity
      }, 0)
      .toFixed(2)
  })

  const itemCount = computed(() => items.value.length)

  // Actions
  const addItem = (item: Omit<CartItem, 'id'> & { id?: number }) => {
    const productId = item.id || Date.now()
    const caseType = item.caseType || 'Default'
    const image = item.image || 'https://via.placeholder.com/100'

    const existingItem = items.value.find(
      (i) => i.id === productId && i.caseType === caseType
    )

    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      items.value.push({
        id: productId,
        name: item.name,
        price: item.price,
        unitPrice: item.unitPrice,
        caseType,
        image,
        quantity: item.quantity,
      })
    }

    saveToStorage()
  }

  const updateQuantity = (index: number, type: 'increase' | 'decrease') => {
    if (index < 0 || index >= items.value.length) return

    const item = items.value[index]
    if (!item) return

    if (type === 'increase') {
      item.quantity++
    } else if (type === 'decrease') {
      if (item.quantity > 1) {
        item.quantity--
      } else {
        removeItem(index)
        return
      }
    }

    saveToStorage()
  }

  const removeItem = (index: number) => {
    if (index >= 0 && index < items.value.length) {
      items.value.splice(index, 1)
      saveToStorage()
    }
  }

  const clearCart = () => {
    items.value = []
    localStorage.removeItem('cart')
  }

  // 计算单个商品总价
  const calculateItemTotal = (item: CartItem): string => {
    const priceNum = extractPriceNumber(item.unitPrice)
    return (priceNum * item.quantity).toFixed(2)
  }

  // localStorage 相关
  const loadFromStorage = () => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          items.value = parsed
        }
      } catch (error) {
        console.error('Failed to load cart from storage:', error)
        items.value = []
      }
    }
  }

  const saveToStorage = () => {
    localStorage.setItem('cart', JSON.stringify(items.value))
  }

  // 初始化
  loadFromStorage()

  const isDrawerOpen = ref(false)

  const openDrawer = () => {
    console.log('cart.ts - openDrawer 被调用')
    isDrawerOpen.value = true
    console.log('cart.ts - 当前状态:', isDrawerOpen.value)
  }

  const closeDrawer = () => {
    console.log('cart.ts - closeDrawer 被调用')
    isDrawerOpen.value = false
  }

  const toggleDrawer = () => {
    isDrawerOpen.value = !isDrawerOpen.value
  }

  return {
    // 状态
    items,

    // Getters
    totalItems,
    subtotal,
    itemCount,

    // Actions
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    calculateItemTotal,

    // 工具方法
    loadFromStorage,
    saveToStorage,

    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  }
})
