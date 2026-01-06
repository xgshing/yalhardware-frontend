<!-- src/views/admin/products/ProductForm.vue -->
<template>
  <el-form
    label-position="top"
    class="product-form"
  >
    <!-- ========== 基础信息 ========== -->
    <el-card class="glass-card">
      <h3>基础信息</h3>

      <el-form-item label="产品名称">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="产品分类">
        <el-cascader
          v-model="form.category_id"
          :options="categoryTree"
          :props="{
            value: 'id',
            label: 'name',
            children: 'children',
            emitPath: false,
          }"
        />
      </el-form-item>

      <el-form-item label="价格">
        <el-input-number
          v-model="form.price"
          :min="0"
        />
      </el-form-item>

      <el-form-item label="描述">
        <el-input
          type="textarea"
          v-model="form.description"
        />
      </el-form-item>
    </el-card>

    <!-- ========== 图片 ========== -->
    <el-card class="glass-card">
      <h3>图片</h3>

      <el-form-item label="主图">
        <ImageUpload
          v-model="coverFile"
          :existing-images="coverPreview ? [coverPreview] : []"
          @remove-remote="onCoverRemoved"
        />
      </el-form-item>

      <el-form-item label="详情图">
        <ImageUpload
          v-model="detailFiles"
          multiple
          :existing-images="detailPreviewUrls"
          @remove-remote="removeDetailImage"
        />
      </el-form-item>
    </el-card>

    <!-- ========== 款式 ========== -->
    <el-card class="glass-card">
      <h3>产品款式</h3>

      <div
        v-for="(v, i) in variants"
        :key="v.uid"
        class="variant-row"
      >
        <el-input
          v-model="v.style_name"
          placeholder="款式名称"
        />
        <el-input
          v-model="v.spec"
          placeholder="规格"
        />
        <el-input-number
          v-model="v.stock"
          :min="0"
        />

        <ImageUpload
          :model-value="v.imageFiles"
          :existing-images="v.imageUrl ? [v.imageUrl] : []"
          @update:model-value="(val) => handleVariantImageUpdate(v, val)"
          @remove-remote="() => onVariantImageRemoved(v)"
        />

        <el-button
          type="danger"
          text
          @click="removeVariant(i)"
        >
          删除
        </el-button>
      </div>

      <el-button @click="addVariant">+ 添加款式</el-button>
    </el-card>

    <!-- ========== 提交 ========== -->
    <div class="actions">
      <el-button
        type="primary"
        @click="submit"
        >保存</el-button
      >
    </div>
  </el-form>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import ImageUpload from '@/components/ImageUpload.vue'
  import { useCategories } from '@/composables/useCategories'
  import { adminService } from '@/services'
  import type { ProductCategory } from '@/types/frontend/product'

  /* ========== props / emits ========== */
  const props = defineProps<{
    initialData?: {
      form: any
      coverUrl?: string | null
      detailImageUrls?: string[]
      variants?: any[]
    }
  }>()

  const emit = defineEmits<{
    (e: 'submit', fd: FormData): void
  }>()

  /* ========== 分类 ========== */
  const { fetchCategories } = useCategories()
  const categoryTree = ref<ProductCategory[]>([])

  /* ========== 表单 ========== */
  const form = ref({
    name: '',
    category_id: null as number | null,
    price: null as number | null,
    description: '',
  })

  /* ========== 主图 ========== */
  const coverFile = ref<File | null>(null)
  const coverPreview = ref<string | null>(null)
  const coverCleared = ref(false)

  /* ========== 详情图 ========== */
  const detailFiles = ref<File[]>([])
  const detailPreviewUrls = ref<string[]>([])
  const removedDetailImages = ref<string[]>([])

  /* ========== 款式 ========== */
  const variants = ref<any[]>([])

  /* ========== 初始化 ========== */
  onMounted(async () => {
    categoryTree.value = await adminService.fetchCategoryTree()
  })

  watch(
    () => props.initialData,
    async (data) => {
      if (!data) return

      await fetchCategories()
      Object.assign(form.value, data.form)

      coverPreview.value = data.coverUrl || null
      coverFile.value = null
      coverCleared.value = false

      detailPreviewUrls.value = data.detailImageUrls || []

      // 修复：使用 imageFiles 数组
      variants.value = (data.variants || []).map((v) => ({
        id: v.id,
        uid: v.uid ?? `${v.id}-${Date.now()}`,
        style_name: v.style_name,
        spec: v.spec,
        stock: Number(v.stock) || 0,
        imageFiles: [], // 始终初始化为空数组
        imageUrl: v.imageUrl ?? null,
      }))
    },
    { immediate: true }
  )

  /* ========== 主图逻辑 ========== */
  function onCoverRemoved() {
    coverFile.value = null
    coverPreview.value = null
    coverCleared.value = true
  }

  watch(coverFile, (v) => {
    if (v) coverCleared.value = false
  })

  /* ========== 详情图删除 ========== */
  function removeDetailImage(url: string) {
    detailPreviewUrls.value = detailPreviewUrls.value.filter((u) => u !== url)
    removedDetailImages.value.push(url)
  }

  /* ========== 款式图片更新处理 ========== */
  function handleVariantImageUpdate(
    variant: any,
    newValue: File | File[] | null
  ) {
    // 处理 ImageUpload 组件返回的值
    if (newValue === null) {
      variant.imageFiles = []
    } else if (Array.isArray(newValue)) {
      variant.imageFiles = [...newValue]
    } else {
      variant.imageFiles = [newValue] // 单个文件包装成数组
    }

    // 如果有新文件上传，清空原有的图片URL
    if (variant.imageFiles.length > 0 && variant.imageUrl) {
      variant.imageUrl = null
    }
  }

  /* ========== 款式操作 ========== */
  function onVariantImageRemoved(v: any) {
    v.imageUrl = null
    v.imageFiles = []
  }

  function addVariant() {
    variants.value.push({
      uid: `${Date.now()}-${Math.random()}`,
      style_name: '',
      spec: '',
      stock: 0,
      imageFiles: [],
      imageUrl: null,
    })
  }

  function removeVariant(i: number) {
    variants.value.splice(i, 1)
  }

  /* ========== 提交 ========== */
  /* ========== 提交 ========== */
  async function submit() {
    if (!form.value.name || !form.value.category_id) {
      ElMessage.warning('请填写完整信息')
      return
    }

    const fd = new FormData()

    Object.entries(form.value).forEach(([k, v]) => {
      if (v !== null && v !== '') fd.append(k, String(v))
    })

    // 主图三态
    if (coverFile.value) {
      fd.append('cover', coverFile.value)
    } else if (coverCleared.value) {
      fd.append('cover', '')
    }

    detailFiles.value.forEach((f) => fd.append('uploaded_images', f))

    const validVariants = variants.value.filter((v) => v.style_name?.trim())

    if (validVariants.length) {
      const variantsData = validVariants.map((v) => ({
        id: v.id,
        uid: v.uid,
        style_name: v.style_name,
        spec: v.spec ?? '',
        stock: Number(v.stock) || 0,
        hasImage: v.imageFiles?.length > 0,
        imageUrl: v.imageUrl,
        remove_image: !v.imageUrl && v.imageFiles.length === 0,
      }))

      fd.append('uploaded_variants', JSON.stringify(variantsData))

      // 用 uid 绑定图片
      validVariants.forEach((v) => {
        const imageFile = v.imageFiles?.[0]
        if (imageFile) {
          const key = v.uid
          fd.append(`uploaded_variants_images_${key}`, imageFile)
        }
      })
    }

    if (removedDetailImages.value.length) {
      fd.append(
        'removed_detail_images',
        JSON.stringify(removedDetailImages.value)
      )
    }

    // 提交数据
    emit('submit', fd)

    // ⭐ 关键修复：在提交后更新本地的 imageUrl
    // 为新上传的图片生成预览URL
    validVariants.forEach((v) => {
      const imageFile = v.imageFiles?.[0]
      if (imageFile && !v.imageUrl) {
        // 生成本地预览URL
        v.imageUrl = URL.createObjectURL(imageFile)
        // 清空文件数组，避免重复上传
        v.imageFiles = []
      }
    })
  }
</script>

<style scoped>
  .product-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .variant-row {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 12px;
    margin-bottom: 12px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
  }

  .category-row {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .category-cascader {
    flex: 1;
  }

  .product-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .add-btn {
    margin-top: 8px;
  }
</style>
