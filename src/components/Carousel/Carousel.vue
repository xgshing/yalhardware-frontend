<!-- src/components/Carousel/Carousel.vue -->
<template>
  <Carousel
    ref="carouselRef"
    :autoplay="duration"
    :wrap-around="true"
    :touch-drag="true"
    :mouse-drag="true"
    :transition="speed"
    @init="onCarouselInit"
    @slide-click="onSlideClick"
    v-model="currentSlide"
  >
    <Slide
      v-for="(slide, index) in props.slides"
      :key="index"
    >
      <!-- 这里放入你的轮播项内容，例如图片 -->
      <img
        :src="slide.imageUrl"
        :alt="slide.title"
        class="carousel_item"
      />
      <div class="img_info">
        <h1 class="img_title">{{ slide.title }}</h1>
        <p class="img_content">{{ slide.content }}</p>
      </div>
      <!-- 你也可以在这里放任何自定义的HTML结构 -->
    </Slide>

    <!-- 添加导航组件 -->
    <template #addons>
      <CarouselIndicators
        :slides="props.slides"
        :currentSlide="currentSlide"
        :onSelect="goTo"
        :speed="duration"
      />
    </template>
  </Carousel>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
  import 'vue3-carousel/dist/carousel.css' // 引入默认样式
  import CarouselIndicators from './CarouselIndicators.vue'

  // 接收来自父组件的参数，与你原来的 props 兼容
  const props = defineProps({
    slides: Array,
    duration: { type: Number, default: 3000 }, // 自动播放间隔
    speed: { type: Number, default: 1000 }, // 切换动画时长
  })

  const currentSlide = ref(0)
  const carouselRef = ref(null)

  // 组件事件示例
  const onCarouselInit = (carouselInstance) => {}

  const onSlideClick = (index) => {
    // 这里可以处理点击事件，例如跳转链接
  }

  // 跳转到指定幻灯片
  const goTo = (index) => {
    if (carouselRef.value) {
      carouselRef.value.slideTo(index)
      currentSlide.value = index
    }
  }
</script>

<style scoped>
  /* 你可以在这里覆盖默认样式 */
  .carousel_item {
    position: relative;
    width: 100%;
    height: 450px;
    border-radius: 10px;
    object-fit: cover;
    /* 保证图片自适应容器 */
  }

  .img_info {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0 0 60px 60px;
    z-index: 2;
    /* 在图片上层 */
  }

  .img_title {
    width: 40%;
    color: white;
    font-size: 3rem;
  }

  .img_content {
    width: 20%;
    color: white;
    font-size: 1.1rem;
  }

  /* 深度选择器可用于修改组件内部的样式 */
  :deep(.carousel__pagination-button) {
    background-color: #ccc;
  }

  :deep(.carousel__pagination-button--active) {
    background-color: #007bff;
  }
</style>
