// 前台（用户态）
// src/router/routes/frontend.ts
import type { RouteRecordRaw } from 'vue-router'

const frontendRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'homeLayout',
    component: () => import('@/layouts/HomeLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/home/HomeView.vue'),
      },
      // 公司简介
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/home/AboutLayout.vue'), // 关于公司
      },
      // 购物车
      {
        path: 'cart',
        name: 'cart',
        component: () => import('@/views/home/cart.vue'), // 购物车
        meta: {
          requiresAuth: true, // 必须登录
        },
      },

      // 产品种类
      {
        path: 'product-categories',
        name: 'product-categories',
        component: () => import('@/views/home/ProductCategories.vue'), // 产品种类
        props: true, // 启用 props 传递
      },

      // 产品详情页面
      {
        path: 'product/:category/:id',
        name: 'product-detail',
        component: () => import('@/views/home/Product.vue'),
        props: true, // 启用 props 传递
      },
      {
        path: 'orders',
        name: 'order-list',
        component: () => import('@/views/orders/OrderList.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'order/:id',
        name: 'order-detail',
        component: () => import('@/views/orders/OrderDetail.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'order/pay/:id',
        name: 'order-pay',
        component: () => import('@/views/orders/OrderPay.vue'),
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
]

export default frontendRoutes
