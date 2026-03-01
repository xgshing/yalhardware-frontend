<!-- src/components/review/OrderReview.vue -->
<template>
  <div class="order-review-page">
    <h2>Order Reviews</h2>

    <div
      v-for="item in reviewItems"
      :key="item.id"
      class="review-card"
    >
      <!-- 商品信息 -->
      <div class="product-info">
        <img
          :src="item.product_image || defaultImage"
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

      <!-- ================= 已评价 ================= -->
      <div
        v-if="item.review"
        class="review-display"
      >
        <!-- 星级 -->
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
          <strong>Merchant Reply: </strong>
          <p>{{ item.review.reply.merchant_reply }}</p>
        </div>

        <!-- 追评 -->
        <div
          v-if="item.review.append_content"
          class="append-review"
        >
          <strong>Additional Review: </strong>
          <p>{{ item.review.append_content }}</p>
        </div>

        <!-- 可追评 -->
        <div
          v-if="item.review.can_append"
          class="append-form"
        >
          <textarea
            v-model="item.appendForm.content"
            placeholder="Add additional feedback..."
          />
          <button
            :disabled="item.submitting"
            @click="submitAppend(item)"
          >
            {{ item.submitting ? 'Submitting...' : 'Submit Additional Review' }}
          </button>
        </div>
      </div>

      <!-- ================= 未评价 ================= -->
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
            @click="item.reviewForm.rating = star"
            >★</span
          >
        </div>

        <textarea
          v-model="item.reviewForm.content"
          placeholder="Share your experience..."
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
          <div class="preview-list">
            <div
              v-for="(img, index) in item.reviewForm.images"
              :key="index"
              class="preview-wrapper"
            >
              <img :src="img.preview" />
              <button @click="removeImage(item, index)">×</button>
            </div>
          </div>
        </div>

        <button
          class="btn primary"
          :disabled="item.submitting"
          @click="submitReview(item)"
        >
          {{ item.submitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>

      <!-- ================= 不可评价 ================= -->
      <div
        v-else
        class="not-allowed"
      >
        Order not eligible for review.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { uploadApi } from '@/api/common/upload'
  import { reviewService } from '@/services/frontend/reviews'
  import type { OrderItem, OrderItemUI, ReviewFile } from '@/types'
  import { onMounted, ref } from 'vue'

  const props = defineProps<{ orderItems: OrderItem[] }>()

  // 用于在页面展示和操作的状态副本
  const reviewItems = ref<OrderItemUI[]>([])
  const defaultImage = '/default-product.png'
  const MAX_IMAGES = 6
  const emptyImages: ReviewFile[] = []

  onMounted(async () => {
    // 深拷贝 orderItems 并添加前端状态
    reviewItems.value = props.orderItems.map((item) => ({
      ...item,

      reviewForm: { rating: 0, content: '', images: emptyImages },
      appendForm: { content: '' },
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

        const review = res.results?.[0]
        if (review) {
          item.review = review
          item.can_review = false
        }
      }
    }
  })

  // 图片选择
  function onSelectImages(e: Event, item: any) {
    const files = (e.target as HTMLInputElement).files
    if (!files) return

    for (const file of Array.from(files)) {
      if (item.reviewForm.images.length >= MAX_IMAGES) break
      const reader = new FileReader()
      reader.onload = (ev) => {
        item.reviewForm.images.push({
          file,
          preview: ev.target?.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // 移除图片
  function removeImage(item: any, index: number) {
    item.reviewForm.images.splice(index, 1)
  }

  // 提交评价
  async function submitReview(item: any) {
    if (!item.reviewForm.rating) return alert('Please select rating')
    if (!item.reviewForm.content.trim()) return alert('Please enter review')

    item.submitting = true
    try {
      // 1️⃣ 上传图片
      const uploadPromises = item.reviewForm.images.map((img: any) =>
        uploadApi.upload(img.file, 'reviews')
      )

      const uploadResults = await Promise.all(uploadPromises)
      const imageUrls = uploadResults.map((res) => res.data.url)

      // 2️⃣ 创建评论
      await reviewService.createReview({
        order_item_id: item.id,
        rating: item.reviewForm.rating,
        content: item.reviewForm.content,
        images: imageUrls,
      })

      // 3️⃣ 重新拉取
      const res = await reviewService.getReviews({
        order_item_id: item.id,
        page: 1,
        pageSize: 1,
      })

      item.review = res.results[0]
      item.can_review = false
    } catch (err) {
      console.error(err)
      alert('Submission failed')
    } finally {
      item.submitting = false
    }
  }

  // 追评
  async function submitAppend(item: any) {
    if (!item.appendForm.content.trim()) return

    item.submitting = true
    try {
      await reviewService.appendReview({
        review_id: item.review.id,
        content: item.appendForm.content,
      })

      item.review.append_content = item.appendForm.content
      item.review.can_append = false
    } catch {
      alert('Failed to append review')
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
  .not-allowed {
    color: #999;
    font-style: italic;
  }
</style>
