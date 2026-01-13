// src/composables/product/useProductGallery.ts
import { ref } from 'vue'
import type { Swiper as SwiperType } from 'swiper/types'

/**
 * 产品图片组合式函数
 * 用于管理产品详情页中的图片展示、轮播和灯箱功能
 */
export function useProductGallery() {
  const mainSwiper = ref<SwiperType | null>(null) // 主轮播图 Swiper 实例
  const thumbSwiper = ref<SwiperType | null>(null) // 缩略图轮播 Swiper 实例

  const activeIndex = ref(0) // 当前激活的图片索引
  const lightboxVisible = ref(false) // 灯箱（大图预览）显示状态

  /**
   * 主轮播图 Swiper 实例初始化回调
   * @param swiper - Swiper 实例
   */
  const onMainSwiper = (swiper: SwiperType) => {
    mainSwiper.value = swiper
  }

  /**
   * 缩略图轮播 Swiper 实例初始化回调
   * @param swiper - Swiper 实例
   */
  const onThumbSwiper = (swiper: SwiperType) => {
    thumbSwiper.value = swiper
  }

  /**
   * 打开灯箱（大图预览）
   */
  const openLightbox = () => {
    lightboxVisible.value = true
  }

  /**
   * 同步主轮播图和缩略图到指定索引
   * 当点击缩略图或切换图片时调用
   * @param index - 目标图片索引
   */
  const syncToIndex = (index: number) => {
    // 更新当前激活的图片索引
    activeIndex.value = index
    // 将主轮播图滑动到指定索引
    mainSwiper.value?.slideTo(index)
    // 将缩略图轮播滑动到对应位置，保持同步
    thumbSwiper.value?.slideTo(index)
  }

  // 返回所有需要在组件中使用的数据和方法
  return {
    mainSwiper,
    thumbSwiper,
    activeIndex,
    lightboxVisible,
    onMainSwiper,
    onThumbSwiper,
    openLightbox,
    syncToIndex,
  }
}
