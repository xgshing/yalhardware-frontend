// src/composables/product/useProduct.ts
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { frontendService } from '@/services'
import type { Product } from '@/types'

/**
 * 产品详情组合式函数
 * 用于管理产品详情页面的数据逻辑,最终返回所有需要在组件中使用的数据和方法
 */
export function useProduct() {
  const route = useRoute()

  const productData = ref<Product | null>(null) // 当前产品数据
  const images = ref<string[]>([]) // 产品图片数组
  const categoryProductsMap = ref<Record<string, Product[]>>({}) // 按分类组织的产品映射

  // 计算属性
  const productId = computed(() => Number(route.params.id))
  const category = computed(() =>
    typeof route.params.category === 'string'
      ? route.params.category // 如果路由参数是字符串，直接使用
      : 'All Products'
  )

  // 产品名称计算属性，如果产品数据不存在则返回默认值
  const productName = computed(() => productData.value?.name ?? 'Product')

  /**
   * 加载产品数据
   * 根据产品ID获取产品详情和图片
   */
  const loadProduct = async () => {
    if (!productId.value) return
    const product = await frontendService.fetchProductById(productId.value)
    productData.value = product

    images.value = product.allImages
  }

  /**
   * 相似产品计算属性
   * 返回同一分类下的其他产品（排除当前产品）
   */
  const similarProducts = computed(() => {
    // 获取当前分类的产品列表，如果不存在则使用空数组
    const list = categoryProductsMap.value[category.value] || []
    // 过滤掉当前产品
    return list.filter((p) => p.id !== productData.value?.id)
  })

  // 监听路由参数ID的变化，自动加载产品数据
  watch(() => route.params.id, loadProduct, { immediate: true })

  // 返回所有需要在组件中使用的数据和方法
  return {
    productData,
    images,
    productName,
    category,
    similarProducts,
    loadProduct,
    categoryProductsMap,
  }
}
