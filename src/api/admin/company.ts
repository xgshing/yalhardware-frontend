// src/api/admin/company.ts
import { adminRequest } from '@/utils/request'
export const companyApi = {
  getProfile: () => adminRequest.get('/company/profile/'),
  saveProfile: (data: any) => adminRequest.post('/company/profile/', data),
  uploadRichImage: (form: FormData) =>
    adminRequest.post('/upload/rich-image/', form),
}
