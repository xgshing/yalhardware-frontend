// 订单 API 封装
// src/api/frontend/orders.ts
import { frontendRequest } from '@/utils/request'

export const orderApi = {
  list: () => frontendRequest.get('/frontend/orders/'),
  detail: (id: string) => frontendRequest.get(`/frontend/orders/${id}/`),
  cancel: (id: number) =>
    frontendRequest.post(`/frontend/orders/${id}/cancel/`),
  pay: (id: number) => frontendRequest.post(`/frontend/orders/${id}/pay/`),
  confirm: (id: number) =>
    frontendRequest.post(`/frontend/orders/${id}/confirm/`),
  submit: (payload: any) =>
    frontendRequest.post('/frontend/orders/submit/', payload),
}
