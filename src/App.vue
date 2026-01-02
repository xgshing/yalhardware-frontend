<!-- 001-yal-tools/src/App.vue -->
<script setup lang="ts">
  import { onMounted } from 'vue'
  import { RouterView } from 'vue-router'
  import Drawer from '@/components/Drawer.vue'
  import { useCartStore } from '@/stores/cart'
  const cartStore = useCartStore()

  onMounted(() => {
    // 检查 DOM
    setTimeout(() => {
      const drawer = document.querySelector('.drawer')
    }, 100)
  })

  // 添加这个来确保 Drawer 被渲染
</script>

<template>
  <RouterView />
  <!-- 购物车抽屉放在根组件 -->
  <Drawer />
</template>

<style>
  /* 强制全屏宽度的终极方案 */
  :root,
  html {
    width: 100vw !important;
    min-width: 100vw !important;
    max-width: 100vw !important;
    overflow-x: hidden !important;
  }

  body {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow-x: hidden !important;
  }

  .no-scroll {
    overflow: hidden !important;
    position: fixed;
    width: 100%;
  }

  #app {
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    min-height: 100vh !important;
    margin: 0 !important;
    padding: 0 !important;
    display: block !important;
  }

  /* 确保没有任何元素限制宽度 */
  * {
    max-width: none !important;
    min-width: 0 !important;
  }

  /* 设置最小宽度，防止过窄 */
  @media (max-width: 768px) {
    :root,
    html,
    body,
    #app {
      min-width: 768px !important;
    }
  }
</style>
