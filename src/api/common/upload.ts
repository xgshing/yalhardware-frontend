// 订单 API 封装
// src/api/commom/upload.ts
import { frontendRequest } from '@/utils/request'

export const uploadApi = {
  upload(file: File, folder = 'reviews') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    return frontendRequest.post<{ url: string }>('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}
