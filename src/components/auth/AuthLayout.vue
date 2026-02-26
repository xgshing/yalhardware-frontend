<!--  登录 / 注册共用外壳 -->
<!-- src/components/auth/AuthLayout.vue -->
<template>
  <!-- 页面根容器 -->
  <div class="auth-body">
    <NavBar />

    <!-- 面包屑 -->
    <Breadcrumb
      :items="breadcrumb"
      @item-click="onBreadcrumbClick"
    />

    <!-- 页面内容容器 -->
    <div class="auth-container">
      <h1>{{ title }}</h1>

      <!-- 页面内容由solt 决定-->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Breadcrumb from '../Breadcrumb.vue'
  defineProps<{
    title: string
    breadcrumb: { label: string; clickable?: boolean }[]
  }>()

  const emit = defineEmits<{
    (e: 'breadcrumb-click', index: number): void
  }>()

  const onBreadcrumbClick = (index: number) => {
    emit('breadcrumb-click', index)
  }
</script>

<style scoped>
  .auth-body {
    margin: 0 30px;
  }

  .auth-container {
    background-color: #f7f3f3;
  }

  .auth-container h1 {
    font-size: 3.5rem;
    font-weight: 400;
    padding: 30px 0 60px 60px;
    margin: 0;
  }
</style>
