<!-- src/views/admin/products/ProductList.vue -->
<template>
  <div class="product-list">
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <el-button
        type="primary"
        @click="goCreate"
      >
        新建产品
      </el-button>
    </div>

    <!-- 产品表格 -->
    <el-table
      ref="tableRef"
      :data="products"
      row-key="id"
      border
      style="width: 100%"
    >
      <!-- 拖拽列（仅推荐产品） -->
      <el-table-column
        width="50"
        label=""
      >
        <template #default="{ row }">
          <el-icon
            v-if="row.is_featured"
            class="drag-handle"
          >
            <Rank />
          </el-icon>
        </template>
      </el-table-column>

      <!-- 封面图 -->
      <el-table-column
        label="封面"
        width="90"
      >
        <template #default="{ row }">
          <el-image
            v-if="row.cover"
            :src="row.cover"
            fit="cover"
            class="cover"
          />
        </template>
      </el-table-column>

      <!-- 产品名称 -->
      <el-table-column
        prop="name"
        label="产品名称"
        min-width="200"
      />

      <!-- 分类 -->
      <el-table-column
        label="分类"
        width="140"
      >
        <template #default="{ row }">
          {{ row.category?.name || '-' }}
        </template>
      </el-table-column>

      <!-- 价格 -->
      <el-table-column
        prop="price"
        label="价格"
        width="120"
      />

      <!-- 款式 -->
      <el-table-column
        label="款式"
        min-width="220"
      >
        <template #default="{ row }">
          <div v-if="row.variants?.length">
            <el-tag
              v-for="v in row.variants"
              :key="v.id"
              size="small"
              class="variant-tag"
            >
              {{ v.style_name }} {{ v.spec }}
            </el-tag>
          </div>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <!-- 上下架 -->
      <el-table-column
        label="上架"
        width="100"
      >
        <template #default="{ row }">
          <el-switch
            v-model="row.is_active"
            @change="toggleActive(row)"
          />
        </template>
      </el-table-column>

      <!-- 推荐 -->
      <el-table-column
        label="推荐"
        width="100"
      >
        <template #default="{ row }">
          <el-switch
            v-model="row.is_featured"
            @change="toggleFeatured(row)"
          />
        </template>
      </el-table-column>

      <!-- 操作 -->
      <el-table-column
        label="操作"
        width="200"
      >
        <template #default="{ row }">
          <el-button
            type="primary"
            link
            @click="goEdit(row.id)"
          >
            编辑
          </el-button>

          <el-button
            type="danger"
            link
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, nextTick } from 'vue'
  import { useRouter } from 'vue-router'
  import Sortable from 'sortablejs'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Rank } from '@element-plus/icons-vue'

  import { adminService } from '@/services'
  // patchAdminProduct,
  //   reorderFeaturedProducts,
  const router = useRouter()
  const products = ref<any[]>([])
  const tableRef = ref()

  /* ================== 数据加载 ================== */

  const loadProducts = async () => {
    const res = await adminService.fetchAdminProducts()
    products.value = res
  }

  /* ================== 页面跳转 ================== */

  const goCreate = () => {
    router.push('/admin/products/create')
  }

  const goEdit = (id: number) => {
    router.push(`/admin/products/${id}/edit`)
  }

  /* ================== 状态切换 ================== */
  const toggleActive = async (row: any) => {
    const old = row.is_active
    try {
      await adminService.patchAdminProduct(row.id, {
        is_active: row.is_active,
      })
      ElMessage.success('状态已更新')
    } catch (err) {
      console.error(err)
      row.is_active = old
      ElMessage.error('更新失败')
    }
  }

  const toggleFeatured = async (row: any) => {
    const old = row.is_featured
    try {
      await adminService.patchAdminProduct(row.id, {
        is_featured: row.is_featured,
      })
      ElMessage.success('推荐状态已更新')
    } catch (err) {
      console.error(err)
      row.is_featured = old
      ElMessage.error('更新失败')
    }
  }

  /* ================== 推荐产品拖拽排序 ================== */
  const initSortable = () => {
    const tbody = tableRef.value?.$el.querySelector('.el-table__body tbody')
    if (!tbody) return

    Sortable.create(tbody, {
      handle: '.drag-handle',
      animation: 150,
      onEnd: async () => {
        const featured = products.value
          .filter((p) => p.is_featured)
          .map((p, index) => ({ id: p.id, featured_order: index + 1 }))

        if (!featured.length) return

        try {
          await adminService.reorderFeaturedProducts(featured)
          // 更新本地顺序
          featured.forEach((f, i) => {
            const p = products.value.find((x) => x.id === f.id)
            if (p) p.featured_order = i + 1
          })
          ElMessage.success('推荐排序已保存')
        } catch (err) {
          console.error(err)
          ElMessage.error('排序保存失败')
        }
      },
    })
  }

  /* ================== 删除产品 ================== */
  const handleDelete = async (row: any) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除产品「${row.name}」吗？`,
        '删除确认',
        {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消',
        }
      )

      await adminService.deleteAdminProduct(row.id)

      ElMessage.success('产品已删除')

      // 重新加载列表
      await loadProducts()
    } catch (err) {
      // 用户点取消时会进入 catch，直接忽略即可
    }
  }

  onMounted(async () => {
    await loadProducts()
    await nextTick()
    initSortable()
  })
</script>

<style scoped>
  .product-list {
    padding: 16px;
  }

  .toolbar {
    margin-bottom: 16px;
  }

  .cover {
    width: 60px;
    height: 60px;
    border-radius: 6px;
  }

  .variant-tag {
    margin-right: 4px;
    margin-bottom: 4px;
  }

  .drag-handle {
    cursor: move;
    color: #999;
  }
</style>
