<!-- src/components/ProductCard.vue -->
<!-- 推荐产品 -->
<template>
  <div class="product-card">
    <!-- 推荐产品图片容器（可点击） -->
    <div
      class="recommended-img-container"
      @mouseenter="$emit('mouse-enter')"
      @mouseleave="$emit('mouse-leave')"
    >
      <!-- 推荐产品图片 -->
      <img
        :src="currentImage"
        :alt="productData.name"
        class="product-card-image"
        @click="handleClick"
      />
    </div>

    <!-- 产品信息 -->
    <div class="product-info">
      <h3
        class="product-name"
        @click="handleClick"
      >
        {{ productData.name }}
      </h3>

      <div class="rating">
        <span class="stars">★★★★★</span>
        <span class="reviews">{{ productData.reviews }} Reviews</span>
      </div>

      <!-- <div class="price">
        <span v-if="product.price.from" class="from-price">
          From {{ productData.price.current }}
        </span>
        <span v-else class="current-price">
          {{ productData.price.current }}
        </span>

        <span v-if="product.price.original" class="original-price">
          {{ productData.price.original }}
        </span>
      </div>
       -->
    </div>
  </div>
</template>

<script setup>
  // 定义组件接收的props
  const props = defineProps({
    productData: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    currentImage: {
      type: String,
      default: '',
    },
  })

  // 定义组件发出的事件
  const emit = defineEmits(['product-click', 'mouse-enter', 'mouse-leave'])

  // 点击处理函数
  const handleClick = () => {
    emit('product-click', props.productData)
  }
</script>

<style scoped>
  .product-card {
    background: white;
    border-radius: 10px;
    transition: all 0.25s ease;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  .recommended-img-container {
    width: 100%;
    aspect-ratio: 1 / 1;
    /* ⭐ 自动正方形。宽度与高度的比例。 */
    overflow: hidden;
    /* 确保图片放大时不会溢出 */
  }

  /* 图片 */
  .product-card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;
    /* 添加过渡效果 */
    cursor: pointer;
  }

  /* 悬停时推荐卡片图片的放大效果 */
  .recommended-img-container:hover .product-card-image {
    transform: scale(1.2);
    /* 图片放大，容器大小不变 */
  }

  .product-info {
    padding: 10px;
  }

  .product-name {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 1rem;
    line-height: 1.4;
    cursor: pointer;
  }

  .rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .stars {
    color: #f59e0b;
  }

  .reviews {
    font-size: 0.875rem;
    color: #64748b;
  }

  .price {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .current-price {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1e293b;
  }

  .from-price {
    font-size: 0.875rem;
    color: #64748b;
  }

  .original-price {
    font-size: 1rem;
    color: #94a3b8;
    text-decoration: line-through;
  }
</style>
