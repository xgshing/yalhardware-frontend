import { ref, type Ref } from 'vue'
import type { Product } from '@/types'

export interface AccordionItem {
  title: string
  isOpen: boolean
}

/**
 * 商品详情页 Accordion 业务 Composable
 * @param product 商品数据（Ref）
 */
export function useAccordion(product: Ref<Product | null>) {
  /** 折叠面板配置 */
  const accordionItems = ref<AccordionItem[]>([
    { title: 'Description', isOpen: true },
    { title: 'Specifications', isOpen: true },
    { title: 'Free shipping and Returns', isOpen: true },
  ])

  /** 切换展开 / 收起 */
  const toggleAccordion = (index: number) => {
    const item = accordionItems.value[index]
    if (!item) return
    item.isOpen = !item.isOpen
  }

  /** 根据 item 返回对应内容 */
  const getAccordionContent = (item: AccordionItem): string => {
    if (!product.value) return ''

    const title = item.title.toLowerCase()

    if (title.includes('description')) {
      return product.value.description || '暂无描述'
    }

    if (title.includes('specifications')) {
      return product.value.specifications || '暂无规格'
    }

    if (title.includes('free shipping')) {
      return (
        'Usually ships the same day. Free shipping on orders over $50 in the US ' +
        'and $120 overseas. Returns accepted for 30 days.'
      )
    }

    return ''
  }

  return {
    accordionItems,
    toggleAccordion,
    getAccordionContent,
  }
}
