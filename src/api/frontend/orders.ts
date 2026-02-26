// 订单 API 封装
// src/api/frontend/orders.ts
import request from '@/utils/request'

export const orderApi = {
  list: () => request.get('/frontend/orders/'),
  detail: (id: string) => request.get(`/frontend/orders/${id}/`),
  cancel: (id: number) => request.post(`/frontend/orders/${id}/cancel/`),
  pay: (id: number) => request.post(`/frontend/orders/${id}/pay/`),
  confirm: (id: number) => request.post(`/frontend/orders/${id}/confirm/`),
  submit: (payload: any) => request.post('/frontend/orders/submit/', payload),
}
