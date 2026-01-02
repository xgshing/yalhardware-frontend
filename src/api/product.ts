// src/api/product.ts
import request from '@/utils/request'
import type { Category } from './category'

export interface Product {
  id: number
  name: string
  category_id: number
  category?: Category
  price?: number
  stock?: number
  [key: string]: any
}

export interface Variant {
  id?: number
  name: string
  spec: string
  stock: number
  price: number | null
  is_featured: boolean
}

const BASE_URL = '/admin/products/'

export const productApi = {
  /** 获取产品列表 */
  async getProducts(params?: Record<string, any>): Promise<Product[]> {
    try {
      const { data } = await request.get(BASE_URL, { params })
      return data
    } catch (error) {
      console.error('获取产品列表失败:', error)
      throw error
    }
  },

  /** 创建产品 */
  async createProduct(formData: FormData): Promise<Product> {
    try {
      // 确保 FormData 包含正确的字段名
      // 根据你前端 ProductEdit.vue 中的字段名调整

      const { data } = await request.post(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // 注意：multipart/form-data 会自动设置正确的 Content-Type
          // 显式设置可能会导致边界值问题
        },
      })
      return data
    } catch (error) {
      console.error('创建产品失败:', error)
      throw error
    }
  },

  /** 编辑产品 */
  async updateProduct(id: number, formData: FormData): Promise<Product> {
    try {
      const { data } = await request.put(`${BASE_URL}${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (error) {
      console.error('更新产品失败:', error)
      throw error
    }
  },
}
