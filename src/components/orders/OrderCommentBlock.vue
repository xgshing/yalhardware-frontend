<!-- 评价 / 追评 / 回复展示 & 提交 -->
<!-- src/components/orders/OrderCommentBlock.vue-->
<template>
  <div class="comment-block">
    <div v-if="comment">
      <p>评分：{{ comment.rating }} ⭐</p>
      <p>{{ comment.content }}</p>
      <p
        v-if="comment.reply_content"
        class="reply"
      >
        商家回复：{{ comment.reply_content }}
      </p>
    </div>

    <form
      v-else
      @submit.prevent="submit"
    >
      <textarea
        v-model="content"
        placeholder="评价内容"
      ></textarea>
      <button type="submit">提交评价</button>
    </form>
  </div>
</template>

<script setup lang="ts">
  import { reviewService } from '@/services'
  import { ref } from 'vue'

  const props = defineProps<{ orderItemId: number; comment?: any }>()
  const emit = defineEmits(['submitted'])

  const content = ref('')

  async function submit() {
    await reviewService.createReview({
      order_item_id: props.orderItemId,
      rating: 5,
      content: content.value,
    })
    emit('submitted')
  }
</script>

<style scoped>
  .comment-block textarea {
    width: 100%;
    min-height: 80px;
    margin-bottom: 8px;
  }
  .comment-block button {
    padding: 6px 12px;
    border: none;
    background-color: #409eff;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
  }
  .comment-block button:hover {
    background-color: #66b1ff;
  }
  .reply {
    margin-top: 8px;
    color: #666;
  }
</style>
