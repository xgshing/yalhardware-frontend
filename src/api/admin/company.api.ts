// src/api/admin/company.api.ts
import request from '@/utils/request'

export const companyApi = {
  getProfile: () => request.get('/company/profile/'),
  saveProfile: (data: any) => request.post('/company/profile/', data),
  uploadRichImage: (form: FormData) =>
    request.post('/upload/rich-image/', form),
}
