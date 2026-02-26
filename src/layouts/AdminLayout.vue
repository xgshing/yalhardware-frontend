<!-- 后台主布局组件 -->
<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <AdminSidebar />

    <div class="admin-main">
      <AdminHeader />
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AdminSidebar from './AdminSidebar.vue'
  import AdminHeader from './AdminHeader.vue'
</script>

<style scoped>
  .admin-layout {
    display: flex;
    height: 100vh;
  }

  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .admin-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
</style>
