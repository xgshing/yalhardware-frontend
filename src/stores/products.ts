// stores/products.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '@/utils/request'
import { useAuthStore } from './auth'

interface Product {
  id: number
  name: string
  description: string
  price: string
  stock: number
  category: string
  image_url?: string
}

export const useProductsStore = defineStore('products', () => {
  const authStore = useAuthStore()

  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchProducts = async () => {
    isLoading.value = true
    error.value = null

    try {
      if (!authStore.isAuthenticated) {
        const ok = await authStore.validateToken()
        if (!ok) throw new Error('请先登录')
      }

      const response = await request.get('/products/')

      const data = response.data
      products.value = Array.isArray(data) ? data : (data?.results ?? [])
    } catch (err: any) {
      error.value = '获取商品失败'
      products.value = []
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    products,
    isLoading,
    error,
    fetchProducts,
  }
})
