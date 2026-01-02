// stores/products.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
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

  // 状态
  const products = ref<Product[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 获取商品
  const fetchProducts = async () => {
    console.log('🛒 开始获取商品...')

    isLoading.value = true
    error.value = null

    try {
      // 检查认证
      if (!authStore.isAuthenticated) {
        console.warn('⚠️ 用户未认证，尝试重新认证...')

        // 尝试重新认证
        const isValid = await authStore.validateToken()
        if (!isValid) {
          throw new Error('请先登录')
        }
      }

      // 获取 token
      const token = authStore.token || localStorage.getItem('token')
      console.log(
        '🔑 使用的 token:',
        token ? token.substring(0, 20) + '...' : '无'
      )

      if (!token) {
        throw new Error('认证 token 不存在')
      }

      // 配置请求
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }

      console.log('📡 发送请求到: http://localhost:8000/api/products/')

      const response = await axios.get(
        'http://localhost:8000/api/products/',
        config
      )

      console.log('✅ 请求成功，状态码:', response.status)
      console.log('📦 响应数据:', response.data)

      // 处理数据
      let data = response.data

      if (Array.isArray(data)) {
        products.value = data
        console.log(`✅ 设置 ${data.length} 个商品`)
      } else if (data?.results && Array.isArray(data.results)) {
        products.value = data.results
        console.log(`✅ 从 results 字段设置 ${data.results.length} 个商品`)
      } else {
        console.warn('⚠️ 未知的数据结构，尝试转换:', data)
        products.value = Object.values(data || {})
      }

      console.log('🎯 最终商品数量:', products.value.length)
    } catch (err: any) {
      console.error('❌ 获取商品失败:', err)

      if (axios.isAxiosError(err)) {
        console.error('📡 Axios 错误详情:')
        console.error('状态码:', err.response?.status)
        console.error('错误信息:', err.response?.data)

        if (err.response?.status === 401) {
          error.value = '认证失败，请重新登录'

          // 清除无效的认证信息
          authStore.logout()
        } else if (err.response?.status === 403) {
          error.value = '没有权限访问商品列表'
        } else if (err.response?.status === 404) {
          error.value = '商品 API 端点不存在'
        } else {
          error.value = `请求失败: ${err.response?.status} ${err.response?.statusText}`
        }
      } else {
        error.value = err.message || '获取商品失败'
      }

      // 清空商品列表
      products.value = []
    } finally {
      isLoading.value = false
      console.log('🏁 请求完成')
    }
  }

  return {
    products,
    isLoading,
    error,
    fetchProducts,
  }
})
