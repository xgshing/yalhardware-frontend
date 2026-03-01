// src/main.ts
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { useAdminStore } from '@/stores/admin'
import { useUserStore } from '@/stores/user'
import { setupRouterGuard } from './router/guard'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

async function bootstrap() {
  const app = createApp(App)

  app.use(createPinia())
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(ElementPlus)

  const userStore = useUserStore()
  const adminStore = useAdminStore()

  // 页面刷新时恢复双端登录状态
  await Promise.all([userStore.bootstrap(), adminStore.bootstrap()])

  setupRouterGuard(router)

  app.mount('#app')
}

bootstrap()
