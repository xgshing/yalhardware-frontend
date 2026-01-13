// src/composables/product/useProductCart.ts
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'

/**
 * 产品购物车组合式函数
 * 封装产品详情页的购物车添加逻辑
 */
export function useProductCart() {
  // 获取购物车 store 实例（基于 Pinia）
  const cartStore = useCartStore()

  /**
   * 添加产品到购物车
   *
   * @param product - 要添加的产品对象
   * @param quantity - 购买数量
   * @param selectedIndex - 选择的款式索引（用于确定具体款式）
   */
  const addToCart = (
    product: Product,
    quantity: number,
    selectedIndex: number
  ) => {
    // 根据选择的索引获取对应的款式（variant）
    // 如果 selectedIndex 为 -1 或无效，variant 为 undefined
    const variant = product.variants![selectedIndex]! // product.variants 存在且 selectedIndex 有效

    // 调用购物车 store 的添加方法
    cartStore.addItem({
      id: product.id, // 产品唯一标识
      name: product.name, // 产品名称
      // price: product.price,
      unitPrice: product.price, // 产品单价
      caseType: variant.style_name, // 款式名称
      image: variant.style_image, // 款式图片
      quantity, // 购买数量
    })

    // 添加成功后自动打开购物车抽屉/侧边栏
    cartStore.openDrawer()
  }

  // 返回可以在组件中调用的方法
  return { addToCart }
}
