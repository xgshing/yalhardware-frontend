<!-- src/views/Product.vue -->
<!-- 产品详情页 -->
<!-- Product.vue - 完整实现说明：
  从 route.params (category, id) 获取当前产品
  构建 images 数组：优先 casetype.images，再附加 detailImages
  支持缩略图切换、左右箭头、触摸滑动、鼠标拖拽
 -->
<template>
  <!-- 根容器 -->
  <div class="product-container">
    <!-- 直接使用导航栏组件，不需要传递数据 -->
    <NavBar />

    <!-- ============ 链接导航 ============ -->
    <nav class="breadcrumb">
      <!-- Home链接，点击跳转到首页 -->
      <p
        class="nav-link"
        @click="goToHome"
      >
        Home
      </p>
      <p class="separator"></p>
      <!-- 分隔符 -->
      <p
        class="nav-link"
        @click="goToCategory"
      >
        {{ category }}
      </p>
      <!-- 分类链接，点击跳转到对应分类页 -->
      <p class="separator"></p>
      <p class="current">{{ productName }}</p>
      <!-- 当前产品名称 -->
    </nav>

    <!-- ============ 产品图片展示（左）+产品介绍及下单（右） ============ -->
    <div class="product-details">
      <!-- ============ 产品图片展示（左） ============ -->
      <!-- 产品图片展示 LEFT: 图片展示区（占 50%） -->
      <div class="product-gallery">
        <!-- 主图区域 -->
        <!--
          Swiper 主容器 - 核心轮播组件
          关键配置说明： 
          :modules="modules" - 绑定Swiper功能模块数组
          :space-between="0" - 幻灯片间距为0，确保图片无缝衔接
          :navigation="true" - 启用左右导航箭头按钮，用户可以点击切换
          :pagination="{ clickable: true }" - 启用底部小圆点分页器，可点击跳转
          :loop="false" - 禁用无限循环模式，幻灯片到末尾后停止
          :effect="'fade'" - 切换效果为淡入淡出，提升视觉体验
          @swiper="onMainSwiper" - Swiper实例初始化完成时触发的事件
          @slide-change="onMainSlideChange" - 幻灯片切换动画完成时触发的事件
          @mousedown="handleMouseDown" - 监听鼠标按下事件，用于检测拖拽开始
          :style="{ cursor: currentCursor }" - 动态绑定光标样式
        -->
        <Swiper
          :modules="modules"
          :space-between="0"
          :navigation="true"
          :pagination="{ clickable: true }"
          :loop="false"
          :effect="'fade'"
          @swiper="onMainSwiper"
          @slide-change="onMainSlideChange"
          class="main-swiper"
          @mousedown="handleMouseDown"
          :style="{ cursor: currentCursor }"
        >
          <!-- 
            使用 v-for 遍历图片数组生成所有幻灯片
            :key="index" - Vue 列表渲染必需的唯一标识，基于数组索引
            v-for="(image, index) in images" - 遍历images数组，image为图片URL，index为索引
          -->
          <SwiperSlide
            v-for="(image, index) in images"
            :key="index"
          >
            <div class="main-image-container">
              <!-- 
                主图图片元素
                :src="image" - 动态绑定图片源URL
                loading="lazy" - 启用延迟加载优化性能
              -->
              <img
                :src="image"
                class="main-image"
                loading="lazy"
                @click="openLightbox"
              />
            </div>
          </SwiperSlide>
        </Swiper>

        <!-- 缩略图区域 - 展示所有图片的小图，提供快速导航 -->
        <!-- 
          缩略图 Swiper 容器
          关键配置说明：
          :modules="[FreeMode]" - 只使用自由模式模块
          :slides-per-view="5" - 默认显示5张缩略图
          :space-between="10" - 缩略图之间有10px间距
          :centered-slides="false" - 不居中显示幻灯片
          :free-mode="true" - 启用自由滚动模式，可任意拖动
          :watch-slides-progress="true" - 监听幻灯片滚动进度
          :breakpoints="thumbnailBreakpoints" - 响应式断点配置
          @swiper="onThumbSwiper" - 缩略图Swiper实例初始化事件
        -->
        <Swiper
          :modules="[FreeMode]"
          :slides-per-view="5"
          :space-between="10"
          :centered-slides="false"
          :free-mode="true"
          :watch-slides-progress="true"
          :breakpoints="thumbnailBreakpoints"
          @swiper="onThumbSwiper"
          class="thumbnail-swiper"
        >
          <!-- 
            缩略图幻灯片
            v-for="(image, index) in images" - 遍历图片数组
            :key="index" - 使用索引作为唯一key
            :class="{ active: activeIndex === index }" - 动态类绑定：当前激活的缩略图高亮显示
            @click="onThumbClick(index)" - 点击事件：点击缩略图切换到对应主图
          -->
          <SwiperSlide
            v-for="(image, index) in images"
            :key="index"
            @click="onThumbClick(index)"
          >
            <!-- 缩略图容器 -->
            <div
              class="thumbnail-container"
              :class="{ active: activeIndex === index }"
            >
              <!-- 缩略图图片 -->
              <img
                :src="image"
                :alt="`缩略图 ${index + 1}`"
                class="thumbnail-image"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <!-- == Lightbox (vue-easy-lightbox)图片查看器(预览大图功能) ==  -->
      <!-- 
        vue-easy-lightbox组件配置：
        :visible="lightboxVisible" - 控制查看器显示/隐藏的布尔值
        :imgs="images" - 要显示的所有图片数组
        :index="currentIndex" - 当前显示的图片索引
        @hide="lightboxVisible = false" - 隐藏查看器时触发的事件
      -->
      <vue-easy-lightbox
        :visible="lightboxVisible"
        :imgs="images"
        :index="activeIndex"
        @hide="lightboxVisible = false"
      />

      <!-- ============ 产品介绍及下单（右） ============ -->
      <!-- 产品下单信息（占 50%） -->
      <div class="product-info">
        <h1>{{ productName }}</h1>
        <p class="price">{{ productData?.price }}</p>
        <p class="shipping">Shipping calculated at checkout.</p>
        <p class="reviews">{{ productData?.reviews }}</p>

        <!-- 产品选择容器（颜色选择+数量选择） -->
        <div class="product-choose-container">
          <!-- Case type（标签）-->
          <div class="case-type">
            <div class="type-title">Case Color:</div>
            <!-- 
              遍历产品规格选项，动态生成可选择的标签
              productData?.casetype || [] - 安全访问，如果casetype不存在则使用空数组
              v-for="(c, idx) in ..." - 遍历每个规格选项
              :key="c.id" - 使用规格的唯一ID作为Vue的key
            -->
            <div
              v-for="(c, idx) in productData?.variants || []"
              :key="c.id"
              class="case-chip"
              :class="{ selected: selectedCaseIndex === idx }"
              @mouseenter="hoverCase = idx"
              @mouseleave="hoverCase = -1"
              @click="selectCase(idx)"
            >
              {{ c.style_name }}
            </div>
          </div>

          <!-- 数量 + 加入购物车 -->
          <div class="order-row">
            <div class="quantity-title">Quantity:</div>
            <!-- 数量控制器 -->
            <div class="quantity">
              <!-- 减少数量按钮 -->
              <button @click="decrease">-</button>
              <!-- 
                数量输入框
                :value="quantity" - 绑定数量值
                @input="normalizeQuantity" - 输入事件处理
                min="1" - 最小数量为1
              -->
              <input
                type="number"
                :value="quantity"
                @input="normalizeQuantity"
                min="1"
              />
              <!-- 增加数量按钮 -->
              <button @click="increase">+</button>
            </div>
          </div>
        </div>

        <!-- 传递购物车数据到Drawer组件 -->
        <div class="actions">
          <!-- 加入购物车按钮 -->
          <button
            @click="addToCartAndOpenDrawer"
            class="add-to-cart"
          >
            Add to Cart
          </button>
          <!-- 立即购买按钮 -->
          <button class="buy-now">Buy it now</button>
        </div>

        <!-- ============ Accordion 折叠面板描述区域 ============ -->
        <div class="accordion">
          <!-- 
            遍历accordionItems数组生成折叠面板
            v-for="(item, index) in accordionItems" - 遍历折叠面板项
            :key="index" - 使用索引作为key
            @click="toggleAccordion(index)" - 点击切换展开/收起状态
          -->
          <li
            v-for="(item, index) in accordionItems"
            :key="index"
            class="accordion-container"
          >
            <!-- 折叠面板项头部 -->
            <div
              class="accordion-item"
              @click="toggleAccordion(index)"
            >
              <p class="item-title">{{ item.title }}</p>
              <!-- 展开/收起箭头 -->
              <span class="arrow">{{ item.isOpen ? '↑' : '↓' }}</span>
            </div>
            <!-- 折叠面板内容区域 -->
            <div
              v-show="item.isOpen"
              class="accordion-body"
            >
              <p>{{ getAccordionContent(item) }}</p>
            </div>
          </li>
        </div>
      </div>
    </div>

    <!-- ============ 展示与该产品相同种类的其它产品 ============ -->
    <!-- 使用相似产品组件 -->
    <SimilarProducts
      :products="similarProducts"
      title="You May Also Like"
      subtitle="Featured Items"
      view-text="View Collection"
      @product-click="handleProductClick"
      @view-collection="handleViewCollection"
    />
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    watch,
    nextTick,
    onBeforeUnmount,
  } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  /* ================= 组件 ================= */
  import NavBar from '@/components/NavBar.vue'
  import SimilarProducts from '@/components/SimilarProducts.vue'
  import VueEasyLightbox from 'vue-easy-lightbox'

  import { useCartStore } from '@/stores/cart'
  /* ================= Swiper ================= */
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import type { Swiper as SwiperType } from 'swiper/types'
  import { Navigation, Pagination, FreeMode } from 'swiper/modules'

  import 'swiper/css'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import 'swiper/css/free-mode'
  import 'swiper/css/effect-fade'

  /* ================= 数据接口 ================= */
  import { frontendService } from '@/services'

  import type { Product } from '@/types/frontend/product'

  /* ================= 路由 ================= */
  const route = useRoute()
  const router = useRouter()

  const category = computed(() => {
    const cat = route.params.category
    return typeof cat === 'string' ? cat : '所有产品'
  })

  const productId = computed(() => Number(route.params.id))

  /* ================= Swiper ================= */
  const modules = [Navigation, Pagination]

  const mainSwiper = ref<SwiperType | null>(null)
  const thumbSwiper = ref<SwiperType | null>(null)

  const activeIndex = ref(0)
  const currentCursor = ref('zoom-in')

  const thumbnailBreakpoints = {
    320: { slidesPerView: 3, spaceBetween: 8 },
    768: { slidesPerView: 4, spaceBetween: 10 },
    1024: { slidesPerView: 5, spaceBetween: 18 },
  }

  /* ================= 产品数据 ================= */
  const productData = ref<Product | null>(null)
  const images = ref<string[]>([])

  const cartStore = useCartStore()
  /* ================= Lightbox ================= */
  const lightboxVisible = ref(false)
  const currentIndex = ref(0)

  const openLightbox = () => {
    lightboxVisible.value = true
  }

  /* ================= Case ================= */
  const selectedCaseIndex = ref(-1)
  const hoverCase = ref(-1)

  /* ================= 数量 ================= */
  const quantity = ref(1)
  const increase = () => quantity.value++
  const decrease = () => quantity.value > 1 && quantity.value--
  const normalizeQuantity = () => {
    if (!Number.isFinite(quantity.value) || quantity.value < 1) {
      quantity.value = 1
    }
  }

  /* ================= Accordion ================= */
  interface AccordionItem {
    title: string
    isOpen: boolean
  }

  const accordionItems = ref<AccordionItem[]>([
    { title: 'Description', isOpen: true },
    { title: 'Specifications', isOpen: true },
    { title: 'Free shipping and Returns', isOpen: true },
  ])

  const toggleAccordion = (index: number) => {
    const item = accordionItems.value[index]
    if (!item) return
    item.isOpen = !item.isOpen
  }

  const getAccordionContent = (item: AccordionItem) => {
    const title = item.title.toLowerCase()

    if (title.includes('free shipping')) {
      return 'Usually ships the same day. Free shipping on orders over $50 in the US and $120 overseas. Returns accepted for 30 days.'
    }

    if (title.includes('description')) {
      return productData.value?.description || '暂无描述'
    }

    if (title.includes('specifications')) {
      return productData.value?.specifications || '暂无规格'
    }

    return ''
  }

  /* ================= 加载产品 ================= */
  const loadProduct = async () => {
    const id = productId.value
    if (!id) return

    const product = await frontendService.fetchProductById(id)
    productData.value = product

    /* ===== 图片优先级：variants.style_image → detail_images.image ===== */
    const imgs: string[] = []

    // 1️⃣ 所有 variants 的款式图
    if (Array.isArray(product.variants)) {
      product.variants.forEach((v) => {
        if (v.style_image) imgs.push(v.style_image)
      })
    }

    // 2️⃣ 所有详情图
    if (Array.isArray(product.detail_images)) {
      product.detail_images.forEach((img) => {
        if (img.image) imgs.push(img.image)
      })
    }

    // 去重（防止相同图片）
    images.value = Array.from(new Set(imgs))

    if (images.value.length === 0) {
      images.value = ['https://via.placeholder.com/600x600?text=No+Image']
    }

    activeIndex.value = 0
    selectedCaseIndex.value = -1
  }

  /* ================= 产品名称 ================= */
  const productName = computed(() => {
    return productData.value?.name ?? 'Product'
  })
  /* ================= 购物车 ================= */
  const addToCartAndOpenDrawer = () => {
    if (!productData.value) return

    const selectedVariant =
      productData.value.variants?.[selectedCaseIndex.value]

    const selectedCaseText = selectedVariant?.style_name ?? 'Default'

    const selectedImage =
      selectedVariant?.style_image ||
      productData.value.detail_images?.[0]?.image ||
      ''

    cartStore.addItem({
      id: productData.value.id,
      name: productData.value.name,
      price: productData.value.price,
      unitPrice: productData.value.price,
      caseType: selectedCaseText,
      image: selectedImage,
      quantity: quantity.value,
    })

    cartStore.openDrawer()
  }

  /* ================= Case 点击 ================= */
  const selectCase = (idx: number) => {
    selectedCaseIndex.value = idx
    // 主图切换到对应款式图
    mainSwiper.value?.slideTo(idx)

    // 同步激活状态
    activeIndex.value = idx
  }

  /* ================= 相似产品 ================= */
  const categoryProductsMap = ref<Record<string, Product[]>>({})

  const similarProducts = computed(() => {
    const list = categoryProductsMap.value[category.value] || []
    return list.filter((p) => p.id !== productData.value?.id)
  })

  /* ================= 导航 ================= */
  const goToHome = () => router.push({ name: 'home' })
  const goToCategory = () =>
    router.push({
      name: 'product-categories',
      query: { category: category.value },
    })

  const handleProductClick = (p: Product) => {
    router.push({
      name: 'product-detail',
      params: { category: category.value, id: p.id },
    })
  }

  const handleViewCollection = () => {
    router.push({
      name: 'ProductCategories',
      query: { category: category.value },
    })
  }

  /* ================= Swiper ================= */
  const onMainSwiper = (swiper: SwiperType) => {
    mainSwiper.value = swiper
  }

  const onThumbSwiper = (swiper: SwiperType) => {
    thumbSwiper.value = swiper
  }

  const onMainSlideChange = () => {
    if (!mainSwiper.value) return

    const index = mainSwiper.value.realIndex
    activeIndex.value = index

    // 同步缩略图
    thumbSwiper.value?.slideTo(index)

    // 🔑 Case 联动逻辑
    const variantsCount = productData.value?.variants?.length ?? 0

    if (index < variantsCount) {
      // 当前是某个 Case 的图片
      selectedCaseIndex.value = index
    } else {
      // 当前不是 Case 图片 → 取消选中
      selectedCaseIndex.value = -1
    }
  }

  const onThumbClick = (index: number) => {
    mainSwiper.value?.slideTo(index)
    activeIndex.value = index
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button !== 0) return
    currentCursor.value = 'grabbing'
    document.addEventListener(
      'mouseup',
      () => (currentCursor.value = 'zoom-in'),
      { once: true }
    )
  }

  /* ================= 生命周期 ================= */
  onMounted(async () => {
    await loadProduct()
    categoryProductsMap.value = await frontendService.fetchCategoryProducts()
  })

  watch(
    () => route.params.id,
    async () => {
      await loadProduct()
    }
  )

  onBeforeUnmount(() => {})
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
    padding: 0 30px;
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
