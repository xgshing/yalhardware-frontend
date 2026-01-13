// src/composables/product/useProductVariants.ts
import { ref } from 'vue'
import type { Product } from '@/types'

/**
 * 产品款式组合式函数
 * 用于管理产品的款式（如不同颜色、尺寸、版本）选择逻辑
 *
 * @param productData - 产品数据获取函数，使用函数形式确保响应性
 */
export function useProductVariants(productData: () => Product | null) {
  // 当前选中的款式索引，-1 表示未选择或默认
  const selectedCaseIndex = ref(-1)

  /**
   * 选择产品款式
   * @param index - 款式在 variants 数组中的索引
   */

  const selectCase = (index: number) => {
    selectedCaseIndex.value = index
  }

  /**
   * 根据图片索引同步款式选择
   * 当用户通过图片轮播切换时，自动选择对应的款式
   *
   * @param imageIndex - 当前展示的图片索引
   */
  const syncByImageIndex = (imageIndex: number) => {
    // 获取款式数量，如果不存在则默认为 0
    const count = productData()?.variants?.length ?? 0
    // 如果图片索引在款式数量范围内，选择对应款式
    // 否则重置为未选择状态 (-1)
    selectedCaseIndex.value = imageIndex < count ? imageIndex : -1
  }

  // 返回需要在组件中使用的数据和方法
  return {
    selectedCaseIndex, // 当前选中的款式索引
    selectCase, // 手动选择款式的方法
    syncByImageIndex, // 根据图片索引同步款式的方法
  }
}
