<!-- src/views/admin/users/UserList.vue -->
<template>
  <div class="admin-user-page">
    <!-- 表头 -->
    <div class="page-header">
      <h2>User Management</h2>
      <p class="sub">Manage system users and permissions</p>
    </div>

    <!-- 表单 -->
    <el-card>
      <el-table
        :data="users"
        v-loading="loading"
        row-key="id"
        stripe
      >
        <!-- ID -->
        <el-table-column
          prop="id"
          label="ID"
          width="80"
        />

        <!-- 邮箱 -->
        <el-table-column
          prop="email"
          label="Email"
          min-width="200"
        />

        <!-- 用户名 -->
        <el-table-column
          prop="name"
          label="Name"
        />

        <!-- 身份 -->
        <el-table-column
          label="Role"
          width="140"
        >
          <template #default="{ row }">
            <el-tag
              v-if="row.is_superuser"
              type="danger"
            >
              Super Admin
            </el-tag>

            <el-tag
              v-else-if="row.isAdmin"
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
          </template>
        </el-table-column>

        <!-- 状态 -->
        <el-table-column
          label="Status"
          width="120"
        >
          <template #default="{ row }">
            <el-tag :type="row.isActive ? 'success' : 'info'">
              {{ row.isActive ? 'Active' : 'Disabled' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column
          label="Actions"
          width="260"
        >
          <template #default="{ row }">
            <el-button
              size="small"
              type="primary"
              link
              @click="goDetail(row.id)"
            >
              Detail
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { fetchAdminUsers } from '@/services'
  import type { User } from '@/types'

  /* ================== 初始化 ================== */
  const router = useRouter()
  const users = ref<User[]>([])
  const loading = ref(false)

  /* ================== 生命周期 ================== */
  onMounted(loadUsers)

  /* ================== 计算属性 ================== */
  const tableRows = computed(() =>
    users.value.map((u) => ({
      id: u.id,
      email: u.email,
      name: `${u.first_name} ${u.last_name}`.trim() || '-',
      isAdmin: u.isAdmin,
      isSuper: u.is_superuser,
      isActive: u.isActive,
    }))
  )

  /* ================== 方法 ================== */
  async function loadUsers() {
    loading.value = true
    try {
      users.value = await fetchAdminUsers()
    } finally {
      loading.value = false
    }
  }

  function goDetail(id: number) {
    router.push(`/admin/users/${id}`)
  }
</script>

<style scoped>
  .admin-user-page {
    padding: 20px;
  }

  .page-header {
    margin-bottom: 16px;
  }

  .page-header h2 {
    margin: 0;
    font-size: 20px;
  }

  .page-header .sub {
    margin-top: 4px;
    color: #888;
    font-size: 13px;
  }
</style>
