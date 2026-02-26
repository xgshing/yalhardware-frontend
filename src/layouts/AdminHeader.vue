<!-- 后台抬头组件 -->
<!-- src/layouts/AdminHeader.vue -->
<!-- src/layouts/AdminHeader.vue -->
<template>
  <header class="admin-header">
    <div class="left">
      <span class="title">Admin Panel</span>
    </div>

    <div class="right">
      <el-dropdown>
        <span class="user-trigger">
          <el-avatar size="small" />
          <span class="name">{{ user?.email || 'Admin' }}</span>
        </span>

        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              divided
              @click="onLogout"
            >
              <el-icon><SwitchButton /></el-icon>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { initUser } from '@/services'
  import { useUserStore } from '@/stores/user'
  import { SwitchButton } from '@element-plus/icons-vue'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const user = ref<any>(null)

  const userStore = useUserStore()

  onMounted(async () => {
    user.value = await initUser()
  })

  function onLogout() {
    userStore.logout()
    router.replace({ name: 'login', query: { purpose: 'Login' } })
  }
</script>

<style scoped>
  .admin-header {
    height: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid #ebeef5;
    background: #fff;
  }

  .user-trigger {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
</style>
