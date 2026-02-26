  <!-- src/views/admin/inventory/InventoryList.vue -->
   <template>
    <el-card>
      <template #header>
        <span>库存流水</span>
      </template>

      <el-table :data="records" border stripe v-loading="loading">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="variant_id" label="Variant ID" />
        <el-table-column prop="change" label="变更数量" />
        <el-table-column prop="reason" label="原因" />
        <el-table-column prop="order_sn" label="订单号" />
        <el-table-column prop="created_at" label="时间" />
      </el-table>
    </el-card>
  </template>

<script setup lang="ts">
import { getInventoryRecords } from '@/services'
import { onMounted, ref } from 'vue'

const records = ref<any[]>([])
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  records.value = await getInventoryRecords()
  loading.value = false
})
</script>