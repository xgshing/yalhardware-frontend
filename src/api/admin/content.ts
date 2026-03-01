// src/api/admin/content.ts
import { adminRequest } from '@/utils/request'

export const contentApi = {
  banners: {
    list: () => adminRequest.get('/admin/home/banners/'),
    create: (data: FormData) => adminRequest.post('/admin/home/banners/', data),
    update: (id: number, data: FormData) =>
      adminRequest.put(`/admin/home/banners/${id}/`, data),
    delete: (id: number) => adminRequest.delete(`/admin/home/banners/${id}/`),
  },
  features: {
    list: () => adminRequest.get('/admin/home/features/'),
    create: (data: FormData) =>
      adminRequest.post('/admin/home/features/', data),
    update: (id: number, data: FormData) =>
      adminRequest.put(`/admin/home/features/${id}/`, data),
    delete: (id: number) => adminRequest.delete(`/admin/home/features/${id}/`),
  },
  stories: {
    list: () => adminRequest.get('/admin/home/stories/'),
    create: (data: FormData) => adminRequest.post('/admin/home/stories/', data),
    update: (id: number, data: FormData) =>
      adminRequest.put(`/admin/home/stories/${id}/`, data),
    delete: (id: number) => adminRequest.delete(`/admin/home/stories/${id}/`),
  },
}
