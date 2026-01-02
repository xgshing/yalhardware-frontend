/* src/router/index.ts */
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView, // 高访问频率页面静态导入
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutLayout.vue'), // 关于公司
  },
  {
    path: '/product-categories',
    name: 'product-categories',
    component: () => import('@/views/ProductCategories.vue'), // 按需加载
  },
  {
    path: '/product/:category/:id',
    name: 'product-detail',
    component: () => import('@/views/Product.vue'),
    props: true,
  },
  {
    path: '/account/register', // 用户注册页面
    name: 'register',
    component: () => import('@/views/Register.vue'),
    props: true,
  },
  {
    path: '/account/login', // 用户登录页面
    name: 'login',
    component: () => import('@/views/Register.vue'),
    props: true,
  },

  // ====================后台地址====================
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/products', name: 'admin-root' },

      // 产品管理
      {
        path: '/admin/categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/products/CategoryList.vue'),
      },
      {
        path: 'products',
        name: 'admin-product-list',
        component: () => import('@/views/admin/products/ProductList.vue'),
      },
      {
        path: 'products/create',
        name: 'admin-product-create',
        component: () => import('@/views/admin/products/ProductPage.vue'), // 新增
      },
      {
        path: 'products/:id/edit',
        name: 'admin-product-edit',
        component: () => import('@/views/admin/products/ProductPage.vue'), // 编辑
        props: true,
      },

      // 订单管理
      {
        path: 'orders',
        name: 'admin-order-list',
        component: () => import('@/views/admin/orders/OrderList.vue'),
      },
      {
        path: 'orders/:id',
        name: 'admin-order-detail',
        component: () => import('@/views/admin/orders/OrderDetail.vue'),
        props: true,
      },

      // 用户管理
      {
        path: 'users',
        name: 'admin-user-list',
        component: () => import('@/views/admin/users/UserList.vue'),
      },

      // 内容管理
      {
        path: '/admin/content/:key',
        component: () => import('@/views/admin/content/ContentPage.vue'),
      },
      {
        path: '/admin/system/company-contact',
        name: 'ContactCompany',
        component: () => import('@/views/admin/system/ContactCompany.vue'),
        meta: {
          title: '公司信息',
        },
      },
      {
        path: '/admin/system/company-about',
        name: 'AboutCompany',
        component: () => import('@/views/admin/system/AboutCompany.vue'),
        meta: {
          title: '公司介绍',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,

  //“逻辑跳转 + 视觉回到顶部”
  scrollBehavior(to, from, savedPosition) {
    // 浏览器前进 / 后退
    if (savedPosition) {
      return savedPosition
    }

    // 商品详情页（点击相似商品）
    if (to.name === 'product-detail') {
      return { top: 0 }
    }

    // 默认行为
    return { top: 0 }
  },
})
// 路由守卫（认证检查）
// 路由守卫
// router.beforeEach(async (to, from, next) => {
//   console.log('🔍 路由守卫检查:')
//   console.log('  目标路径:', to.path)
//   console.log('  是否需要认证:', to.meta.requiresAuth)

//   const authStore = useAuthStore()

//   // 检查认证状态
//   const isAuthenticated = authStore.isAuthenticated
//   const token = authStore.token || localStorage.getItem('token')

//   console.log('  用户是否认证:', isAuthenticated)
//   console.log('  用户token:', token ? token.substring(0, 20) + '...' : '无')

//   // 如果需要认证但用户未登录
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     console.log('⚠️ 需要认证，跳转到登录页')

//     // 检查是否有 token（可能过期）
//     if (token) {
//       console.log('🔍 有 token，尝试验证...')
//       const isValid = await authStore.validateToken()

//       if (isValid) {
//         console.log('✅ Token 有效，允许访问')
//         next()
//         return
//       }
//     }

//     // 跳转到登录页
//     next('/login')
//   } else {
//     // 如果已登录但访问登录页，跳转到首页
//     if (to.path === '/login' && isAuthenticated) {
//       console.log('✅ 已登录，跳转到商品页')
//       next('/products')
//     } else {
//       console.log('✅ 允许访问')
//       next()
//     }
//   }
// })

export default router
