<!-- src/components/review/OrderReview.vue -->
<template>
  <div class="order-review-page">
    <h2>订单评价</h2>

    <div
      v-for="item in reviewItems"
      :key="item.id"
      class="review-card"
    >
      <!-- 商品信息 -->
      <div class="product-info">
        <img
          :src="item.product_image || '/default-product.png'"
          alt=""
          class="product-image"
        />
        <div class="product-meta">
          <div class="title">{{ item.product_title }}</div>
          <div class="sku">{{ item.sku_title }}</div>
          <div class="price-qty">
            ￥{{ Number(item.price).toFixed(2) }} × {{ item.quantity }}
          </div>
        </div>
      </div>

      <!-- 已评价显示 -->
      <div
        v-if="item.review"
        class="review-display"
      >
        <div class="review-rating">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= item.review.rating }"
            >★</span
          >
        </div>
        <p class="review-content">{{ item.review.content }}</p>

        <!-- 图片 -->
        <div
          v-if="item.review.images?.length"
          class="review-images"
        >
          <img
            v-for="(img, idx) in item.review.images"
            :key="idx"
            :src="img"
            class="review-image"
          />
        </div>

        <!-- 商家回复 -->
        <div
          v-if="item.review.reply?.merchant_reply"
          class="merchant-reply"
        >
          <strong>商家回复：</strong>
          <p>{{ item.review.reply.merchant_reply }}</p>
        </div>

        <!-- 追评 -->
        <div
          v-if="item.review.append_content"
          class="append-review"
        >
          <strong>追加评价：</strong>
          <p>{{ item.review.append_content }}</p>
        </div>
      </div>

      <!-- 可评价显示 -->
      <div
        v-else-if="item.can_review"
        class="submit-review"
      >
        <h3>写评价</h3>

        <!-- 星级选择 -->
        <div class="rating-stars">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{
              filled:
                star <= item.reviewForm.rating || star <= item.hoverRating,
            }"
            @mouseover="item.hoverRating = star"
            @mouseleave="item.hoverRating = 0"
            @click="item.reviewForm.rating = star"
            >★</span
          >
        </div>

        <textarea
          v-model="item.reviewForm.content"
          placeholder="分享您的购物体验..."
          rows="3"
        ></textarea>

        <!-- 图片上传 -->
        <div class="image-upload">
          <input
            type="file"
            multiple
            accept="image/*"
            @change="onSelectImages($event, item)"
          />
          <div class="preview-images">
            <img
              v-for="(file, idx) in item.reviewForm.images"
              :key="idx"
              :src="file.preview"
              class="preview"
            />
          </div>
        </div>

        <button
          class="btn primary"
          :disabled="item.submitting"
          @click="submitReview(item)"
        >
          {{ item.submitting ? '提交中...' : '提交评价' }}
        </button>
      </div>

      <div
        v-else
        class="already-reviewed"
      >
        您已完成此商品评价
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reviewService } from '@/services/frontend/reviews'
  import type { OrderItem } from '@/types'
  import { onMounted, ref } from 'vue'

  interface Props {
    orderItems: OrderItem[]
  }

  const props = defineProps<Props>()

  // 用于在页面展示和操作的状态副本
  const reviewItems = ref<OrderItem[]>([])

  onMounted(async () => {
    // 深拷贝 orderItems 并添加前端状态
    reviewItems.value = props.orderItems.map((item) => ({
      ...item,

      reviewForm: {
        rating: 0,
        content: '',
        images: [],
      },
      hoverRating: 0,
      submitting: false,
    }))

    // 拉取已评价数据
    for (const item of reviewItems.value) {
      if (item.can_review) {
        const res = await reviewService.getReviews({
          order_item_id: item.id,
          page: 1,
          pageSize: 1,
        })
        if (res.results?.length) {
          item.review = res.results[0]
          item.can_review = false
        }
      }
    }
  })

  // 图片选择
  function onSelectImages(e: Event, item: OrderItem) {
    const target = e.target as HTMLInputElement
    if (!target.files) return
    for (const file of Array.from(target.files)) {
      const reader = new FileReader()
      reader.onload = (event) => {
        item.reviewForm.images.push({
          file,
          preview: event.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // 提交评价
  async function submitReview(item: OrderItem) {
    if (!item.reviewForm.rating) return alert('请选择评分')
    if (!item.reviewForm.content.trim()) return alert('请输入评价内容')

    item.submitting = true
    try {
      console.log('提交前 rating=', item.reviewForm.rating)

      await reviewService.createReview({
        order_item_id: item.id,
        rating: item.reviewForm.rating,
        content: item.reviewForm.content,
        media_ids: [], // 根据实际 media 上传逻辑处理
      })

      // 重新拉取该商品的评价

      const reviewRes = await reviewService.getReviews({
        order_item_id: item.id,
        page: 1,
        pageSize: 1,
      })
      console.log('后台返回 review=', reviewRes.results[0])
      item.review = reviewRes.results?.[0] || null
      item.can_review = false
      item.reviewForm.rating = 0
      item.reviewForm.content = ''
      item.reviewForm.images = []
    } catch (err) {
      console.error(err)
      alert('提交失败，请重试')
    } finally {
      item.submitting = false
    }
  }
</script>

<style scoped>
  .order-review-page {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .review-card {
    background: #fff;
    border-radius: 10px;
    padding: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .product-info {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .product-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
  }
  .product-meta .title {
    font-weight: 600;
    font-size: 14px;
  }
  .product-meta .sku,
  .product-meta .price-qty {
    font-size: 13px;
    color: #666;
  }

  .submit-review h3 {
    margin-bottom: 8px;
    font-weight: 600;
  }
  .rating-stars {
    display: flex;
    gap: 4px;
    font-size: 20px;
    cursor: pointer;
    margin-bottom: 8px;
  }
  .rating-stars .star {
    color: #ddd;
    transition: color 0.2s;
  }
  .rating-stars .star.filled {
    color: #fadb14;
  }
  textarea {
    width: 100%;
    border-radius: 6px;
    border: 1px solid #ddd;
    padding: 8px;
    font-size: 14px;
    resize: none;
    margin-bottom: 8px;
  }
  .image-upload input[type='file'] {
    display: block;
    margin-bottom: 8px;
  }
  .preview-images {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 8px;
  }
  .preview {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #eee;
  }
  .btn.primary {
    background-color: #409eff;
    color: #fff;
    border: none;
    padding: 6px 14px;
    border-radius: 4px;
    cursor: pointer;
  }
  .btn.primary:disabled {
    background-color: #a0cfff;
    cursor: not-allowed;
  }

  .review-display .review-rating .star {
    font-size: 16px;
    color: #fadb14;
  }
  .review-content {
    margin-top: 6px;
    font-size: 14px;
    color: #111;
  }
  .review-images {
    display: flex;
    gap: 8px;
    margin-top: 6px;
  }
  .review-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #eee;
  }
  .merchant-reply,
  .append-review {
    background: #f5f5f5;
    border-radius: 6px;
    padding: 8px;
    margin-top: 6px;
    font-size: 13px;
    color: #555;
  }
  .already-reviewed {
    color: #999;
    font-style: italic;
  }
</style>
