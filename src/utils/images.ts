// utils/images.ts
// 图片类工具函数
/**
 * 获取产品的第一张可用图片URL
 * 图片获取优先级：cover > style_image > detail_images
 */
import type { Product } from '@/types/frontend/product'

export function getPrimaryImage(product: Product): string {
  if (!product) return ''

  // 1️⃣ cover（最高优先级）
  if (product.cover) {
    return product.cover
  }

  // 2️⃣ style_image
  if ((product as any).style_image) {
    return (product as any).style_image
  }
  if ((product as any).styleImage) {
    return (product as any).styleImage
  }

  // 3️⃣ detail_images / detailImages（取第一张）
  const detailImages =
    (product as any).detail_images || (product as any).detailImages || []

  if (Array.isArray(detailImages) && detailImages.length > 0) {
    return detailImages[0]
  }

  // 4️⃣ 都没有，返回空字符串（由 ProductCard 兜底）
  return ''
}

export function normalizeProduct(product: Product): Product {
  // 从 casetype 中提取所有图片
  const casetypeImages = product.casetype?.flatMap((C) => C.images ?? []) ?? []

  // 从 casetype 中提取所有图片
  const detailImages = product.detailImages ?? []
  return {
    ...product,
    allImages: [...casetypeImages, ...detailImages],
  }
}
