// src/types/product.ts
export interface CaseType {
  id: number
  text: string
  images?: string[] // ⭐ 改为数组，可选
}

export interface Variant {
  id?: number
  uid: number
  style_name: string
  spec: string
  stock: number
  style_image: string
  existingImage?: string
  imageUrl?: string | null // 👈 编辑回显（新增）
}

export interface Product {
  id: number
  name: string
  cover?: string
  images?: ProductImage[]
  variants?: Variant[]
  is_featured?: boolean
  featured_order: number

  url?: string
  reviews?: string
  price?: string
  description?: string
  specifications?: string
  salesVolume?: number
  casetype?: CaseType[]
  detailImages?: string[]
  category?: {
    // ✅ 改成对象
    id: number
    name: string
    parent?: number | null
  } | null
  allImages?: string[]
  [key: string]: any // ⭐ 允许额外字段
}

export interface CategoryProducts {
  [key: string]: Product[]
}

export interface CardData {
  id: number
  title: string
  description: string
  imageUrl: string
}

export interface AccordionItem {
  title: string
  isOpen: boolean
}

export interface ThumbnailBreakpoints {
  [key: number]: {
    slidesPerView: number
    spaceBetween: number
  }
}

// 购物车商品类型
export interface CartItem {
  id: number
  name: string
  price?: string
  unitPrice?: string
  caseType?: string
  image: string
  quantity: number
  maxStock?: number
}

// 添加到购物车的商品类型（允许部分属性可选）
export interface AddToCartItem {
  id?: number
  name: string
  price: string
  unitPrice: string
  caseType?: string // 改为可选
  image?: string // 改为可选
  quantity: number
}

// 组件Props类型
export interface SimilarProductsProps {
  products: Product[]
  title?: string
  subtitle?: string
  viewText?: string
}

export interface CommitmentItem {
  id: number
  text_title: string
  text_content: string
}

export interface ProductImage {
  id: number
  image: string
}
