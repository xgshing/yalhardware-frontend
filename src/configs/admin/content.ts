// src/configs/admin/content.ts
import { ContentAPI } from '@/api/admin/content'

export const contentConfigs = {
  banners: {
    title: '首页轮播',
    api: ContentAPI.banner,
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
    api: ContentAPI.feature,
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
    api: ContentAPI.story,
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
