// src/api/admin/content.ts
import request from '@/utils/request' // axios 封装

export const ContentAPI = {
  banner: {
    list: () => request.get('/admin/home/banners/'),
    create: (data: FormData) => request.post('/admin/home/banners/', data),
    update: (id: number, data: FormData) =>
      request.put(`/admin/home/banners/${id}/`, data),
    delete: (id: number) => request.delete(`/admin/home/banners/${id}/`),
  },
  feature: {
    list: () => request.get('/admin/home/features/'),
    create: (data: FormData) => request.post('/admin/home/features/', data),
    update: (id: number, data: FormData) =>
      request.put(`/admin/home/features/${id}/`, data),
    delete: (id: number) => request.delete(`/admin/home/features/${id}/`),
  },
  story: {
    list: () => request.get('/admin/home/stories/'),
    create: (data: FormData) => request.post('/admin/home/stories/', data),
    update: (id: number, data: FormData) =>
      request.put(`/admin/home/stories/${id}/`, data),
    delete: (id: number) => request.delete(`/admin/home/stories/${id}/`),
  },
}
