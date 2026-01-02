<!-- 后台主布局组件 -->
<!-- src/layouts/AdminLayout.vue -->
<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
  import AdminSidebar from './AdminSidebar.vue'
</script>

<style scoped>
  .admin-layout {
    display: flex;
    height: 100vh;
  }

  .admin-content {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
  }
</style>
