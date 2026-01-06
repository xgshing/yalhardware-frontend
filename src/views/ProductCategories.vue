<!-- src/views/ProductCategories.vue -->
<!-- 产品分类页面 -->
<template>
  <div class="Category">
    <!-- 直接使用导航栏组件，不需要传递数据 -->
    <NavBar />

    <!-- ============ 种类介绍 ============ -->
    <div class="Category-Introduction">
      <!-- 面包屑导航容器 -->
      <div class="introduction-container">
        <div
          class="nav-link"
          @click="goToHome"
        >
          Home
        </div>
        <!-- 点击返回首页的链接 -->
        <p class="separator"></p>
        <!-- 分隔符 -->
        <div>{{ currentCategory }}</div>
        <!-- 显示当前分类名称 -->
      </div>
      <!-- 分类标题 -->
      <h1>{{ currentCategory }}</h1>
      <div>Category Description...</div>
    </div>

    <!-- ============ 价格和排序导航栏 ============ -->
    <div class="price-navigation">
      <div>Availability ↓</div>
      <div>Price ↓</div>
      <div>Showing {{ totalProducts }} of {{ totalProducts }} products</div>
      <div>Best selling ↓</div>
    </div>

    <!-- ============ 产品展示网格区域 ============ -->
    <div class="product-display">
      <!-- 
        循环渲染每个产品项，使用v-for指令 
        :key="item.id"  使用产品id作为key，优化Vue的虚拟DOM更新
        class="product-item" 产品项容器类名
      -->
      <ProductCard
        v-for="item in filteredProducts"
        :key="item.id"
        :product-data="item"
        :current-image="getPrimaryImage(item)"
        @product-click="openProduct"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  /* ================== Vue & Router ================== */
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import NavBar from '@/components/NavBar.vue'
  import ProductCard from '@/components/ProductCard.vue'

  import { getPrimaryImage } from '@/utils/images'

  import type { Product, CategoryProducts } from '@/types/frontend/product'

  import { frontendService } from '@/services'

  /* ================== Router ================== */
  const route = useRoute()
  const router = useRouter()

  /* ================== State ================== */
  const currentCategory = ref<string>('')

  // 后台按分类分组的产品
  const categoryProductsMap = ref<CategoryProducts>({})

  /* ================== Navigation ================== */
  const goToHome = (): void => {
    router.push({ name: 'home' })
  }

  /* ================== Computed ================== */
  // 当前分类下的产品
  const filteredProducts = computed<Product[]>(() => {
    if (!currentCategory.value) return []
    return categoryProductsMap.value[currentCategory.value] || []
  })

  // 产品总数
  const totalProducts = computed<number>(() => {
    return filteredProducts.value.length
  })

  /* ================== Actions ================== */
  const openProduct = (item: Product): void => {
    router.push({
      name: 'product-detail',
      params: {
        category: currentCategory.value,
        id: item.id.toString(),
      },
    })
  }

  /* ================== Data Fetch ================== */
  async function updateCategory(): Promise<void> {
    currentCategory.value = (route.query.category as string) || '所有产品'

    if (Object.keys(categoryProductsMap.value).length === 0) {
      try {
        categoryProductsMap.value =
          await frontendService.fetchCategoryProducts()
      } catch (err) {
        console.error('获取分类产品失败', err)
        categoryProductsMap.value = {}
      }
    }
  }

  /* ================== Lifecycle ================== */
  onMounted(updateCategory)

  watch(() => route.query.category, updateCategory)
</script>

<style scoped>
  /* ==================== 种类介绍 ====================  */
  /* 页面主容器样式 */
  .Category {
    margin: 0 30px;
  }

  /* 分类介绍区域容器样式 */
  .Category-Introduction {
    background-color: #eee9e9;
    height: 400px;
    padding: 0 50px;
  }

  .Category-Introduction h1 {
    margin-top: 0;
    font-size: 3.5rem;
    font-weight: 500;
  }

  /* 面包屑导航容器样式 */
  .introduction-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    opacity: 0.7;
    /* 0 完全透明，1 完全不透明 */
    font-size: 0.8rem;
    padding-top: 50px;
  }

  /* 导航链接样式 */
  .nav-link {
    position: relative;
    /* 设置为相对定位，为伪元素::after提供定位参考 */
    cursor: pointer;
    padding-bottom: 3px;
    /* 为下划线预留空间 */
    transition: color 0.3s;
    /* 文字颜色过渡动画 */
  }

  /* 
 * .nav-link::after 伪元素：创建下划线效果
 * ::after在.nav-link内容之后插入内容
 * 功能：创建动态下划线，悬停时从左向右消失
 */
  .nav-link::after {
    content: '';
    /* 伪元素必须设置content属性，这里为空内容 */
    position: absolute;
    /* 绝对定位，相对于.nav-link元素定位 */
    width: 100%;
    /* 下划线宽度与文字等宽 */
    height: 1px;
    bottom: 0;
    left: 0;
    /* 从左开始 */
    background-color: #333;
    transition: transform 0.5s ease;
    /* 设置transform变换的过渡动画，持续0.5秒，缓动效果 */
    transform: scaleX(1);
    /* 初始状态：完全显示 */
    transform-origin: left center;
    /* 变换原点：从左侧开始 */
  }

  /* 
 * .nav-link:hover 伪类：鼠标悬停状态样式
 * 当鼠标悬停在.nav-link上时应用
 * 功能：鼠标悬停时改变文字颜色和下划线状态
 */
  .nav-link:hover {
    color: #007bff;
    /* 悬停时文字颜色变为蓝色 */
  }

  /* 
 * .nav-link:hover::after 伪元素：悬停时下划线动画
 * 鼠标悬停时改变::after伪元素的样式
 * 功能：下划线从左侧开始向右收缩，实现向左消失效果
 */
  .nav-link:hover::after {
    transform: scaleX(0);
    /* 水平缩放为0，实现消失效果 */
    transform-origin: right center;
    /* 变换原点改为右侧，实现从左向右消失 */
  }

  /* 面包屑分隔符样式 */
  .separator {
    width: 1.6rem;
    height: 0.05rem;
    background-color: #333;
    margin: 0.2rem;
  }

  /* ==================== 价格导航 ====================  */
  .price-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 2rem;
  }

  /* ==================== 产品展示区域样式 ====================  */
  /* 产品网格容器样式 */
  .product-display {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    /* 创建4列等宽网格，1fr表示分数单位 */
    gap: 0.5rem;
    padding: 1rem 0;
  }

  /* 单个产品项容器样式 */
  .product-item {
    border-radius: 8px;
    background-color: #eee9e9;
  }

  /* 产品图片容器样式 */
  .product-image-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* ⭐ 自动正方形。宽度与高度的比例。 */
    overflow: hidden;
    /* 确保图片放大时不会溢出 */
  }

  /* 产品图片样式 */
  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 1rem;
    cursor: pointer;
    transition: all 0.5s ease;
  }

  /* 图片悬停效果 */
  .product-item:hover .product-image {
    transform: scale(1.2);
  }

  .text-container {
    padding: 10px 10px;
  }

  /* 文字容器内段落通用样式 */
  .text-container p {
    margin: 0 0 0.5em 0;
    /* 设置外边距：上右下左，下边距为0.5em，其他为0 */
  }

  .product-name {
    font-weight: 600;
    color: #333;
    cursor: pointer;
  }

  .product-reviews {
    color: #666;
    font-size: 0.9rem;
  }

  .product-price {
    font-weight: bold;
    color: #2c5aa0;
    font-size: 1.1rem;
  }

  /* ==================== 响应式设计 ==================== */
  /* 
 * 媒体查询：最大宽度1024像素（平板电脑和桌面小屏幕）
 * 当屏幕宽度小于等于1024px时应用这些样式
 */
  @media (max-width: 1024px) {
    .product-display {
      grid-template-columns: repeat(3, 1fr);
      /* 改为3列网格布局 */
      gap: 1.5rem;
    }
  }

  /* 
 * 媒体查询：最大宽度768像素（平板电脑竖屏和手机横屏）
 * 当屏幕宽度小于等于768px时应用这些样式
 */
  @media (max-width: 768px) {
    .product-display {
      grid-template-columns: repeat(2, 1fr);
      /* 改为2列网格布局 */
      gap: 1rem;
    }

    .price-navigation {
      flex-direction: column;
      /* 改为垂直方向排列 */
      gap: 0.5rem;
      align-items: flex-start;
    }
  }

  /* 
 * 媒体查询：最大宽度480像素（手机竖屏）
 * 当屏幕宽度小于等于480px时应用这些样式
 */
  @media (max-width: 480px) {
    .product-display {
      grid-template-columns: 1fr;
      /* 改为单列布局 */
    }
  }
</style>
