<!-- 首页内容管理后台通用组件 -->
<!-- src/components/admin/ContentPage.vue -->
<template>
  <el-card class="page-card">
    <template #header>
      <div class="card-header">
        <span>{{ config.title }}</span>
        <el-button
          type="primary"
          @click="openCreate"
          >新增</el-button
        >
      </div>
    </template>

    <div
      class="table-wrapper"
      style="position: relative"
    >
      <el-table
        :data="list"
        border
        style="min-height: 400px"
      >
        <el-table-column
          v-for="col in config.tableColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
        />
        <el-table-column label="图片">
          <template #default="{ row }">
            <img
              v-for="img in getRowImages(row)"
              :key="img.id || img.image_url || img"
              :src="img.image_url || img"
              class="preview-img"
            />
          </template>
        </el-table-column>
        <el-table-column width="120">
          <template #default="{ row }">
            <el-button
              size="small"
              @click="openEdit(row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="deleteRow(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-skeleton
        v-if="!loaded"
        :rows="5"
        animated
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);
        "
      />
    </div>

    <el-dialog
      v-model="visible"
      width="700px"
      :before-close="closeDialog"
    >
      <ContentForm
        :key="formKey"
        v-model="form"
        :config="config"
        :existing-images="existingImages"
        @remove-remote="removeRemoteImage"
      />
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submit"
          >保存</el-button
        >
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch, nextTick } from 'vue'
  import { useRoute } from 'vue-router'
  import ContentForm from '@/views/admin/content/ContentForm.vue'
  import { contentConfigs } from '@/configs/admin/content'

  const route = useRoute()
  const key = ref(route.params.key as keyof typeof contentConfigs)
  const config = ref(contentConfigs[key.value])

  const list = ref<any[]>([])
  const loaded = ref(true)
  const visible = ref(false)
  const currentId = ref<number | null>(null)
  const form = ref<Record<string, any>>({})
  const existingImages = ref<{ id: number; image_url: string }[]>([])

  const formKey = ref(0)

  // 获取表格显示图片
  function getRowImages(row: any) {
    if (row.images) return row.images
    if (row.icon)
      return Array.isArray(row.icon) ? row.icon : [{ image_url: row.icon }]
    return []
  }

  // 获取列表
  async function fetchList() {
    loaded.value = false
    try {
      const res = await config.value.api.list()
      list.value = res.data || []
      console.log('[DEBUG] fetchList', list.value)
    } finally {
      loaded.value = true
    }
  }

  // 新增
  function openCreate() {
    console.log('[DEBUG] openCreate called')
    currentId.value = null
    form.value = {}
    existingImages.value = []
    formKey.value++ // 🔥强制刷新 ContentForm
    visible.value = true
    nextTick(() =>
      console.log('[DEBUG] openCreate nextTick, visible=', visible.value)
    )
  }

  // 编辑
  function openEdit(row: any) {
    console.log('[DEBUG] openEdit called, row=', row)
    currentId.value = row.id
    form.value = { ...row }
    console.log('[DEBUG] openEdit called, row=', row)
    console.log(
      '[DEBUG] existingImages before mapping=',
      row.images || row.icon
    )
    existingImages.value = getRowImages(row).map((i: any) => ({
      id: i.id,
      image_url: i.image_url,
    }))
    formKey.value++ // 🔥强制刷新 ContentForm
    console.log('[DEBUG] openEdit existingImages=', existingImages.value)
    visible.value = true
    nextTick(() =>
      console.log('[DEBUG] openEdit nextTick, visible=', visible.value)
    )
  }

  // 删除行
  async function deleteRow(row: any) {
    console.log('[DEBUG] deleteRow called, row=', row)
    try {
      await config.value.api.delete(row.id)
      await fetchList()
    } catch (err) {
      console.error('[ERROR] deleteRow failed', err)
    }
  }

  // 删除单张图片
  function removeRemoteImage(id: number) {
    console.log('[DEBUG] removeRemoteImage called, id=', id)
    console.log('[DEBUG] existingImages before removal=', existingImages.value)
    existingImages.value = existingImages.value.filter((i) => i.id !== id)
    console.log('[DEBUG] existingImages after removal=', existingImages.value)
  }

  // 提交
  async function submit() {
    console.log(
      '[DEBUG] submit called, form=',
      form.value,
      'existingImages=',
      existingImages.value
    )
    const fd = new FormData()
    Object.entries(form.value).forEach(([k, v]) => {
      if (k !== 'images') fd.append(k, v)
    })
    existingImages.value.forEach((i) =>
      fd.append('existing_images', String(i.id))
    )

    console.log('[DEBUG] FormData entries:')
    for (const pair of fd.entries()) {
      console.log(pair[0], pair[1])
    }

    if (form.value.images) {
      // 如果是单文件对象，转换成数组
      const files = Array.isArray(form.value.images)
        ? form.value.images
        : [form.value.images]

      files.forEach((file: File) => fd.append('images', file))
    }

    try {
      if (!currentId.value) {
        const res = await config.value.api.create(fd)
        currentId.value = res.data.id
        console.log('[DEBUG] create result=', res.data)
      } else {
        await config.value.api.update(currentId.value, fd)
      }
      await fetchList()
      visible.value = false
      console.log('[DEBUG] submit finished, visible=', visible.value)
    } catch (err) {
      console.error('[ERROR] submit failed', err)
    }
  }

  // 关闭弹窗
  function closeDialog() {
    console.log('[DEBUG] closeDialog called')
    visible.value = false
  }

  // 页面加载
  onMounted(fetchList)

  // route key 改变重新加载
  watch(
    () => route.params.key,
    async (newKey) => {
      if (!newKey) return
      key.value = newKey as keyof typeof contentConfigs
      config.value = contentConfigs[key.value]
      console.log('[DEBUG] route key changed, newKey=', newKey)
      await fetchList()
    }
  )
</script>

<style scoped>
  .preview-img {
    width: 60px;
    height: 60px;
    margin-right: 5px;
    object-fit: cover;
    border-radius: 4px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
