<!-- src/views/admin/orders/OrderDetail.vue -->
<template>
  <el-card v-if="order">
    <!-- Header -->
    <div class="header">
      <div>
        <h2>订单号：{{ order.order_no }}</h2>
        <p class="muted">下单时间：{{ formatDate(order.created_at) }}</p>
      </div>

      <el-tag :type="statusTagType(order.status)">
        {{ order.status }}
      </el-tag>
    </div>

    <!-- Order Info -->
    <el-descriptions
      border
      :column="3"
      class="section"
    >
      <el-descriptions-item label="用户">
        {{ order.user_email }}
      </el-descriptions-item>
      <el-descriptions-item label="金额">
        ￥{{ order.total_amount }}
      </el-descriptions-item>
      <el-descriptions-item label="支付时间">
        {{ order.paid_at ? formatDate(order.paid_at) : '-' }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- Items -->
    <h3 class="section-title">商品列表</h3>
    <el-table
      :data="order.items"
      border
    >
      <el-table-column
        prop="product_title"
        label="商品"
      />
      <el-table-column
        prop="sku_title"
        label="SKU"
      />
      <el-table-column
        prop="quantity"
        label="数量"
        width="100"
      />
      <el-table-column
        prop="price"
        label="单价"
        width="120"
      />
    </el-table>

    <!-- Fulfillments -->
    <h3 class="section-title">发货记录</h3>
    <el-table
      v-if="order.fulfillments.length"
      :data="order.fulfillments"
      border
    >
      <el-table-column
        prop="carrier"
        label="物流公司"
      />
      <el-table-column
        prop="tracking_no"
        label="运单号"
      />
      <el-table-column
        prop="shipped_at"
        label="发货时间"
      >
        <template #default="{ row }">
          {{ formatDate(row.shipped_at) }}
        </template>
      </el-table-column>
    </el-table>

    <el-empty
      v-else
      description="暂无发货记录"
    />

    <!-- Actions -->
    <div class="actions">
      <el-button
        v-if="order.actions.includes('ship')"
        type="primary"
        @click="openShipDialog"
      >
        发货
      </el-button>
    </div>
  </el-card>

  <!-- Ship Dialog -->
  <el-dialog
    v-model="shipDialogVisible"
    title="订单发货"
    width="500px"
  >
    <el-form
      :model="shipForm"
      label-width="100px"
    >
      <el-form-item label="物流公司">
        <el-input v-model="shipForm.carrier" />
      </el-form-item>

      <el-form-item label="运单号">
        <el-input v-model="shipForm.tracking_no" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="shipDialogVisible = false">取消</el-button>
      <el-button
        type="primary"
        @click="submitShipment"
      >
        确认发货
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { getAdminOrderDetail, shipAdminOrder } from '@/services'
  import { ElMessage } from 'element-plus'
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const order = ref<any>(null)

  const shipDialogVisible = ref(false)
  const shipForm = ref({
    carrier: '',
    tracking_no: '',
  })

  onMounted(async () => {
    order.value = await getAdminOrderDetail(route.params.id as string)
  })

  const formatDate = (date: string) => new Date(date).toLocaleString()

  const statusTagType = (status: string) => {
    return {
      PENDING: 'info',
      PAID: 'warning',
      SHIPPED: 'success',
      COMPLETED: 'success',
      CANCELED: 'danger',
    }[status]
  }

  const openShipDialog = () => {
    shipDialogVisible.value = true
  }

  const submitShipment = async () => {
    await shipAdminOrder(order.value.id, {
      carrier: shipForm.value.carrier,
      tracking_no: shipForm.value.tracking_no,
      items: order.value.items.map((i: any) => ({
        order_item_id: i.id,
        quantity: i.quantity,
      })),
    })

    ElMessage.success('发货成功')
    shipDialogVisible.value = false
    order.value = await getAdminOrderDetail(order.value.id)
  }
</script>

<style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .section {
    margin-top: 20px;
  }

  .section-title {
    margin: 24px 0 12px;
  }

  .actions {
    margin-top: 24px;
  }

  .muted {
    color: #999;
    font-size: 13px;
  }
</style>
