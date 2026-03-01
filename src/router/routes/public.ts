//  登录 / 注册 / 404
// src/router/routes/public.ts
import type { RouteRecordRaw } from 'vue-router'

const publicRoutes: RouteRecordRaw[] = [
  // 用户登录页面
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/public/Login.vue'),
    props: true,
  },
  // 用户注册页面
  {
    path: '/register', // 用户注册页面
    name: 'register',
    component: () => import('@/views/public/Register.vue'),
    props: true, // 启用 props 传递
  },
  {
    path: '/admin/login', // 管理员登录路由
    name: 'admin-login',
    component: () => import('@/views/public/Login.vue'),
    props: { admin: true },
  },
]

export default publicRoutes
