// src/stores/admin.ts
import { initAdmin, loginAdmin } from '@/services/admin/auth'
import type { LoginPayload, User } from '@/types'
import { clearAdminToken, getAdminAccessToken } from '@/utils/auth'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // state
  const admin = ref<User | null>(null)
  const ready = ref(false)
  const loading = ref(false)

  // getters
  const isLogin = computed(() => !!admin.value)

  // actions
  async function bootstrap() {
    if (ready.value) return

    console.log('--- Admin bootstrap start ---')
    const token = getAdminAccessToken()
    console.log('Admin bootstrap | token from localStorage:', token)

    try {
      const user = await initAdmin()

      console.log('Admin bootstrap | initAdmin result:', user)

      admin.value = user
    } catch (e) {
      console.log('Admin bootstrap | initAdmin ERROR:', e)
      admin.value = null
      clearAdminToken()
    } finally {
      ready.value = true
      console.log('Admin bootstrap | final admin:', admin.value)
      console.log('--- Admin bootstrap end ---')
    }
  }

  async function login(payload: LoginPayload) {
    if (loading.value) return
    loading.value = true
    try {
      admin.value = await loginAdmin(payload)
    } finally {
      loading.value = false
      ready.value = true
    }
  }

  function logout() {
    admin.value = null
    clearAdminToken()
    ready.value = true
  }

  return {
    // state
    admin,
    ready,
    loading,
    // getters
    isLogin,
    // actions
    bootstrap,
    login,
    logout,
  }
})
