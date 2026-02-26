<!-- src/views/admin/users/UserList.vue -->
<template>
  <div class="admin-user-detail">
    <!-- 表头 -->
    <div class="page-header">
      <el-button
        text
        @click="goBack"
      >
        ← Back
      </el-button>
      <h2>User Detail</h2>
    </div>
    <el-card v-loading="loading">
      <!-- 基本信息 -->
      <el-descriptions
        title="Basic Information"
        :column="2"
        border
      >
        <el-descriptions-item label="User ID">
          {{ user?.id }}
        </el-descriptions-item>

        <el-descriptions-item label="Email">
          {{ user?.email }}
        </el-descriptions-item>

        <el-descriptions-item label="First Name">
          {{ user?.first_name || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="Last Name">
          {{ user?.last_name || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="Role">
          <el-tag
            v-if="user?.is_superuser"
            type="danger"
          >
            Super Admin
          </el-tag>
          <el-tag
            v-else-if="user?.isAdmin"
            type="warning"
          >
            Admin
          </el-tag>
          <el-tag
            v-else
            type="info"
          >
            User
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="Status">
          <el-tag :type="user?.isActive ? 'success' : 'info'">
            {{ user?.isActive ? 'Active' : 'Disabled' }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 操作 -->
      <div class="actions">
        <el-button @click="onToggleAction">
          {{ user?.isActive ? 'Disable User' : 'Enable User' }}
        </el-button>

        <el-button
          type="warning"
          plain
          :disabled="user?.is_superuser"
          @click="onToggleAdmin"
        >
          {{ user?.isAdmin ? 'Remove Admin' : 'Make Admin' }}
        </el-button>
      </div>

      <!-- 扩展区 -->
      <el-divider />

      <el-alert
        type="info"
        show="icon"
        title="More user information(login logs,permissions,etc.) can be extended here."
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import {
    fetchAdminUserDetail,
    toggleUserActive,
    toggleUserStaff,
  } from '@/services'
  import type { User } from '@/types'

  /* ================== 初始化 ================== */
  const route = useRoute()
  const router = useRouter()

  const user = ref<User | null>(null)
  const loading = ref(false)

  /* ================== 生命周期 ================== */
  onMounted(loadUser)

  /* ================== 方法 ================== */
  async function loadUser() {
    loading.value = true
    try {
      user.value = await fetchAdminUserDetail(Number(route.params.id))
    } finally {
      loading.value = false
    }
  }

  function goBack() {
    router.back()
  }

  async function onToggleAction() {
    if (!user.value) return

    await ElMessageBox.confirm('Confirm to change user status?', 'warning', {
      type: 'warning',
    })

    await toggleUserActive(user.value)
    ElMessage.success('User status updated')
    loadUser()
  }

  async function onToggleAdmin() {
    if (!user.value) return

    await ElMessageBox.confirm('Confirm to change admin role?', 'warning', {
      type: 'warning',
    })

    await toggleUserStaff(user.value)
    ElMessage.success('User role updated')
    loadUser()
  }
</script>

<style scoped>
  .admin-user-detail {
    padding: 20px;
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .actions {
    margin-top: 20px;
    display: flex;
    gap: 12px;
  }
</style>
