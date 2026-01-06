<!-- src/components/SimilarProducts.vue -->
<template>
  <div class="similar-products">
    <!-- 左侧标题区域 -->
    <div class="products-header">
      <p class="subtitle">{{ subtitle }}</p>
      <h2 class="title">{{ title }}</h2>
      <div
        class="view-collection"
        @click="handleViewCollection"
      >
        {{ viewText }}
      </div>
    </div>

    <!-- 右侧轮播区域 -->
    <div class="products-container">
      <Swiper
        class="products-swiper"
        :slides-per-view="slidesPerView"
        :space-between="12"
        @swiper="handleSwiperInit"
        @slide-change="handleSlideChange"
      >
        <SwiperSlide
          v-for="product in products"
          :key="product.id"
          class="product-slide"
        >
          <ProductCard
            class="similar-product"
            :product-data="product"
            :current-image="getPrimaryImage(product)"
            @product-click="handleProductClick"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>

  <!-- 控制区域（Progress + Arrow） -->
  <CarouselControls
    :total="products.length"
    :per-view="slidesPerView"
    :current-index="currentIndex"
    @update:index="onIndexUpdate"
    @prev="onPrev"
    @next="onNext"
  />
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import type { Swiper as SwiperInstance } from 'swiper'
  import 'swiper/css'

  import ProductCard from '@/components/ProductCard.vue'
  import CarouselControls from '@/components/CarouselControls.vue'
  import type { Product, SimilarProductsProps } from '@/types/frontend/product'

  import { getPrimaryImage } from '@/utils/images'
  /* ---------------- props / emits ---------------- */

  const props = withDefaults(defineProps<SimilarProductsProps>(), {
    title: 'You May Also Like',
    subtitle: 'Featured Items',
    viewText: 'VIEW COLLECTION',
    products: () => [],
  })

  const emit = defineEmits<{
    (e: 'product-click', product: Product): void
    (e: 'view-collection'): void
  }>()

  /* ---------------- swiper state ---------------- */

  const swiper = ref<SwiperInstance | null>(null)
  const currentIndex = ref(0)

  /* ---------------- responsive ---------------- */

  const slidesPerView = computed(() => {
    if (window.innerWidth < 768) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  })

  /* ---------------- swiper handlers ---------------- */

  const handleSwiperInit = (instance: SwiperInstance) => {
    swiper.value = instance
    currentIndex.value = instance.activeIndex
  }

  const handleSlideChange = (instance: SwiperInstance) => {
    currentIndex.value = instance.activeIndex
  }

  /* ---------------- controls handlers ---------------- */

  const onIndexUpdate = (index: number) => {
    swiper.value?.slideTo(index)
  }

  const onPrev = () => {
    swiper.value?.slidePrev()
  }

  const onNext = () => {
    swiper.value?.slideNext()
  }

  /* ---------------- business events ---------------- */

  const handleProductClick = (product: Product) => {
    emit('product-click', product)
  }

  const handleViewCollection = () => {
    emit('view-collection')
  }
</script>

<style scoped>
  .similar-products {
    display: flex;
    width: 100%;
    margin-top: 40px;
  }

  /* header */
  .products-header {
    width: 20%;
    padding: 40px;
    background: #eee9e9;
    border-radius: 12px;
    margin-right: 15px;
  }

  .subtitle {
    font-size: 14px;
    color: #7b5a43;
    margin: 0;
  }

  .title {
    font-size: 32px;
    font-weight: 500;
    margin: 0;
    padding: 0;
  }

  .view-collection {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    cursor: pointer;
    background-color: #818080;
    width: 250px;
    height: 60px;
    border-radius: 5px;
    margin-top: 300px;
  }

  /* swiper */
  .products-container {
    flex: 1;
  }

  .similar-product {
    height: 550px;
    background-color: #eee9e9;
  }

  /* responsive */
  @media (max-width: 768px) {
    .similar-products {
      flex-direction: column;
    }

    .products-header {
      width: 100%;
      margin-bottom: 24px;
    }
  }
</style>
