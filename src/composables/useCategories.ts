// src/composables/useCategories.ts
import { categoryApi, type Category } from '@/api'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

interface CreateCategoryPayload {
  name: string
  parent?: number | null
}

export function useCategories() {
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const showAddCategory = ref(false)
  const newCategoryName = ref('')

  const fetchCategories = async () => {
    loading.value = true
    try {
      const res = await categoryApi.getCategories()
      categories.value = res // 如果 categoryApi.getCategories 已经返回 data，请写 categories.value = res.data
    } catch {
      ElMessage.error('获取分类失败')
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (
    data: CreateCategoryPayload
  ): Promise<Category | null> => {
    if (!data.name.trim()) {
      ElMessage.warning('分类名称不能为空')
      return null
    }

    try {
      const res = await categoryApi.createCategory(data)
      categories.value.push(res) // 如果 categoryApi.createCategory 返回 data
      ElMessage.success('分类创建成功')
      return res
    } catch {
      ElMessage.error('分类创建失败')
      return null
    }
  }

  return {
    categories,
    loading,
    showAddCategory,
    newCategoryName,
    fetchCategories,
    createCategory,
  }
}
