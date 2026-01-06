// src/api/admin/content.api.ts
import request from '@/utils/request'

export const contentApi = {
  banners: {
    list: () => request.get('/admin/home/banners/'),
    create: (data: FormData) => request.post('/admin/home/banners/', data),
    update: (id: number, data: FormData) =>
      request.put(`/admin/home/banners/${id}/`, data),
    delete: (id: number) => request.delete(`/admin/home/banners/${id}/`),
  },
  features: {
    list: () => request.get('/admin/home/features/'),
    create: (data: FormData) => request.post('/admin/home/features/', data),
    update: (id: number, data: FormData) =>
      request.put(`/admin/home/features/${id}/`, data),
    delete: (id: number) => request.delete(`/admin/home/features/${id}/`),
  },
  stories: {
    list: () => request.get('/admin/home/stories/'),
    create: (data: FormData) => request.post('/admin/home/stories/', data),
    update: (id: number, data: FormData) =>
      request.put(`/admin/home/stories/${id}/`, data),
    delete: (id: number) => request.delete(`/admin/home/stories/${id}/`),
  },
}
