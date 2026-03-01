// src/stores/admin.ts
import { initAdmin, loginAdmin } from '@/services/admin/auth'
import type { LoginPayload, User } from '@/types'
import { clearAdminToken } from '@/utils/auth'
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

    try {
      const user = await initAdmin()

      admin.value = user
    } catch (e) {
      admin.value = null
      clearAdminToken()
    } finally {
      ready.value = true
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
