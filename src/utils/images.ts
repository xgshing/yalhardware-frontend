// utils/images.ts
// 图片类工具函数
/**
 * 获取产品的第一张可用图片URL
 * 图片获取优先级：cover > style_image > detail_images
 */
import type { Product } from '@/types/frontend/product'
import { PRODUCT_PLACEHOLDER_IMAGE } from '@/constants/images'

export function getPrimaryImage(product: Product): string {
  return (
    product.cover ||
    product.variants?.[0]?.style_image ||
    product.detail_images?.[0]?.image ||
    ''
  )
}

// 合并图片处理工具
export function collectProductImages(product: Product): string[] {
  const images: string[] = []

  product.variants?.forEach((v) => {
    if (v.style_image) images.push(v.style_image)
  })

  product.detail_images?.forEach((i) => {
    if (i.image) images.push(i.image)
  })

  return images.length
    ? Array.from(new Set(images))
    : [PRODUCT_PLACEHOLDER_IMAGE]
}
