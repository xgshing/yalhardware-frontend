// src/services/frontend/product.service.ts
// 前台展示，只读业务层

import { frontendProductApi } from '@/api'
import type { Product, CategoryProducts } from '@/types/frontend/product'

/**
 * 获取全部产品（前台）
 * - 调用前台 API
 * - 合并图片字段 allImages
 */
export async function fetchAllProducts(): Promise<Product[]> {
  const res = await frontendProductApi.list()

  return res.data.map((product) => {
    const casetypeImages =
      product.casetype?.flatMap((c) => c.images || []) ?? []
    const detailImages = product.detailImages ?? []

    return {
      ...product,
      allImages: [...casetypeImages, ...detailImages],
    }
  })
}

/**
 * 获取单个产品详情（前台）
 */
export async function fetchProductById(id: number): Promise<Product> {
  const res = await frontendProductApi.detail(id)
  const product = res.data

  const casetypeImages = product.casetype?.flatMap((c) => c.images || []) ?? []
  const detailImages = product.detailImages ?? []

  return {
    ...product,
    allImages: [...casetypeImages, ...detailImages],
  }
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
