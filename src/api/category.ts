// src/api/category.ts
import request from '@/utils/request'

export interface Category {
  id: number
  name: string
  parent: number | null
  children?: Category[]
}

// 获取分类列表
export const getCategories = async (): Promise<Category[]> => {
  const res = await request.get<Category[]>('/categories/')
  return res.data
}

// 创建新分类
export const createCategory = async (data: {
  name: string
}): Promise<Category> => {
  const res = await request.post<Category>('/categories/', data)
  return res.data
}

export const categoryApi = {
  getCategories,
  createCategory,
}
