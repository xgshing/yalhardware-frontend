// src/services/admin/content.service.ts
import { contentApi } from '@/api'
import type {
  CardData,
  CommitmentItem,
  BannerItem,
} from '@/types/frontend/product'

export const fetchStories = (): Promise<CommitmentItem[]> =>
  contentApi.stories.list().then((r) => r.data)

export const fetchFeatures = (): Promise<CardData[]> =>
  contentApi.features.list().then((r) => r.data)

export const fetchBanners = (): Promise<BannerItem[]> =>
  contentApi.banners.list().then((r) => r.data)
