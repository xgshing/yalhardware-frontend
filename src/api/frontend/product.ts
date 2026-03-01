// src/api/frontend/product.ts
import type { Product } from '@/types/frontend/product'
import { frontendRequest } from '@/utils/request'

export const frontendProductApi = {
  list: () => frontendRequest.get<Product[]>('/products/'),
  detail: (id: number) => frontendRequest.get<Product>(`/products/${id}/`),
}
