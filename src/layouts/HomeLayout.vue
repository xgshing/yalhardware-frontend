<!-- src/layouts/HomeLayout.vue -->
<template>
  <div class="home-layout">
    <!-- 顶部导航栏 -->
    <NavBar />
    <!-- 子路由渲染出口 -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
  import NavBar from '@/components/NavBar.vue'
</script>

<style scoped>
  /* ==================== 页面基础 ==================== */
  .home-layout {
    min-height: 100vh;
    /* 最小高度为视口高度，确保占满屏幕 */
    margin: 0 30px;
  }
</style>
