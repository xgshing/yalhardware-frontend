// src/services/frontend/product.service.ts
// 业务逻辑处理和数据整理

import { frontendProductApi } from '@/api'
import { collectProductImages } from '@/utils/images'
import type { Product, CategoryProducts } from '@/types'

/**
 * 前台产品数据标准化
 * - 合并图片字段 allImages
 * - 后续可在此扩展（价格格式化 / 字段兼容等）
 */
function normalizeProduct(product: Product): Product {
  return {
    ...product,
    allImages: collectProductImages(product),
  }
}
/**
 * 获取全部产品（前台）
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
 * - 基于 fetchAllProducts 进行业务整理
 * - 不重复请求 API
 */
export async function fetchCategoryProducts(): Promise<CategoryProducts> {
  // 获取所有产品列表
  const products = await fetchAllProducts()

  const categoryMap: CategoryProducts = {}

  products.forEach((product) => {
    // 如果产品没有分类，则归类到 'Uncategorized'
    const categoryName = product.category?.name || 'Uncategorized'
    // 如果该分类尚未存在，则先初始化为空数组
    if (!categoryMap[categoryName]) {
      categoryMap[categoryName] = []
    }
    // 将当前产品加入对应分类的数组中
    categoryMap[categoryName].push(product)
  })

  // 返回按分类分组后的产品数据
  return categoryMap
}
