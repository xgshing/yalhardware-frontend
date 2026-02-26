<!-- 订单评论组件 -->
<!-- src/components/CommentList.vue -->
<template>
  <div>
    <div
      v-for="c in comments"
      :key="c.id"
    >
      <p>{{ c.content }}</p>
      <div v-if="c.replies">
        <p
          v-for="r in c.replies"
          :key="r.id"
        >
          ↳ {{ r.content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ comments: any[] }>()
</script>
