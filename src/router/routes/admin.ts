// 后台（管理员）
// src/router/routes/admin.ts
import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
      requiresAdmin: true,
    },
    children: [
      { path: '', redirect: 'products', name: 'admin-root' },

      // 产品分类
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/products/CategoryList.vue'),
      },
      // 产品列表
      {
        path: 'products',
        name: 'admin-product-list',
        component: () => import('@/views/admin/products/ProductList.vue'),
      },
      // 产品创建
      {
        path: 'products/create',
        name: 'admin-product-create',
        component: () => import('@/views/admin/products/ProductPage.vue'),
      },
      // 产品编辑
      {
        path: 'products/:id/edit',
        name: 'admin-product-edit',
        component: () => import('@/views/admin/products/ProductPage.vue'),
        props: true,
      },

      // 订单列表管理
      {
        path: 'orders',
        name: 'admin-order-list',
        component: () => import('@/views/admin/orders/OrderList.vue'),
      },
      // 订单详情页管理
      {
        path: 'orders/:id',
        name: 'admin-order-detail',
        component: () => import('@/views/admin/orders/OrderDetail.vue'),
      },

      // 用户列表管理
      {
        path: 'users',
        name: 'admin-user-list',
        component: () => import('@/views/admin/users/UserList.vue'),
      },
      // 用户详情页管理
      {
        path: 'users/:id',
        name: 'admin-user-detail',
        component: () => import('@/views/admin/users/UserDetail.vue'),
      },
      // 内容管理
      {
        path: 'content/:key',
        component: () => import('@/views/admin/content/ContentPage.vue'),
      },
      {
        path: 'system/company-contact',
        name: 'ContactCompany',
        component: () => import('@/views/admin/system/ContactCompany.vue'),
        meta: {
          title: '公司信息',
        },
      },
      // 公司介绍
      {
        path: 'system/company-about',
        name: 'AboutCompany',
        component: () => import('@/views/admin/system/AboutCompany.vue'),
        meta: {
          title: '公司介绍',
        },
      },
      // 库存详情
      {
        path: 'inventory',
        name: 'admin-inventory',
        component: () => import('@/views/admin/inventory/InventoryList.vue'),
      },
      // 产品评论
      {
        path: 'comments',
        name: 'admin-comment-list',
        component: () => import('@/views/admin/comments/CommentList.vue'),
      },
    ],
  },
]

export default adminRoutes
