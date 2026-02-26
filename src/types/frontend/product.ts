// src/types/product.ts
export interface CaseType {
  id: number
  text: string
  images?: string[] // ⭐ 改为数组，可选
}

export interface DetailImage {
  id?: number
  image: string
}

export interface Variant {
  id: number
  uid: number
  style_name: string
  spec: string
  stock: number
  style_image: string
  existingImage?: string
  imageUrl?: string | null // 编辑回显
}

export interface Product {
  id: number
  name: string
  cover?: string
  images?: ProductImage[]
  variants: Variant[]
  is_featured?: boolean
  featured_order: number

  description?: string
  specifications?: string
  allImages: string[]

  url?: string
  reviews?: string
  price: number
  salesVolume?: number
  casetype?: CaseType[]
  detailImages?: string[]
  detail_images?: DetailImage[]
  category?: {
    // ✅ 改成对象
    id: number
    name: string
    parent?: number | null
  } | null

  [key: string]: any // ⭐ 允许额外字段
}

export interface ProductImage {
  id: number
  image: string
}

export interface CategoryProducts {
  [key: string]: Product[]
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

/* ================= 购物车 ================= */
export interface CartItem {
  productId?: number
  variant_id?: number

  name: string
  image?: string
  caseType?: string

  price: number
  quantity: number
  checked: boolean
}

// 添加到购物车的商品类型（允许部分属性可选）
export interface AddToCartItem {
  productId: number
  variant_id: number
  name: string
  price: number
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
  title: string
  description: string
}

export interface CardData {
  id: number
  title: string
  description: string
  images: string[]
}

export interface BannerItem {
  id: number
  title: string
  content: string
  images: string[]
}

export interface HomeData {
  categoryProducts: CategoryProducts
  allProducts: Product[]
  stories: CommitmentItem[]
  features: CardData[]
  banners: BannerItem[]
}

export interface ProductCategory {
  id: number
  name: string
  parent: number | null // 父级分类ID
  children: ProductCategory[] // 子分类数组
}

export interface addItem {
  id: number
  productId: number
  variant_id: number
  name: string
  unitPrice: string
  image?: string
  caseType?: string
  quantity: number
}
