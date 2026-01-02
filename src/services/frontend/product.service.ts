// src/services/product.service.ts
//前端展示，只读接口
import request from '@/utils/request'
import type { Product, CategoryProducts } from '@/types/product'

// 获取全部产品列表。函数返回的是 Promise,返回值类型显式声明为：Promise<Product[]>调用方能获得完整类型提示
export async function fetchAllProducts(): Promise<Product[]> {
  const res = await request.get<Product[]>('/products/')
  const products = res.data.map((product) => {
    const casetypeImages =
      product.casetype?.flatMap((c) => c.images || []) || []
    const detailImages = product.detailImages || []
    return {
      ...product,
      allImages: [...casetypeImages, ...detailImages],
    }
  })
  return products
}

// 根据 ID 获取单个产品.参数 id: number明确限制调用方必须传数字
export async function fetchProductById(id: number): Promise<Product> {
  const res = await request.get<Product>(`/products/${id}/`)
  const product = res.data
  const casetypeImages = product.casetype?.flatMap((c) => c.images || []) || []
  const detailImages = product.detailImages || []
  return { ...product, allImages: [...casetypeImages, ...detailImages] }
}

// 获取并“按分类分组”的产品数据.不直接请求新接口,基于已有接口fetchAllProducts对数据做一次业务整理
// 按分类名字分组
export async function fetchCategoryProducts(): Promise<CategoryProducts> {
  const res = await request.get<Product[]>('/products/')
  const products = res.data

  // 使用 category.name 作为 key
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
