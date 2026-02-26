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
    if (!product.variants?.length) {
      throw new Error('该商品没有可选规格')
    }

    // 根据选择的索引获取对应的款式（variant）
    const variant = product.variants[selectedIndex]
    if (!variant) {
      throw new Error('请选择有效的商品规格')
    }
    // 调用购物车 store 的添加方法
    cartStore.addItem({
      productId: product.id,
      variant_id: variant.id,
      name: product.name, // 产品名称
      price: product.price, // 产品单价
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
