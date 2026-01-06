// src/composables/useCategories.ts
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

import { adminService } from '@/services'
import type { ProductCategory } from '@/types/frontend/product'

interface CreateCategoryPayload {
  name: string
  parent?: number | null
}

export function useCategories() {
  /* ================= state ================= */
  const categories = ref<ProductCategory[]>([])
  const loading = ref(false)
  const showAddCategory = ref(false)
  const newCategoryName = ref('')

  /* ================= actions ================= */

  /** 获取分类树 */
  const fetchCategories = async () => {
    loading.value = true
    try {
      categories.value = await adminService.fetchCategoryTree()
    } catch (e) {
      ElMessage.error('获取分类失败')
    } finally {
      loading.value = false
    }
  }

  /** 新建分类 */
  const addCategory = async (
    data: CreateCategoryPayload
  ): Promise<ProductCategory | null> => {
    if (!data.name.trim()) {
      ElMessage.warning('分类名称不能为空')
      return null
    }

    try {
      const created = await adminService.createCategory(data)

      // ⚠️ 如果是树结构，真实项目里通常要重新 fetch
      await fetchCategories()

      ElMessage.success('分类创建成功')
      return created
    } catch (e) {
      ElMessage.error('分类创建失败')
      return null
    }
  }

  return {
    /* state */
    categories,
    loading,
    showAddCategory,
    newCategoryName,

    /* actions */
    fetchCategories,
    addCategory,
  }
}
