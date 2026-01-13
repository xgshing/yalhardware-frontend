// src/composables/useHomeData.ts
import { ref } from 'vue'
import type {
  Product,
  CategoryProducts,
  CardData,
  CommitmentItem,
  BannerItem,
  HomeData,
} from '@/types'

import { frontendService, adminService } from '@/services'

export const useHomeData = () => {
  /* ==================== 响应式数据状态定义 ==================== */
  const productsByCategory = ref<CategoryProducts>({})
  const products = ref<Product[]>([])
  const commitments = ref<CommitmentItem[]>([])
  const cardsData = ref<(CardData & { imageUrl: string })[]>([])
  const carouselData = ref<(BannerItem & { imageUrl: string })[]>([])
  const recommendedProducts = ref<Product[]>([])

  /* ==================== 重置函数 ==================== */
  const reset = () => {
    productsByCategory.value = {}
    products.value = []
    commitments.value = []
    cardsData.value = []
    carouselData.value = []
    recommendedProducts.value = []
  }

  /* ===================== 工具函数（只在本文件内部用） ===================== */
  const getFirstImage = (images?: any[]): string => {
    if (!images || !images.length) return ''

    const img = images[0]

    if (img.image) return img.image
    return ''
  }
  /* ==================== 核心数据加载函数 ==================== */
  /**
   * 加载首页所需的所有数据（并行请求）
   * @returns Promise<HomeData> 包含所有原始数据的对象
   * @throws 如果任一请求失败，会重置数据并抛出错误
   */
  const load = async (): Promise<HomeData> => {
    try {
      const [categoryProducts, allProducts, stories, features, banners] =
        await Promise.all([
          frontendService.fetchCategoryProducts(),
          frontendService.fetchAllProducts(),
          adminService.fetchStories(),
          adminService.fetchFeatures(),
          adminService.fetchBanners(),
        ])

      productsByCategory.value = categoryProducts
      products.value = allProducts

      // ===== 品牌理念 =====
      commitments.value = stories

      // ===== 核心卖点 =====
      cardsData.value = features.map((f) => ({
        ...f, // 展开原始对象
        imageUrl: getFirstImage(f.images), // 添加提取的图片URL
      }))

      // ===== 轮播图 =====
      carouselData.value = banners.map((b) => ({
        ...b,
        imageUrl: getFirstImage(b.images),
      }))

      // ===== 推荐产品 =====
      recommendedProducts.value = allProducts
        .filter((p) => p.is_featured)
        .slice(0, 4)

      // 返回原始API数据，供调试或特殊使用
      return {
        categoryProducts,
        allProducts,
        stories,
        features,
        banners,
      }
    } catch (error) {
      reset()
      throw error
    }
  }

  // 返回组合式函数的公共接口
  return {
    /* state */
    productsByCategory,
    products,
    commitments,
    cardsData,
    carouselData,
    recommendedProducts,

    /* actions */
    load,
    reset,
  }
}
