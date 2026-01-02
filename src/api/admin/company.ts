// src/api/company.ts
import request from '@/utils/request'

export const getCompanyProfile = () => {
  return request.get('/company/profile/')
}

export const saveCompanyProfile = (data: any) => {
  return request.post('/company/profile/', data)
}

// Quill图片上传
export const uploadRichImage = (file: File) => {
  const form = new FormData()
  form.append('image', file)

  return request.post('/upload/rich-image/', form, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
