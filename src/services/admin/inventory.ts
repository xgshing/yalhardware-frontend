// src/services/admin/inventory.ts
import { fetchInventoryRecords } from '@/api'

export async function getInventoryRecords(params?: {
  variant?: number
  order?: string
}) {
  const { data } = await fetchInventoryRecords(params)
  return data
}
