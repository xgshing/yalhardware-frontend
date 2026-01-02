<!-- 企业介绍侧边栏 -->
<!-- src/layouts/AboutYalSidebar.vue -->
<template>
  <aside :class="['admin-sidebar', { collapsed: isCollapsed }]">
    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapsed"
      :default-openeds="defaultOpeneds"
      class="el-menu-vertical-demo"
      router
    >
      <!-- 公司简介 -->
      <el-sub-menu index="about">
        <template #title>
          <span v-if="!isCollapsed">About</span>
        </template>
        <el-menu-item
          index="about-us"
          @click="goToPage('About Us')"
        >
          <span v-if="!isCollapsed">About Us</span>
        </el-menu-item>

        <el-menu-item
          index="contact-us"
          @click="goToPage('Contact Us')"
        >
          <span v-if="!isCollapsed">Contact Us</span>
        </el-menu-item>
      </el-sub-menu>
      <!-- 联系我们 -->
    </el-menu>
  </aside>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()

  const activeMenu = ref(route.path)
  const isCollapsed = ref(false)

  const defaultOpeneds = ref(['about']) // 默认展开 'about' 子菜单

  const goToPage = (purpose: string) => {
    router.push({
      path: '/about',
      query: { purpose },
    })
  }

  // 高亮当前路由
  watch(
    () => route.path,
    (path) => {
      activeMenu.value = path
    }
  )

  // 响应式：窗口宽度 < 1024 自动折叠
  function handleResize() {
    isCollapsed.value = window.innerWidth < 1024
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
    handleResize()
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
  })
</script>

<style scoped>
  .admin-sidebar {
    width: 220px;
    background-color: #ebe4e4;
    color: #fff;
    display: flex;
    flex-direction: column;
    transition: width 0.2s;
    position: relative;
  }
  /* 如果需要影响所有子菜单项 */
  :deep(.el-menu-vertical-demo .el-menu-item),
  :deep(.el-menu-vertical-demo .el-sub-menu__title) {
    background-color: #ebe4e4;
    color: black;
    /* 同时设置文字颜色 */
  }

  /* 设置鼠标悬停颜色 */
  :deep(.el-menu-vertical-demo .el-menu-item:hover),
  :deep(.el-menu-vertical-demo .el-sub-menu__title:hover) {
    background-color: #d1c7c7 !important;
    /* 更深的颜色 */
  }
  .admin-sidebar.collapsed {
    width: 64px;
  }
</style>
