<!-- 后台管理的侧边栏 -->
<!-- src/layouts/AdminSidebar.vue -->
<template>
  <aside :class="['admin-sidebar', { collapsed: isCollapsed }]">
    <!-- logo 区域 -->
    <div class="logo">
      <h2 v-if="!isCollapsed">后台管理</h2>
      <h2 v-else>后台</h2>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapsed"
      class="el-menu-vertical-demo"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#409EFF"
      router
    >
      <!-- 产品管理 -->
      <el-sub-menu index="products">
        <template #title>
          <el-icon>
            <Box />
          </el-icon>
          <span v-if="!isCollapsed">产品管理</span>
        </template>
        <el-menu-item index="/admin/products">
          <el-icon>
            <List />
          </el-icon>
          <span v-if="!isCollapsed">产品列表</span>
        </el-menu-item>
        <el-menu-item index="/admin/products/create">
          <el-icon>
            <CirclePlus />
          </el-icon>
          <span v-if="!isCollapsed">新增产品</span>
        </el-menu-item>
        <el-menu-item index="/admin/categories">
          <el-icon>
            <Folder />
          </el-icon>
          <span v-if="!isCollapsed">分类管理</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 订单管理 -->
      <el-sub-menu index="orders">
        <template #title>
          <el-icon>
            <ShoppingCart />
          </el-icon>
          <span v-if="!isCollapsed">订单管理</span>
        </template>
        <el-menu-item index="/admin/orders">
          <el-icon>
            <List />
          </el-icon>
          <span v-if="!isCollapsed">订单列表</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 用户管理 -->
      <el-sub-menu index="users">
        <template #title>
          <el-icon>
            <User />
          </el-icon>
          <span v-if="!isCollapsed">用户管理</span>
        </template>
        <el-menu-item index="/admin/users">
          <el-icon>
            <List />
          </el-icon>
          <span v-if="!isCollapsed">用户列表</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 内容管理 -->
      <el-sub-menu index="content">
        <template #title>
          <el-icon>
            <Document />
          </el-icon>
          <span v-if="!isCollapsed">内容管理</span>
        </template>

        <el-menu-item index="/admin/content/banners">
          <el-icon>
            <Picture />
          </el-icon>
          <span v-if="!isCollapsed">首页轮播</span>
        </el-menu-item>

        <el-menu-item index="/admin/content/features">
          <el-icon>
            <Star />
          </el-icon>
          <span v-if="!isCollapsed">核心卖点</span>
        </el-menu-item>

        <el-menu-item index="/admin/content/stories">
          <el-icon>
            <Document />
          </el-icon>
          <span v-if="!isCollapsed">品牌理念</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 公司信息 -->
      <!-- 内容管理 -->
      <el-sub-menu index="system">
        <template #title>
          <el-icon>
            <Document />
          </el-icon>
          <span v-if="!isCollapsed">公司信息</span>
        </template>

        <el-menu-item index="/admin/system/company-contact">
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <span v-if="!isCollapsed">联系方式</span>
        </el-menu-item>
        <el-menu-item index="/admin/system/company-about">
          <el-icon>
            <OfficeBuilding />
          </el-icon>
          <span v-if="!isCollapsed">公司介绍</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>

    <!-- 折叠按钮 -->
    <div
      class="collapse-btn"
      @click="toggleCollapse"
    >
      <el-icon>
        <ArrowLeft v-if="!isCollapsed" />
        <ArrowRight v-else />
      </el-icon>
    </div>
  </aside>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import {
    ArrowLeft,
    ArrowRight,
    Box,
    List,
    CirclePlus,
    Folder,
    ShoppingCart,
    User,
    Document,
    Picture,
    Star,
    OfficeBuilding,
  } from '@element-plus/icons-vue'

  const route = useRoute()

  const activeMenu = ref(route.path)
  const isCollapsed = ref(false)

  // 高亮当前路由
  watch(
    () => route.path,
    (path) => {
      activeMenu.value = path
    }
  )

  // 手动切换折叠
  function toggleCollapse() {
    isCollapsed.value = !isCollapsed.value
  }

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
    height: 100vh;
    background-color: #001529;
    color: #fff;
    display: flex;
    flex-direction: column;
    transition: width 0.2s;
    position: relative;
  }

  .admin-sidebar.collapsed {
    width: 64px;
  }

  .admin-sidebar .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    background-color: #001529;
    margin-bottom: 10px;
  }

  .admin-sidebar .collapse-btn {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    cursor: pointer;
    color: #fff;
  }

  .admin-sidebar ::v-deep(.el-menu-vertical-demo) {
    border-right: none;
  }

  /* 图标和文字居中 */
  .admin-sidebar ::v-deep(.el-menu-item, .el-sub-menu__title) {
    display: flex;
    align-items: center;
  }

  .admin-sidebar ::v-deep(.el-menu-item span, .el-sub-menu__title span) {
    margin-left: 8px;
  }
</style>
