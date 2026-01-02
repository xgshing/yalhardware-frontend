<!-- src/views/HomeView.vue -->
<template>
  <div class="home">
    <NavBar />

    <main class="main-content">
      <!-- ============ 畅销产品区域 ============ -->
      <section class="favorite-products">
        <h1>Favorites</h1>
        <div class="products-row">
          <!-- 销量第一产品 -->
          <div
            v-if="topProduct"
            class="product product-no_1"
          >
            <img
              :src="getFullUrl(topProduct.cover || '/default-product.png')"
              :alt="topProduct.name"
              class="main-product-image"
            />
            <div
              class="product-info"
              @click="openProduct(topProduct)"
              @mouseenter="handleProductHover(topProduct.id)"
              @mouseleave="handleProductLeave(topProduct.id)"
            >
              <div class="thumbnail-container">
                <img
                  :src="getCurrentImage(topProduct)"
                  :alt="topProduct.name"
                  class="product-thumbnail"
                />
              </div>
              <div class="product-details">
                <div class="first-product-title">{{ topProduct.name }}</div>
                <div class="first-product-reviews">
                  {{ topProduct.reviews }}
                </div>
                <div class="first-product-price">{{ topProduct.price }}</div>
              </div>
              <div class="circle">↗</div>
            </div>
          </div>

          <!-- 销量第二、第三产品 -->
          <div class="product-ranking-grid">
            <ProductCard
              v-for="item in secondAndThirdProducts"
              :key="item.id"
              :product-data="item"
              :current-image="getCurrentImage(item)"
              @product-click="openProduct"
              @mouse-enter="() => handleProductHover(item.id)"
              @mouse-leave="() => handleProductLeave(item.id)"
            />
          </div>
        </div>
      </section>

      <!-- ============ 品牌理念 ============ -->
      <div class="commitment-container">
        <div
          v-for="item in commitments"
          :key="item.id"
          class="commitment-item"
        >
          <p class="title">{{ item.text_title }}</p>
          <p class="desc">{{ item.text_content }}</p>
        </div>
      </div>

      <!-- ============ 核心卖点 ============ -->
      <h1 class="company-pursuit-title">
        Beyond beauty: crafting a better future
      </h1>
      <div class="sustainable-craftsmanship-container">
        <!-- 左侧固定卡片 -->
        <SustainableCraftsmanshipCard
          class="fixed-left-card"
          :title="cardsData[0]?.title ?? ''"
          :description="cardsData[0]?.description ?? ''"
          :image-url="getFullUrl(cardsData[0]?.imageUrl ?? '')"
          :show-number="false"
          :is-left-fixed="true"
        />
        <!-- 右侧交互卡片 -->
        <div class="right-container">
          <InteractiveCard
            v-for="(card, index) in rightCardsData"
            :key="card.id"
            :id="card.id"
            :title="card.title"
            :description="card.description"
            :image-url="getFullUrl(card.imageUrl)"
            :number="index + 2"
            :is-hovered="productHoverStates[card.id] || false"
            @mouseenter="handleProductHover(card.id)"
            @mouseleave="handleProductLeave(card.id)"
          />
        </div>
      </div>

      <!-- ============ 产品种类区域 ============ -->
      <h1 class="company-pursuit-title">Product categories</h1>
      <div class="category-grid">
        <div
          v-for="(products, categoryName) in categoryList"
          :key="categoryName"
          class="category-card"
          @click="openCategory(categoryName)"
        >
          <div class="img-container">
            <img
              :src="getCategoryImage(products)"
              :alt="categoryName"
              class="category-image"
            />
          </div>
          <div class="title-arrow">
            <p class="category-title">{{ categoryName }}</p>
            <p class="right-arrow">→</p>
          </div>
          <p class="category-count">{{ products.length }} Items</p>
        </div>
      </div>

      <!-- ============ 轮播图 ============ -->
      <Carousel_test
        :slides="carouselData"
        :duration="3000"
        :speed="1000"
      />

      <!-- ============ 推荐产品区域 ============ -->
      <div class="product-recommendations">
        <h1>Recommended products</h1>
        <div class="recommended-grid">
          <ProductCard
            v-for="item in recommendedProducts"
            :key="item.id"
            :product-data="item"
            :current-image="getCurrentImage(item)"
            @product-click="openProduct"
            @mouse-enter="() => handleProductHover(item.id)"
            @mouse-leave="() => handleProductLeave(item.id)"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'

  import NavBar from '@/components/NavBar.vue'
  import Carousel_test from '@/components/Carousel/Carousel.vue'
  import SustainableCraftsmanshipCard from '@/components/CorporationMission/SustainableCraftsmanshipCard.vue'
  import InteractiveCard from '@/components/CorporationMission/InteractiveCard.vue'
  import ProductCard from '@/components/ProductCard.vue'

  import type {
    Product,
    CategoryProducts,
    CardData,
    CommitmentItem,
  } from '@/types/product'
  import {
    fetchAllProducts,
    fetchCategoryProducts,
  } from '@/services/frontend/product.service'
  import { fetchAdminProducts } from '@/services/admin/product.service.admin'
  import {
    fetchStories,
    fetchFeatures,
    fetchBanners,
  } from '@/services/frontend/home.service'

  const router = useRouter()

  // ==================== 响应式变量 ====================
  const productsByCategory = ref<CategoryProducts>({})
  const products = ref<Product[]>([])
  const productHoverStates = ref<Record<number, boolean>>({})

  // 分类
  const categoryList = computed(() => productsByCategory.value)

  // 公司承诺（品牌理念）
  const commitments = ref<CommitmentItem[]>([])

  // 核心卖点卡片
  const cardsData = ref<CardData[]>([])
  const rightCardsData = computed(() => cardsData.value.slice(1))

  // 轮播图
  const carouselData = ref<
    { imageUrl: string; title: string; content: string }[]
  >([])

  // 推荐产品
  const recommendedProducts = ref<Product[]>([])

  // ==================== 悬停处理 ====================
  const handleProductHover = (id: number) => {
    productHoverStates.value[id] = true
  }
  const handleProductLeave = (id: number) => {
    productHoverStates.value[id] = false
  }

  // ==================== 图片获取 ====================
  const getFullUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    return `${import.meta.env.VITE_API_BASE_URL}${url}`
  }

  // 图片标准化
  const normalizeImages = (product: Product): string[] => {
    const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
    const images: string[] = []

    if (product.cover)
      images.push(
        product.cover.startsWith('http')
          ? product.cover
          : `${base}${product.cover}`
      )
    if (product.variants?.length) {
      product.variants.forEach((v) => {
        if (v.style_image)
          images.push(
            v.style_image.startsWith('http')
              ? v.style_image
              : `${base}${v.style_image}`
          )
      })
    }
    if (product.detail_images?.length) {
      product.detail_images.forEach((img: { image: string }) => {
        if (img.image)
          images.push(
            img.image.startsWith('http') ? img.image : `${base}${img.image}`
          )
      })
    }
    if (!images.length) images.push('/default-product.png')
    return images
  }

  // 当前展示图片（悬停显示第二张）
  const getCurrentImage = (product: Product): string => {
    const images = normalizeImages(product)
    const isHovered = !!productHoverStates.value[product.id]
    if (isHovered && images.length > 1)
      return images[2] ?? '/default-product.png'
    return images[1] ?? '/default-product.png'
  }

  // 畅销产品计算
  const allProducts = computed(() =>
    Object.values(productsByCategory.value).flatMap((p) => p)
  )
  const sortedProducts = computed(() =>
    [...allProducts.value].sort(
      (a, b) => (b.salesVolume || 0) - (a.salesVolume || 0)
    )
  )
  const topProduct = computed(() => sortedProducts.value[0])
  const secondAndThirdProducts = computed(() =>
    sortedProducts.value.slice(1, 3)
  )

  // 产品分类
  const getCategoryImage = (products: Product[]): string => {
    const firstImage = products
      .map((p) => normalizeImages(p)[0])
      .find((img) => !!img)
    return firstImage ?? '/default-category.png'
  }
  const openCategory = (categoryName: string) => {
    router.push({
      name: 'product-categories',
      query: { category: categoryName },
    })
  }

  // 产品详情跳转
  const findProductCategoryName = (id: number): string => {
    const product = products.value.find((p) => p.id === id)
    return product?.category?.name ?? 'Uncategorized'
  }
  const openProduct = (product: Product) => {
    const categoryName = findProductCategoryName(product.id)
    router.push({
      name: 'product-detail',
      params: { category: categoryName, id: product.id.toString() },
    })
  }

  // ==================== 合并 onMounted ====================
  onMounted(async () => {
    try {
      // ====== 分类和全部产品 ======
      productsByCategory.value = await fetchCategoryProducts()
      products.value = await fetchAllProducts()

      // ====== 品牌理念（stories） ======
      const stories = await fetchStories()
      commitments.value = stories.map((s: any) => ({
        id: s.id,
        text_title: s.title,
        text_content: s.description,
        image: s.images?.[0]?.image_url ?? '',
      }))

      // ====== 核心卖点（features） ======
      const features = await fetchFeatures()
      cardsData.value = features.map((f: any) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        imageUrl: f.images?.[0]?.image_url ?? '',
      }))

      // ====== 轮播图（banners） ======
      const banners = await fetchBanners()
      carouselData.value = banners.map((b: any) => ({
        title: b.title,
        content: b.description,
        imageUrl: b.images?.[0]?.image_url ?? '/default-banner.png',
      }))

      // ====== 推荐产品 ======
      const allAdminProducts: Product[] = await fetchAdminProducts()
      console.log('allAdminProducts', allAdminProducts) // 🔍检查返回内容
      recommendedProducts.value = allAdminProducts
        .filter((p) => p.is_featured)
        .slice(0, 4)
      console.log('recommendedProducts', recommendedProducts.value)
    } catch (err) {
      console.error('Failed to fetch home page data', err)
      // 避免 undefined
      commitments.value = commitments.value || []
      cardsData.value = cardsData.value || []
      carouselData.value = carouselData.value || []
      recommendedProducts.value = recommendedProducts.value || []
    }
  })
</script>

<style scoped>
  /* ==================== 页面基础 ==================== */
  .home {
    min-height: 100vh;
    /* 最小高度为视口高度，确保占满屏幕 */
    margin: 0 30px;
  }

  /* ==================== 排名前三产品 ==================== */
  .favorite-products h1 {
    margin-top: 0;
    /* 移除<h1>标签默认的上边距 */
    margin-bottom: 20px;
    font-size: 2.6rem;
    font-weight: 400;
  }

  /* 畅销产品行容器 */
  .products-row {
    display: flex;
    gap: 0.5rem;
    min-height: 500px;
    margin: 20px 0;
  }

  /* 通用产品容器样式 */
  .product {
    display: flex;
    height: 550px;
    overflow: hidden;
    /* 关键：隐藏图片放大后溢出的部分 */
    border-radius: 8px;
  }

  /* 排名第一的产品特殊样式 */
  .product-no_1 {
    position: relative;
    /* 关键：为绝对定位子元素提供参考定位上下文 */
    width: 50%;
    /* 占据屏幕50%宽度 */
    min-width: 0;
    /* 解决Flexbox/Grid布局中的内容溢出问题 */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  /* 主产品图片样式 */
  .main-product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 关键：等比例缩放并裁剪以覆盖容器 */
  }

  /* 产品信息卡片（叠加在图片上） */
  .product-info {
    position: absolute;
    /* 绝对定位，相对于父元素 */
    display: flex;
    align-items: center;
    display: flex;
    flex-direction: row;
    bottom: 30px;
    left: 30px;

    height: 120px;
    background-color: #eee9e9;
    border-radius: 5px;
    padding: 20px;
    cursor: pointer;
    /* 鼠标悬停时显示手型指针 */
    z-index: 10;
    /* 堆叠顺序高于图片，确保显示在上层 */
  }

  /* 缩略图容器 */
  .thumbnail-container {
    width: 120px;
    height: 120px;
    overflow: hidden;
    position: relative;
  }

  /* 图片本身 */
  .product-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
    /* 所有属性0.5秒缓动过渡效果 */
  }

  /* 产品详细信息区域 */
  .product-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    margin-left: 20px;
  }

  .first-product-title {
    font-size: 18px;
    font-weight: 600;
    color: #222;
  }

  .first-product-reviews {
    font-size: 14px;
    color: #777;
  }

  .first-product-price {
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin-top: 4px;
  }

  .circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid #333;
    margin-left: 120px;

    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    transition: all 0.5s ease;
  }

  /* 鼠标悬停时圆形按钮的变化 */
  .product-info:hover .circle {
    background-color: #333;
    color: white;
  }

  /* 悬停时缩略图的放大效果 */
  .product-info:hover .product-thumbnail {
    transform: scale(1.2);
    /* 图片放大20%，容器大小不变 */
  }

  /* 销量第二、第三的产品容器 */
  .product-ranking-grid {
    flex: 1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* ⭐ 两列等宽网格 */
    gap: 0.5rem;
    width: 100%;
  }

  /* 产品卡片图片区域包装器 */
  .product-card-image-wrapper {
    width: 100%;
    height: 350px;
    overflow: hidden;
  }

  .product-card-image {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    object-fit: cover;
    cursor: pointer;
    transition:
      opacity 0.5s ease,
      transform 0.9s ease;
    /* 同时设置透明度和变换的过渡效果 */
  }

  /* 淡入并放大效果 */
  .product-card-image:hover {
    transform: scale(1.2);
  }

  /* ---- 🟣 内容区域 ---- */
  .product-card-content {
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, Arial,
      sans-serif;
    /* 确保在不同操作系统和设备上获得最佳字体显示效果。 */
    gap: 8px;
    /* 统一设置子元素间距 */
    margin: 20px;
  }

  /* 产品名（Apple 14px semibold） */
  .product-card-title {
    font-size: 16px;
    font-weight: 600;
    color: #222;
    line-height: 1.3;
  }

  /* 评论（浅灰 Shopify 风） */
  .product-card-reviews {
    font-size: 14px;
    color: #777;
    margin-top: auto;
    line-height: 2;
  }

  /* 价格（强调） */
  .product-card-price {
    font-size: 16px;
    font-weight: 600;
    color: #111;
    margin-top: 4px;
  }

  /* ==================== 公司承诺 ==================== */
  .commitment-container {
    background-color: #eee9e9;
    padding: 0 60px;
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    /* 效果：三列等宽，各占1/3 */
    gap: 30px;
  }

  .title {
    font-size: 3.5rem;
    font-weight: 600;
    margin-bottom: 10px;
  }

  .desc {
    font-size: 1.5rem;
    color: #777;
    line-height: 1.6;
  }

  /* ==================== 公司追求 ==================== */
  h1.company-pursuit-title {
    margin: 100px 0 20px;
    font-size: 2.6rem;
    font-weight: 400;

    /* 响应式：屏幕宽度小于768px时的样式 */
    @media (max-width: 768px) {
      font-size: 2.5rem;
      text-align: center;
      margin: 60px 0 30px;
    }
  }

  /* 
 * 主容器样式
 * 使用Flex布局实现响应式设计
 */
  .sustainable-craftsmanship-container {
    display: flex;
    width: 100%;
    margin: 0 auto;
    gap: 20px;
    /* 子元素间距 */
    height: 550px;

    /* 移动端响应式样式 */
    @media (max-width: 768px) {
      flex-direction: column;
      /* 垂直排列 */
      gap: 15px;
      /* 调整间距 */
    }
  }

  /* 左侧固定卡片容器 */
  .fixed-left-card {
    width: 100%;
    height: 100%;
    /* 继承父容器高度 */

    @media (max-width: 768px) {
      flex: 1;
      /* 移动端占满宽度 */
      width: 100%;
      /* 宽度100% */
    }
  }

  /* 右侧容器（包含两个交互式卡片） */
  .right-container {
    flex: 1;
    /* 占据剩余空间,如果有多个项目都设置了 flex: 1;，它们会平均分配剩余空间 */
    display: flex;
    gap: 20px;
    height: 100%;

    @media (max-width: 768px) {
      flex-direction: column;
      /* 移动端垂直排列 */
    }

    /* 使两个子元素等分容器宽度 */
    & > * {
      flex: 1;
      /* 等分剩余空间 */
    }
  }

  /* ==================== 产品种类 ==================== */
  /* 整体布局 */
  .category-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 4列等宽网格 */
    gap: 2rem;
    padding: 2rem 0;
  }

  .img-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* ⭐ 关键：宽度:高度=1:1，自动保持正方形 */
  }

  .category-image {
    width: 100%;
    height: 100%;
    cursor: pointer;
    transition:
      transform 0.5s ease,
      box-shadow 0.2s ease;
  }

  .category-image:hover {
    transform: translateY(-4px);
    /* 向上移动4px */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  /* 分类标题区域（包含标题和箭头） */
  .title-arrow {
    position: relative;
    /* 为 ::after 伪元素提供定位上下文 */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 20px;
    cursor: pointer;
  }

  /* 分类标题下划线（使用::after伪元素创建） */
  .title-arrow::after {
    content: '';
    /* 必需：伪元素内容为空 */
    position: absolute;
    left: 0;
    bottom: 0;
    height: 1px;
    width: 100%;
    background-color: #333;
    transform: scaleX(0);
    /* 初始状态：水平缩放为0（隐藏） */
    transform-origin: left center;
    /* 从左开始展开 */
    transition: transform 0.3s ease;
  }

  /* 鼠标悬停时展开底线 */
  .title-arrow:hover::after {
    transform: scaleX(1);
    /* 水平缩放为1（完全显示） */
  }

  .category-title {
    font-weight: 600;
    margin-bottom: 0.3rem;
    font-size: 1.5rem;
  }

  .right-arrow {
    font-size: 1.1rem;
  }

  /* 产品数量显示样式 */
  .category-count {
    font-size: 0.9rem;
    color: #666;
    padding: 0 20px;
    margin-top: 10px;
  }

  /* 响应式设计：大屏幕（小于1024px） */
  @media (max-width: 1024px) {
    .category-grid {
      grid-template-columns: repeat(3, 1fr);
      /* 3列等宽网格 */
    }
  }

  /* 响应式设计：平板（小于768px） */
  @media (max-width: 768px) {
    .category-grid {
      grid-template-columns: repeat(2, 1fr);
      /* 2列等宽网格 */
    }
  }

  /* 响应式设计：手机（小于480px） */
  @media (max-width: 480px) {
    .category-grid {
      grid-template-columns: 1fr;
      /* 单列布局 */
    }
  }

  /* ==================== 推荐产品 ==================== */
  .product-recommendations h1 {
    margin-bottom: 20px;
    font-size: 2.6rem;
    font-weight: 400;
  }

  /* 推荐区域网格布局 */
  .recommended-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* ⭐ 一行四列等宽网格 */
    gap: 12px;
    width: 100%;
    margin-top: 40px;
  }

  /* ==================== 通用响应式设计 ==================== */
  /* 平板及以下尺寸（小于768px）的通用响应式样式 */
  @media (max-width: 768px) {
    .products-row {
      flex-direction: column;
      /* 畅销产品行改为垂直排列 */
      height: auto;
    }

    /* 排名第一的产品宽度改为100% */
    .product-no_1 {
      width: 100%;
    }

    /* 公司承诺容器改为单列布局 */
    .commitment-container {
      grid-template-columns: 1fr;
      text-align: center;
    }

    /* 公司追求行改为垂直排列 */
    .pursues-row {
      flex-direction: column;
      height: auto;
    }

    /* 公司追求子项宽度改为100% */
    .pursues-1,
    .pursues-2,
    .pursues-3 {
      width: 100%;
    }

    /* 分类容器在手机端变为单列 */
    .categories-container {
      grid-template-columns: repeat(1, 1fr);
    }
  }
</style>
