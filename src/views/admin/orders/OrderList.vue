<!-- src/views/admin/orders/OrderList.vue -->
<template>
  <el-card>
    <div class="header">
      <h2>Orders</h2>
    </div>

    <el-table
      :data="orders"
      stripe
      v-loading="loading"
    >
      <el-table-column
        prop="order_no"
        label="订单号"
        width="220"
      />
      <el-table-column
        label="用户"
        width="220"
      >
        <template #default="{ row }">{{ row.user_email }}</template>
      </el-table-column>
      <el-table-column
        label="状态"
        width="120"
      >
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="total_amount"
        label="金额"
        width="120"
      />
      <el-table-column
        prop="created_at"
        label="下单时间"
      />
      <el-table-column
        label="操作"
        width="220"
      >
        <template #default="{ row }">
          <el-button
            size="small"
            @click="viewDetail(row.id)"
            >查看</el-button
          >
          <el-button
            v-if="row.actions.includes('ship')"
            size="small"
            type="primary"
            @click="viewDetail(row.id)"
          >
            发货
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      v-if="total > 0"
      style="margin-top: 16px; text-align: right"
      background
      layout="prev, pager, next, sizes, total"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      :page-sizes="[20, 50, 100]"
      @size-change="onPageSizeChange"
      @current-change="onPageChange"
    />
  </el-card>
</template>

<script setup lang="ts">
  import { getAdminOrders } from '@/services'
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const orders = ref<any[]>([])
  const loading = ref(false)

  // 分页状态
  const currentPage = ref(1)
  const pageSize = ref(20)
  const total = ref(0)

  const loadOrders = async () => {
    loading.value = true
    const params = { page: currentPage.value, page_size: pageSize.value }
    try {
      const { results, count } = await getAdminOrders(params)
      orders.value = results
      total.value = count
    } catch (error) {
      console.error('加载订单失败', error)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    loadOrders()
  })

  const viewDetail = (id: number) => {
    router.push(`/admin/orders/${id}`)
  }

  const statusTagType = (status: string) => {
    return {
      PENDING: 'info',
      PAID: 'warning',
      SHIPPED: 'success',
      COMPLETED: 'success',
      CANCELED: 'danger',
    }[status]
  }

  // 分页事件
  const onPageChange = (page: number) => {
    currentPage.value = page
    loadOrders()
  }

  const onPageSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    loadOrders()
  }
</script>

<style scoped>
  .header {
    margin-bottom: 16px;
  }
</style>
