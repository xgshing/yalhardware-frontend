// src/types/admin/content.ts
export interface ContentCrudApi {
  list: () => Promise<any>
  create: (data: FormData) => Promise<any>
  update: (id: number, data: FormData) => Promise<any>
  delete: (id: number) => Promise<any>
}
