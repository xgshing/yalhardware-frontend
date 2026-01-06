<!-- src/views/admin/products/ProductPage.vue -->
<template>
  <ProductForm
    v-if="loaded"
    :initial-data="initialData"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { ElLoading, ElMessage } from 'element-plus'
  import ProductForm from './ProductForm.vue'
  import { adminService } from '@/services'

  /* ================= 路由 ================= */
  const route = useRoute()
  const router = useRouter()

  const loaded = ref(false)
  const initialData = ref<any>(null)

  /* ================= 判断是否编辑 ================= */
  const isEdit = () => !!route.params.id

  /* ================= 数据加载（核心） ================= */
  async function loadProduct(id: number) {
    const loading = ElLoading.service({ text: '加载中...' })
    loaded.value = false

    try {
      const data = await adminService.fetchAdminProductDetail(id)

      initialData.value = {
        form: {
          name: data.name,
          category_id: data.category?.id ?? null,
          price: Number(data.price ?? 0),
          description: data.description ?? '',
          is_active: data.is_active ?? true,
          is_featured: data.is_featured ?? false,
        },

        coverUrl: data.cover ?? null,

        detailImageUrls: Array.isArray(data.detail_images)
          ? data.detail_images.map((img: any) => img.image)
          : [],

        variants: Array.isArray(data.variants)
          ? data.variants.map((v: any) => ({
              id: v.id,
              uid: v.id, // 关键：稳定 key
              style_name: v.style_name,
              spec: v.spec,
              stock: Number(v.stock ?? 0),
              imageUrl:
                typeof v.style_image === 'string' && v.style_image.length > 0
                  ? v.style_image
                  : null,
            }))
          : [],
      }
    } finally {
      loaded.value = true
      loading.close()
    }
  }

  /* ================= 监听路由变化（关键修复） ================= */
  watch(
    () => route.params.id,
    (id) => {
      if (!id) {
        // 创建模式
        initialData.value = null
        loaded.value = true
        return
      }

      loadProduct(Number(id))
    },
    { immediate: true }
  )

  /* ================= 提交 ================= */
  async function handleSubmit(fd: FormData) {
    const loading = ElLoading.service({ text: '保存中...' })

    try {
      if (isEdit()) {
        await adminService.updateAdminProduct(Number(route.params.id), fd)
        ElMessage.success('保存成功')
        router.push('/admin/products')
      } else {
        await adminService.createAdminProduct(fd)
        ElMessage.success('创建成功')
        router.push('/admin/products')
      }
    } catch (error) {
      ElMessage.error('保存失败')
      console.error('保存错误:', error)
    } finally {
      loading.close()
    }
  }
</script>
