<!-- src/views/admin/products/CategoryList.vue -->
<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { adminService } from '@/services'
  import type { ProductCategory } from '@/types/frontend/product'

  const treeData = ref<ProductCategory[]>([])
  const dialogVisible = ref(false)
  const form = ref({
    name: '',
    parent: null as number | null,
  })

  async function loadTree() {
    treeData.value = await adminService.fetchCategoryTree()
  }

  function openCreate(parentId: number | null = null) {
    form.value = { name: '', parent: parentId }
    dialogVisible.value = true
  }

  async function submit() {
    try {
      await adminService.createCategory(form.value)
      dialogVisible.value = false
      await loadTree()
    } catch (err) {
      console.error(err)
    }
  }

  onMounted(loadTree)
</script>

<template>
  <el-card>
    <h3>产品分类管理</h3>

    <el-tree
      :data="treeData"
      node-key="id"
      :props="{ label: 'name', children: 'children' }"
    >
      <template #default="{ data }">
        <span>{{ data.name }}</span>
        <el-button
          size="small"
          text
          @click="openCreate(data.id)"
        >
          新增子类
        </el-button>
      </template>
    </el-tree>

    <el-button
      type="primary"
      style="margin-top: 12px"
      @click="openCreate(null)"
    >
      新增一级分类
    </el-button>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    title="新增分类"
  >
    <el-input
      v-model="form.name"
      placeholder="分类名称"
    />
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="submit"
        >保存</el-button
      >
    </template>
  </el-dialog>
</template>
