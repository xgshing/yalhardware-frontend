<!-- 登录页面 -->
<!-- src/views/public/Login.vue -->
<template>
  <AuthLayout
    :title="purpose"
    :breadcrumb="[{ label: 'Home', clickable: true }, { label: purpose }]"
    @breadcrumb-click="handleClick"
  >
    <!-- 登录身份切换 -->
    <div class="login-switch">
      <button
        type="button"
        :class="{ active: !isAdminLogin }"
        @click="isAdminLogin = false"
      >
        普通用户
      </button>
      <button
        type="button"
        :class="{ active: isAdminLogin }"
        @click="isAdminLogin = true"
      >
        管理员
      </button>
    </div>

    <form
      class="login-box"
      @submit.prevent="submit"
    >
      <LoginInput
        label="E-mail"
        v-model="email"
      />
      <LoginInput
        label="password"
        type="password"
        v-model="password"
      />

      <p
        class="error"
        v-if="error"
      >
        {{ error }}
      </p>
      <p
        class="success"
        v-if="success"
      >
        {{ success }}
      </p>

      <div class="choose-btn">
        <button
          type="submit"
          class="btn login-btn"
          :disabled="loading"
        >
          <span class="txt-btn">{{ loading ? 'Logining...' : 'SIGN IN' }}</span>
          <span class="arrow">→</span>
        </button>

        <button
          type="button"
          class="btn register-btn"
          @click="registerClick"
        >
          <span class="txt-btn">CREATE ACCOUNT</span>
          <span class="arrow">→</span>
        </button>
      </div>
    </form>
  </AuthLayout>
</template>

<script setup lang="ts">
  import { AuthLayout, LoginInput } from '@/components/auth'
  import { useAdminStore } from '@/stores/admin'
  import { useUserStore } from '@/stores/user'
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const adminStore = useAdminStore()

  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  // 是否管理员登录
  const isAdminLogin = ref(false)

  const purpose = computed(() =>
    isAdminLogin.value ? 'Admin Login' : 'Sign In'
  )

  const handleClick = (index: number) => {
    if (index === 0) router.push({ name: 'home' })
  }

  const registerClick = () => {
    router.push({ name: 'register', query: { purpose: 'Create Account' } })
  }

  /**
   * 提交登录
   */
  const submit = async () => {
    if (loading.value) return
    loading.value = true
    error.value = ''
    success.value = ''

    try {
      if (isAdminLogin.value) {
        // 管理员登录
        await adminStore.login({ email: email.value, password: password.value })

        success.value = 'Admin login successful'

        // 登录后台后直接跳转后台列表页
        router.replace({ name: 'admin-product-list' })
      } else {
        // 普通用户登录
        await userStore.login({ email: email.value, password: password.value })

        success.value = 'Login successful'

        const redirect = route.query.redirect as string | undefined
        if (redirect) {
          router.replace(redirect)
        } else {
          router.replace({ name: 'home' })
        }
      }
    } catch (e: any) {
      console.error('登录失败', e)
      error.value =
        e?.response?.data?.error ||
        e?.response?.data?.detail ||
        e?.message ||
        'Login failed'
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
  .login-switch {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    gap: 10px;
  }
  .login-switch button {
    padding: 8px 16px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #fff;
    cursor: pointer;
    font-weight: 600;
  }
  .login-switch button.active {
    background: #111;
    color: #fff;
    border-color: #111;
  }

  .login-box {
    width: 400px;
    background-color: transparent;
    padding-left: 60px;
  }
  .login-box > * + * {
    margin-top: 12px;
  }

  .choose-btn {
    display: flex;
    padding: 60px 0;
    gap: 10px;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    gap: 0;
    transition: gap 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .login-btn {
    width: 200px;
    background: #111;
    color: #fff;
    border: none;
  }
  .arrow {
    opacity: 0;
    transform: rotate(-45deg);
    transition:
      opacity 0.2s ease,
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .btn:hover {
    gap: 15px;
  }
  .btn:hover .arrow {
    opacity: 1;
    transform: rotate(-45deg);
  }
  .register-btn {
    width: 250px;
    background: #fff;
    color: #333;
    border: 1px solid #999;
  }

  .error {
    color: #d33;
    font-size: 14px;
  }
  .success {
    color: #2a2;
    font-size: 14px;
  }
</style>
