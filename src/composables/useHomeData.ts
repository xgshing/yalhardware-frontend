// src/composables/useHomeData.ts
import { ref } from 'vue'
import type {
  Product,
  CategoryProducts,
  CardData,
  CommitmentItem,
  BannerItem,
  HomeData,
} from '@/types/frontend/product'

import { frontendService, adminService } from '@/services'

export const useHomeData = () => {
  /* ==================== state ==================== */
  const productsByCategory = ref<CategoryProducts>({})
  const products = ref<Product[]>([])
  const commitments = ref<CommitmentItem[]>([])
  const cardsData = ref<(CardData & { imageUrl: string })[]>([])
  const carouselData = ref<(BannerItem & { imageUrl: string })[]>([])
  const recommendedProducts = ref<Product[]>([])

  /* ==================== reset ==================== */
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

    if (img.image_url) return img.image_url
    return ''
  }
  /* ==================== load ==================== */
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
        ...f,
        imageUrl: getFirstImage(f.images),
      }))

      // ===== 轮播图 =====
      carouselData.value = banners.map((b) => ({
        ...b,
        imageUrl: getFirstImage(b.images),
      }))

      recommendedProducts.value = allProducts
        .filter((p) => p.is_featured)
        .slice(0, 4)

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
