// src/services/admin/company.service.ts
import { companyApi } from '@/api'
import type { CompanyProfile } from '@/types'

// 获取公司信息
export const getCompanyProfile = async (): Promise<CompanyProfile> => {
  const res = await companyApi.getProfile()
  return res.data || {}
}

// 保存公司信息
export const saveCompanyProfile = async (data: CompanyProfile) => {
  const res = await companyApi.saveProfile(data)
  return res
}

// 上传富文本图片
export const uploadRichImage = (file: File) => {
  const form = new FormData()
  form.append('image', file)
  return companyApi.uploadRichImage(form)
}
