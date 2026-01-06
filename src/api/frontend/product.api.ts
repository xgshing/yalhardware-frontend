// src/api/frontend/product.api.ts
import request from '@/utils/request'
import type { Product } from '@/types/frontend/product'

export const frontendProductApi = {
  list: () => request.get<Product[]>('/products/'),
  detail: (id: number) => request.get<Product>(`/products/${id}/`),
}
