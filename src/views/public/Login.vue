<!-- 登录页面 -->
<!-- src/views/Login.vue -->
<template>
  <AuthLayout
    :title="purpose"
    :breadcrumb="[{ label: 'Home', clickable: true }, { label: purpose }]"
    @breadcrumb-click="handleClick"
  >
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
          <span class="txt-btn">
            {{ loading ? 'Logining...' : 'SIGN IN' }}
          </span>
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
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { AuthLayout, LoginInput } from '@/components/auth'
  import { useUserStore } from '@/stores/user'

  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  const email = ref('')
  const password = ref('')
  const loading = ref(false)
  const error = ref('')
  const success = ref('')

  const purpose = computed(() => {
    return (route.query.purpose as string) || ''
  })

  const handleClick = (index: number) => {
    if (index === 0) router.push({ name: 'home' })
  }

  const registerClick = () => {
    router.push({
      name: 'register',
      query: {
        purpose: 'Create Account',
      },
    })
  }

  const submit = async () => {
    if (loading.value) return
    loading.value = true
    error.value = ''

    try {
      // 登录用户
      await userStore.login({
        email: email.value,
        password: password.value,
      })

      // 登录成功后跳转
      const redirect = route.query.redirect as string | undefined
      // ① 管理员 / 超级管理员：永远进后台
      if (userStore.isAdmin) {
        router.replace({ name: 'admin-product-list' })
        return
      }

      // ② 普通用户：有目标 → 回目标
      if (redirect) {
        router.replace(redirect)
        return
      }

      // ③ 普通用户：无目标 → 首页
      router.replace({ name: 'home' })
    } catch (e) {
      error.value = 'Login failed'
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped>
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

  /* hover：文字 + 箭头整体居中 */
  .btn:hover {
    gap: 15px;
  }

  .btn:hover .arrow {
    opacity: 1;
    transform: rotate(-45deg);
  }

  .register-btn {
    width: 250px;
    background: #ffff;
    color: #333;
    border: 1px solid #999;
  }

  .error {
    color: #d33;
    font-size: 14px;
  }
</style>
