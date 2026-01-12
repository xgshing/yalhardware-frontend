// src/services/frontend/product.service.ts
// 前台展示，只读业务层

import { frontendProductApi } from '@/api'
import { normalizeProduct } from '@/utils/images'
import type { Product, CategoryProducts } from '@/types/frontend/product'

/**
 * 获取全部产品（前台）
 * - 调用前台 API
 * - 合并图片字段 allImages
 */
export async function fetchAllProducts(): Promise<Product[]> {
  // 调用前端产品 API，获取产品列表响应
  const res = await frontendProductApi.list()
  // 对接口返回的产品数组进行处理
  return res.data.map(normalizeProduct)
}

/**
 * 获取单个产品详情
 */
export async function fetchProductById(id: number): Promise<Product> {
  // 调用产品详情接口，传入产品 ID
  const res = await frontendProductApi.detail(id)
  // 接口返回的产品数据
  return normalizeProduct(res.data)
}

/**
 * 获取按分类分组的产品数据
 * - 基于 fetchAllProducts 的业务整理
 * - 不直接再调一次 API
 */
export async function fetchCategoryProducts(): Promise<CategoryProducts> {
  const products = await fetchAllProducts()

  const categoryMap: CategoryProducts = {}

  products.forEach((product) => {
    const categoryName = product.category?.name || 'Uncategorized'
    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = []
    }
    categoryMap[categoryName].push(product)
  })

  return categoryMap
}
