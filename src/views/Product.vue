<!-- src/views/product/ProductDetail.vue -->
<template>
  <div class="product-container">
    <NavBar />

    <!-- ================= 导航 ================= -->
    <nav class="breadcrumb">
      <p
        class="nav-link"
        @click="goToHome"
      >
        Home
      </p>
      <!-- 分隔符 -->
      <p class="separator"></p>
      <p
        class="nav-link"
        @click="goToCategory"
      >
        {{ category }}
      </p>
      <p class="separator"></p>
      <p class="current">{{ productName }}</p>
    </nav>

    <!-- ================= 产品主区域 ================= -->
    <div class="product-details">
      <!-- ========== 产品图片展示区 ========= -->
      <div class="product-gallery">
        <!-- 主轮播图：显示大图，支持导航和分页 
         navigation 左右箭头导航 
         pagination 可点击的分页点
         effect="fade"切换效果：淡入淡出
         -->
        <Swiper
          :modules="modules"
          :navigation="true"
          :pagination="{ clickable: true }"
          effect="fade"
          class="main-swiper"
          @swiper="onMainSwiper"
          @slide-change="handleSlideChange"
        >
          <!-- 遍历所有产品图片 
           loading="lazy" 懒加载
           -->
          <SwiperSlide
            v-for="(img, i) in images"
            :key="i"
          >
            <img
              :src="img"
              class="main-image"
              loading="lazy"
              @click="openLightbox"
            />
          </SwiperSlide>
        </Swiper>

        <!-- 缩略图轮播：自由模式，可滑动选择 
        slides-per-view="5"同时显示5个缩略图
        space-between="12"缩略图间距 
        free-mode自由滑动模式
        watch-slides-progress监听幻灯片进度
        -->
        <Swiper
          :modules="[FreeMode]"
          :slides-per-view="5"
          :space-between="12"
          free-mode
          watch-slides-progress
          class="thumbnail-swiper"
          @swiper="onThumbSwiper"
        >
          <!-- 缩略图列表 
          @click="syncToIndex(i)"点击缩略图同步主图 
          class="{ active: activeIndex === i }高亮当前激活的缩略图
          -->
          <SwiperSlide
            v-for="(img, i) in images"
            :key="i"
            @click="syncToIndex(i)"
          >
            <div
              class="thumbnail-container"
              :class="{ active: activeIndex === i }"
            >
              <img
                :src="img"
                class="thumbnail-image"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- 灯箱/大图预览组件 
       visible="lightboxVisible"控制显示/隐藏
       imgs="images"图片列表
       -->
      <vue-easy-lightbox
        :visible="lightboxVisible"
        :imgs="images"
        :index="activeIndex"
        @hide="lightboxVisible = false"
      />

      <!-- ========== 产品信息区 ========= -->
      <div class="product-info">
        <h1>{{ productName }}</h1>
        <p class="price">${{ productData?.price }}</p>
        <p class="shipping">Shipping calculated at checkout.</p>
        <p class="reviews">{{ productData?.reviews }}</p>

        <!-- 产品选择容器（颜色选择+数量选择） -->
        <div class="product-choose-container">
          <!-- 颜色/款式选择 -->
          <div class="case-type">
            <div class="type-title">Case Color:</div>
            <!-- 遍历产品款式（如不同颜色） -->
            <div
              v-for="(v, i) in productData?.variants || []"
              :key="v.id"
              class="case-chip"
              :class="{ selected: selectedCaseIndex === i }"
              @click="handleSelectCase(i)"
            >
              {{ v.style_name }}
            </div>
          </div>

          <!-- 数量选择器 -->
          <div class="order-row">
            <div class="quantity-title">Quantity:</div>
            <div class="quantity">
              <button @click="quantity > 1 && quantity--">-</button>
              <!-- 
              数量输入框，限制最小值为1 
              v-model.number="quantity".number修饰符确保数值类型
               -->
              <input
                type="number"
                v-model.number="quantity"
                min="1"
              />
              <button @click="quantity++">+</button>
            </div>
          </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="actions">
          <button
            class="add-to-cart"
            @click="handleAddToCart"
          >
            Add to Cart
          </button>
          <button class="buy-now">Buy it now</button>
        </div>

        <!-- 折叠面板（产品详情、规格等） -->
        <ul class="accordion">
          <!-- 遍历折叠面板项 -->
          <li
            v-for="(item, i) in accordionItems"
            :key="i"
            class="accordion-container"
          >
            <!-- 折叠面板标题区域 -->
            <div
              class="accordion-item"
              @click="toggleAccordion(i)"
            >
              <p class="item-title">{{ item.title }}</p>
              <span>{{ item.isOpen ? '↑' : '↓' }}</span>
            </div>
            <div
              v-show="item.isOpen"
              class="accordion-body"
            >
              {{ getAccordionContent(item) }}
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- 相似产品推荐区域 -->
    <SimilarProducts
      :products="similarProducts"
      title="You May Also Like"
      subtitle="Featured Items"
      @product-click="handleProductClick"
    />
  </div>
</template>

<script setup lang="ts">
  /* ================= 核心依赖 ================= */
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  /* ================= 组件导入 ================= */
  import NavBar from '@/components/NavBar.vue'
  import SimilarProducts from '@/components/SimilarProducts.vue'
  import VueEasyLightbox from 'vue-easy-lightbox'

  /* ================= Swiper轮播相关 ================= */
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { Navigation, Pagination, FreeMode } from 'swiper/modules'
  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import 'swiper/css/free-mode'

  /* ================= 组合式函数导入 ================= */
  import { useProduct } from '@/composables/product/useProduct'
  import { useProductGallery } from '@/composables/product/useProductGallery'
  import { useProductVariants } from '@/composables/product/useProductVariants'
  import { useProductCart } from '@/composables/product/useProductCart'
  import { useAccordion } from '@/composables/product/useAccordion'

  /* ================= API服务 ================= */
  import { frontendService } from '@/services'

  /* ================= 初始化 ================= */
  const router = useRouter()
  const modules = [Navigation, Pagination] // Swiper模块配置

  /* 产品数据逻辑 */
  const {
    productData, // 产品数据
    images, // 产品图片数组
    productName, // 产品名称
    category, // 产品分类
    similarProducts, // 相似产品列表
    categoryProductsMap, // 分类产品映射
  } = useProduct()

  /* 图片展示逻辑 */
  const {
    mainSwiper, // 主轮播图实例
    activeIndex, // 当前激活的图片索引
    lightboxVisible, // 灯箱显示状态
    onMainSwiper, // 主轮播图初始化回调
    onThumbSwiper, // 缩略图轮播初始化回调
    openLightbox, // 打开灯箱方法
    syncToIndex, // 同步到指定索引方法
  } = useProductGallery()

  /* 产品款式逻辑 */
  const { selectedCaseIndex, selectCase, syncByImageIndex } =
    useProductVariants(() => productData.value) // 传入产品数据获取函数

  /* 购物车逻辑 */
  const { addToCart } = useProductCart()

  /* 折叠面板逻辑 */
  const { accordionItems, toggleAccordion, getAccordionContent } =
    useAccordion(productData) // 传入产品数据

  /* 购买数量 */
  const quantity = ref(1) // 默认数量为1

  /* ================= 事件处理函数 ================= */
  /**
   * 处理主轮播图幻灯片切换
   */
  const handleSlideChange = () => {
    const index = mainSwiper.value?.realIndex ?? 0 // 获取当前真实索引
    syncToIndex(index) // 同步图片展示索引
    syncByImageIndex(index) // 同步款式选择
  }

  /**
   * 处理颜色/款式选择
   * @param index - 选中的款式索引
   */
  const handleSelectCase = (index: number) => {
    selectCase(index) // 选择款式
    syncToIndex(index) // 同步图片到对应索引
  }

  /**
   * 处理加入购物车
   */
  const handleAddToCart = () => {
    if (!productData.value) return // 产品数据不存在时返回
    addToCart(productData.value, quantity.value, selectedCaseIndex.value)
  }

  /* ================= 路由导航 ================= */
  const goToHome = () => router.push({ name: 'home' })
  const goToCategory = () =>
    router.push({
      name: 'product-categories',
      query: { category: category.value },
    })

  /**
   * 处理相似产品点击
   * @param p - 点击的产品对象
   */
  const handleProductClick = (p: any) => {
    router.push({
      name: 'product-detail',
      params: { category: category.value, id: p.id }, // 传递分类和产品ID
    })
  }

  /* ================= 组件挂载初始化 ================= */
  onMounted(async () => {
    // 加载分类产品数据
    categoryProductsMap.value = await frontendService.fetchCategoryProducts()
  })
</script>

<style scoped>
  /* 页面主容器 */
  .product-container {
    padding: 0 30px;
    margin: 0 auto;
  }

  /* ==================== 链接导航 ====================  */
  /* 面包屑导航容器 */
  .breadcrumb {
    display: flex;
    gap: 8px;
    align-items: center;
    color: #666;
  }

  /* 分隔符样式 */
  .separator {
    width: 1.6rem;
    height: 0.05rem;
    background-color: #333;
    margin: 0.2rem;
  }

  /* 导航链接基础样式 */
  .nav-link {
    position: relative;
    /* 为下划线伪元素提供定位上下文 */
    cursor: pointer;
    padding-bottom: 3px;
    /* 为下划线预留空间 */
    transition: color 0.3s;
    /* 文字颜色过渡动画 */
  }

  /* 
  导航链接下划线效果（使用伪元素实现）
  功能：创建动态下划线，悬停时从左向右消失
*/
  .nav-link::after {
    content: '';
    /* 必须内容，用于显示伪元素 */
    position: absolute;
    /* 绝对定位，相对于.nav-link */
    width: 100%;
    /* 下划线宽度与文字等宽 */
    height: 1px;
    bottom: 0;
    left: 0;
    /* 从左开始 */
    background-color: #333;
    transition: transform 0.5s ease;
    /* 下划线变换动画（0.5秒缓动） */
    transform: scaleX(1);
    /* 初始状态：完全显示 */
    transform-origin: left center;
    /* 变换原点：从左侧开始 */
  }

  /* 
  导航链接悬停状态
  功能：鼠标悬停时改变文字颜色和下划线状态
*/
  .nav-link:hover {
    color: #007bff;
    /* 悬停时文字颜色变为蓝色 */
  }

  /* 
  导航链接悬停时的下划线动画
  功能：下划线从左侧开始向右收缩，实现向左消失效果
*/
  .nav-link:hover::after {
    transform: scaleX(0);
    /* 水平缩放为0，实现消失效果 */
    transform-origin: right center;
    /* 变换原点改为右侧，实现从左向右消失 */
  }

  /* ========================== 产品图片展示（左）+产品介绍及下单（右） ========================== */
  .product-details {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  /* == 产品图片展示（左） == */
  /* 产品图片画廊容器 */
  .product-gallery {
    width: 50%;
  }

  /* 主图Swiper容器样式 */
  .main-swiper {
    width: 100%;
    height: 600px;
    margin-bottom: 20px;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    cursor: grab;
    /* 鼠标光标为抓取手型 */
  }

  /* 主图Swiper激活状态（正在拖拽） */
  .main-swiper:active {
    cursor: grabbing;
    /* 鼠标光标为抓取中手型 */
  }

  /* 主图容器样式 */
  .main-image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f8f8;
  }

  /* 主图图片样式 */
  .main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 填充模式：保持比例填充，可能裁剪边缘 */
  }

  /* 缩略图Swiper容器 */
  .thumbnail-swiper {
    width: 100%;
    height: auto;
    padding: 5px 0;
    /* 改为自动高度 */
  }

  .thumbnail-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* ⭐ 关键：宽度:高度=1:1，自动保持正方形 */
    padding: 4px;
    border: 2px solid transparent;
    border-radius: 6px;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #e8e8e8;
    opacity: 0.5;
    /* 整体透明度 */
  }

  /* 缩略图容器悬停状态 */
  .thumbnail-container:hover {
    border-color: #bfa48f;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
    opacity: 0.8;
    /* 整体透明度 */
  }

  /* 缩略图容器激活状态（当前选中） */
  .thumbnail-container.active {
    border-color: #7b5a43;
    background: #fffaf7;
    opacity: 1;
    /* 整体透明度 */
  }

  /* 缩略图图片样式 */
  .thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }

  /* 
  深度选择器（:deep()）用于穿透scoped样式
  功能：修改Swiper组件内部的样式
*/
  /* 自定义Swiper导航按钮样式 */
  :deep(.swiper-button-next),
  :deep(.swiper-button-prev) {
    color: #333;
    /* 箭头颜色深灰色 */
    background: rgba(255, 255, 255, 0.8);
    /* 半透明白色背景 */
    width: 40px;
    height: 40px;
    border-radius: 50%;
    /* 圆形按钮 */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  /* 导航按钮内部伪元素（箭头图标） */
  :deep(.swiper-button-next)::after,
  :deep(.swiper-button-prev)::after {
    font-size: 20px;
    /* 箭头图标大小20px */
    font-weight: bold;
  }

  /* Swiper分页器小圆点样式 */
  :deep(.swiper-pagination-bullet) {
    background: rgba(255, 255, 255, 0.8);
    opacity: 0.7;
  }

  /* Swiper分页器激活状态小圆点样式 */
  :deep(.swiper-pagination-bullet-active) {
    background: #ff4444;
    opacity: 1;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .main-swiper {
      height: 400px;
    }

    .thumbnail-swiper {
      height: 80px;
    }
  }

  @media (max-width: 480px) {
    .main-swiper {
      height: 300px;
    }

    .thumbnail-swiper {
      height: 60px;
    }
  }

  /* 缩略图行 */
  .thumbs {
    display: flex;
    gap: 10px;
    margin-top: 12px;
    overflow-x: auto;
    padding-bottom: 8px;
    -webkit-overflow-scrolling: touch;
  }

  /* == 产品图片展示（左） == */
  /* 右侧信息区 */
  .product-info {
    width: 50%;
    padding-top: 8px;
  }

  .price {
    font-size: 20px;
    font-weight: 700;
    margin-top: 6px;
    margin-bottom: 8px;
  }

  .reviews {
    color: #b36a3a;
    margin-bottom: 12px;
  }

  /* 产品选择容器*/
  .product-choose-container {
    background: #eee9e9;
    padding: 30px;
  }

  /* 款式选择区域样式 */
  .case-type {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 14px 0;
  }

  .type-title {
    display: block;
    width: 100%;
    /* 占满整行宽度  */
  }

  /* 标签基础样式 */
  .case-chip {
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid white;
    cursor: pointer;
    background-color: white;
  }

  /* 标签悬停状态 */
  .case-chip:hover {
    border-color: #bfa48f;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
  }

  /* 标签选中状态 */
  .case-chip.selected {
    border-color: #7b5a43;
    background: #fffaf7;
  }

  /* == 数量选择器 == */
  /* 数量选择器所在行 */
  .order-row {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 18px;
  }

  /* 数量选择器容器 */
  .quantity {
    display: flex;
    width: 20%;
    align-items: center;
    gap: 6px;
    background-color: white;
    padding: 6px;
    border-radius: 8px;
  }

  /* 数量选择器按钮样式 */
  .quantity button {
    width: 34px;
    height: 34px;
    border: none;
    background: white;
    cursor: pointer;
    font-size: 18px;
    border-radius: 6px;
  }

  /* 数量输入框样式 */
  .quantity input {
    width: 64px;
    text-align: center;
    border: none;
    outline: none;
    font-size: 14px;
  }

  /* 操作按钮区域样式 */
  .actions {
    display: flex;
    margin-top: 30px;
    gap: 8px;
  }

  /* 加入购物车按钮样式 */
  .add-to-cart {
    width: 50%;
    border-radius: 8px;
    border: 1px solid #bfa48f;
    background: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .add-to-cart:hover {
    background: #7b5a43;
    color: white;
  }

  /* 立即购买按钮样式 */
  .buy-now {
    width: 50%;
    padding: 20px 0;
    border-radius: 8px;
    background: #333;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .buy-now:hover {
    background-color: black;
  }

  /* ========================== 产品描述样式设置 ========================== */
  /* 折叠面板容器样式 */
  .accordion {
    margin-top: 80px;
  }

  /* 折叠面板容器 */
  .accordion-container {
    position: relative;
    overflow: hidden;
    /* 用box-shadow创建不会影响布局的边框 */
    box-shadow:
      inset 0 1px 0 #ddd,
      /* 上边框 */ inset 0 -1px 0 #ddd;
    /* 下边框 */
    /* 或者用outline: 1px solid #ddd; outline-offset: -1px; */
  }

  /* 每个元素都有独立完整的边框，不会相互影响 */

  /* 动画线条 */
  .accordion-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    /* 比默认边框厚，确保覆盖 */
    background-color: #666;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 2;
  }

  .accordion-container::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #666;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: 2;
  }

  .accordion-container:hover::before,
  .accordion-container:hover::after {
    transform: scaleX(1);
  }

  .accordion-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
  }

  .item-title {
    font-size: 1.5rem;
  }

  /* 折叠面板内容区域样式 */
  .accordion-body {
    padding: 10px 30px;
    color: #666;
    line-height: 1.6;
  }

  /* ========================== 相似产品样式 ========================== */
  /* 相似产品根容器样式 */
  .about-root {
    display: flex;
    width: 100%;
    gap: 20px;
    padding: 20px;
    box-sizing: border-box;
    /* 盒模型：包含padding和border */
  }

  /* 左侧区域样式 */
  .left-col {
    width: 25%;
    /* 占据25%宽度 */
    background: #bfa48f;
    padding: 16px;
    border-radius: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
  }

  /* 右侧区域样式 */
  .right-col {
    width: 75%;
    /* 占据75%宽度 */
  }

  /* Swiper容器样式 */
  .products-swiper {
    width: 100%;
    /* 宽度100% */
    box-sizing: border-box;
    /* 盒模型：包含padding和border */
  }

  /* 幻灯片样式 */
  .product-slide {
    display: flex;
  }

  /* 产品卡片样式 */
  .product-card {
    background: #fff;
    border-radius: 10px;
    overflow: hidden;
    padding: 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  /* 产品图片样式 */
  .product-card img {
    width: 100%;
    height: 280px;
    object-fit: cover;
    border-radius: 8px;
  }

  /* 产品元信息区域样式 */
  .pc-meta {
    padding-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 产品标题样式 */
  .pc-title {
    font-size: 14px;
    line-height: 1.2;
    flex: 1;
    margin-right: 8px;
    overflow: hidden;
    height: 2.4em;
  }

  /* 产品价格样式 */
  .pc-price {
    color: #007aff;
    font-weight: 700;
  }

  /* ==========================滑块控制区域 外部控制（进度条+箭头按钮）========================== */
  /* 滚动条容器样式 */
  .controls-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
  }

  /* 箭头按钮样式 */
  .arrow-btn {
    min-width: 38px;
    height: 34px;
    background: #111;
    color: #fff;
    border: none;
    /* 无边框 */
    border-radius: 8px;
    cursor: pointer;
    font-size: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  /* 箭头按钮禁用状态样式 */
  .arrow-btn:disabled {
    opacity: 0.35;
    /* 降低透明度至35% */
    cursor: not-allowed;
    /* 鼠标指针为禁止符号 */
  }

  /* 进度条轨道样式 */
  .scroll-track {
    flex: 1;
    /* 占据剩余空间 */
    height: 10px;
    background: rgba(0, 0, 0, 0.06);
    border-radius: 999px;
    /* 圆形两端（大圆角） */
    position: relative;
    /* 相对定位（为滑块提供定位上下文） */
    overflow: hidden;
    /* 隐藏溢出内容 */
  }

  /* 滑块样式 */
  .scroll-thumb {
    position: absolute;
    /* 绝对定位（相对于轨道） */
    left: 0;
    /* 初始左侧位置为0 */
    top: 0;
    /* 顶部对齐 */
    height: 100%;
    /* 高度100%（填满轨道高度） */
    background: linear-gradient(90deg, #007aff, #00b7ff);
    /* 蓝色渐变背景 */
    border-radius: 999px;
    /* 圆形两端（大圆角） */
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    touch-action: none;
    /* 禁用触摸动作（避免与浏览器默认冲突） */
    cursor: grab;
    /* 可抓取光标 */
    will-change: transform;
    /* 性能优化：提示浏览器transform会变化 */
  }

  /* 滑块激活状态（正在拖拽） */
  .scroll-thumb:active {
    cursor: grabbing;
  }

  /* ========================== 响应式设计：在小屏幕上调整导航样式 ========================== */
  /* 屏幕宽度小于900px时的样式 */
  @media (max-width: 900px) {
    .about-root {
      flex-direction: column;
      /* 垂直排列（左侧在上，右侧在下） */
    }

    .left-col {
      width: 100%;
      /* 宽度100% */
    }

    .right-col {
      width: 100%;
      /* 宽度100% */
      margin-top: 12px;
      /* 上外边距12px */
    }
  }

  /* 平板设备（最大宽度768px）导航调整 */
  @media (max-width: 768px) {
    .link-page {
      font-size: 12px;
      gap: 6px;
      flex-wrap: wrap;
      /* 允许换行显示 */
    }

    .nav-link {
      padding-bottom: 2px;
      /* 调整下划线间距 */
    }

    .nav-link::after {
      height: 1px;
      /* 小屏幕使用更细的下划线 */
    }
  }
</style>
