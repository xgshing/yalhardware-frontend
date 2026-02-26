<!-- src/views/admin/comments/CommentList.vue -->
<template>
  <el-card>
    <template>
      <span>
        评论管理
      </span>
    </template>

    <el-table :data="comments" border stripe v-loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="user_email" label="用户" />
      <el-table-column prop="product_name" label="商品" />
      <el-table-column prop="rating" label="评分" width="80" />
      <el-table-column prop="content" label="时间" />

      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="danger" size="small" @click="onDelete(row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import {
  getAdminComments,
  removeComment,
} from '@/services'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from 'vue'

const comments = ref<any[]>([])
const loading = ref(false)

async function load() {
  loading.value = true
  comments.value = await getAdminComments()
  loading.value = false
}

async function onDelete(id: number) {
  await ElMessageBox.confirm(
    '确认删除该评论？',
    '警告',
    { type: 'warning' }
  )
  await removeComment(id)
  ElMessage.success('已删除')
  load()
}

onMounted(load)
</script>