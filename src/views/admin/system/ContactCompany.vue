<!-- src/views/admin/system/ContactCompany.vue -->
<template>
  <el-card class="company-card">
    <template #header>
      <div class="card-header">
        <span>公司信息配置</span>
      </div>
    </template>

    <el-form
      :model="form"
      label-width="160px"
      class="company-form"
    >
      <el-form-item label="Company Name">
        <el-input v-model="form.company_name" />
      </el-form-item>

      <el-form-item label="Address">
        <el-input
          v-model="form.address"
          type="textarea"
          :rows="4"
        />
      </el-form-item>

      <el-divider />

      <el-form-item label="Contact Person">
        <el-input v-model="form.contact_person" />
      </el-form-item>

      <el-form-item label="Mob / WeChat">
        <el-input v-model="form.mobile" />
      </el-form-item>

      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click="save"
        >
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { adminService } from '@/services'

  const loading = ref(false)

  const form = ref({
    company_name: '',
    address: '',
    contact_person: '',
    mobile: '',
    email: '',
  })

  const loadData = async () => {
    try {
      const data = await adminService.getCompanyProfile()

      Object.assign(form.value, data)
    } catch (error) {
      console.error('加载公司信息失败', error)
    }
  }

  const save = async () => {
    loading.value = true
    try {
      await adminService.saveCompanyProfile(form.value)
      ElMessage.success('保存成功')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadData)
</script>

<style scoped>
  .company-card {
    max-width: 900px;
  }

  .card-header {
    font-size: 16px;
    font-weight: 600;
  }
</style>
