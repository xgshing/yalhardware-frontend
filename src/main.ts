// src/main.ts

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { useUserStore } from '@/stores/user'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(createPinia())

const userStore = useUserStore()
await userStore.bootstrap()

app.use(router)
app.use(ElementPlus)

app.mount('#app')
