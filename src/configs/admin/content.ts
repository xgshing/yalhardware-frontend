// 定义每个内容模块的 UI 结构,驱动后台列表页 + 表单页的自动生成
// src / configs / admin / content.ts
import { contentApi } from '@/api/admin/content.api'
import type { ContentCrudApi } from '@/types'

export const contentConfigs: Record<
  string,
  {
    title: string
    api: ContentCrudApi
    tableColumns: any[]
    formFields: any[]
  }
> = {
  banners: {
    title: '首页轮播',
    api: contentApi.banners,
    tableColumns: [
      { prop: 'order', label: '排序', width: 80 },
      { prop: 'title', label: '标题' },
    ],
    formFields: [
      { prop: 'title', label: '标题', type: 'input' },
      { prop: 'description', label: '描述', type: 'textarea' },
      { prop: 'images', label: '轮播图片', type: 'image', multiple: true },
      { prop: 'order', label: '排序', type: 'number' },
      { prop: 'is_active', label: '启用', type: 'switch' },
    ],
  },

  features: {
    title: '首页特色',
    api: contentApi.features,
    tableColumns: [
      { prop: 'order', label: '排序', width: 80 },
      { prop: 'title', label: '标题' },
    ],
    formFields: [
      { prop: 'title', label: '标题', type: 'input' },
      { prop: 'description', label: '描述', type: 'textarea' },
      { prop: 'images', label: '图标', type: 'image', multiple: false },
      { prop: 'order', label: '排序', type: 'number' },
      { prop: 'is_active', label: '启用', type: 'switch' },
    ],
  },

  stories: {
    title: '品牌故事',
    api: contentApi.stories,
    tableColumns: [
      { prop: 'order', label: '排序', width: 80 },
      { prop: 'title', label: '标题' },
    ],
    formFields: [
      { prop: 'title', label: '标题', type: 'input' },
      { prop: 'description', label: '描述', type: 'textarea' },
      { prop: 'images', label: '图片', type: 'image', multiple: true },
      { prop: 'order', label: '排序', type: 'number' },
      { prop: 'is_active', label: '启用', type: 'switch' },
    ],
  },
}
