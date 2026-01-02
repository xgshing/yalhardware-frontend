<!-- src/views/admin/system/CompanyAbout.vue -->
<template>
  <el-card
    class="company-about-card"
    shadow="never"
  >
    <h2 class="page-title">公司介绍（About Us）</h2>

    <el-form
      label-width="140px"
      class="company-about-form"
    >
      <el-form-item label="公司介绍内容">
        <QuillEditor
          v-model="form.about_html"
          :modules="editorModules"
        />
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

  import QuillEditor from '@/components/editor/QuillEditor.vue'
  import '@vueup/vue-quill/dist/vue-quill.snow.css'
  import { getCompanyProfile, saveCompanyProfile } from '@/api/admin/company'

  /* ---------------- state ---------------- */
  const form = ref({
    about_html: '',
  })
  const loading = ref(false)

  /* ---------------- toolbar modules ---------------- */
  const editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['link', 'image'],
      ['clean'],
    ],
  }

  /* ---------------- api ---------------- */
  const loadData = async () => {
    try {
      const res = await getCompanyProfile()
      form.value.about_html = res.data?.about_html || ''
    } catch (e) {
      ElMessage.error('获取公司介绍失败')
    }
  }

  const save = async () => {
    loading.value = true
    try {
      await saveCompanyProfile({ about_html: form.value.about_html })
      ElMessage.success('保存成功')
    } catch (e) {
      ElMessage.error('保存失败')
    } finally {
      loading.value = false
    }
  }

  onMounted(loadData)
</script>

<style scoped>
  .company-about-card {
    padding: 24px;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .company-about-form {
    width: 100%;
  }
</style>
