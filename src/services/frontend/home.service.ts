// src/services/admin/home.service.ts
import request from '@/utils/request'

export const fetchStories = async () => {
  const res = await request.get('/admin/home/stories/')
  return res.data
}

export const fetchFeatures = async () => {
  const res = await request.get('/admin/home/features/')
  return res.data
}

export const fetchBanners = async () => {
  const res = await request.get('/admin/home/banners/')
  return res.data
}
