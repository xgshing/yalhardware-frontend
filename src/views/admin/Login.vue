<!-- Login.vue -->
<template>
  <div class="login-container">
    <h2>登录</h2>

    <div
      v-if="authStore.error"
      class="error-message"
    >
      {{ authStore.error }}
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用户名/邮箱:</label>
        <input
          v-model="username"
          type="text"
          id="username"
          required
          placeholder="输入用户名或邮箱"
        />
      </div>

      <div class="form-group">
        <label for="password">密码:</label>
        <input
          v-model="password"
          type="password"
          id="password"
          required
          placeholder="输入密码"
        />
      </div>

      <button
        type="submit"
        :disabled="authStore.isLoading"
      >
        {{ authStore.isLoading ? '登录中...' : '登录' }}
      </button>
    </form>

    <!-- 修复这里：使用 computed 属性或响应式变量 -->
    <div
      v-if="debug"
      class="debug-info"
    >
      <p>LocalStorage token: {{ hasToken ? '存在' : '不存在' }}</p>
      <p>LocalStorage user: {{ hasUser ? '存在' : '不存在' }}</p>
      <p v-if="hasToken">Token 预览: {{ tokenPreview }}</p>
      <p v-if="hasUser">用户名: {{ userInfo?.username || userInfo?.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'

  const router = useRouter()
  const authStore = useAuthStore()

  const username = ref('xgshing@qq.com')
  const password = ref('')
  const debug = ref(true)

  // 响应式地检查 localStorage
  const hasToken = computed(() => {
    try {
      return !!localStorage.getItem('token')
    } catch {
      return false
    }
  })

  const hasUser = computed(() => {
    try {
      return !!localStorage.getItem('user')
    } catch {
      return false
    }
  })

  const tokenPreview = computed(() => {
    try {
      const token = localStorage.getItem('token')
      return token ? `${token.substring(0, 20)}...` : '无'
    } catch {
      return '读取失败'
    }
  })

  const userInfo = computed(() => {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  })

  const handleLogin = async () => {
    console.log('🔄 开始登录流程...')
    console.log('用户名:', username.value)

    const result = await authStore.login(username.value, password.value)

    if (result.success) {
      console.log('✅ 登录成功，跳转到商品页面')

      // 清空密码
      password.value = ''

      // 跳转到商品页面
      router.push('/products')
    } else {
      console.error('❌ 登录失败:', result.error)
    }
  }

  // 组件挂载时检查
  onMounted(() => {
    console.log('🔍 Login 组件挂载，当前认证状态:')
    console.log('  authStore.isAuthenticated:', authStore.isAuthenticated)
    console.log('  localStorage token:', hasToken.value)
    console.log('  localStorage user:', hasUser.value)
  })
</script>

<style scoped>
  /* 样式保持不变 */
  .login-container {
    max-width: 400px;
    margin: 50px auto;
    padding: 30px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
  }

  button {
    width: 100%;
    padding: 12px;
    background: #42b983;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }

  button:hover:not(:disabled) {
    background: #3aa876;
  }

  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .error-message {
    padding: 10px;
    background: #ffe6e6;
    color: #d32f2f;
    border-radius: 4px;
    margin-bottom: 20px;
  }

  .debug-info {
    margin-top: 20px;
    padding: 10px;
    background: #f0f0f0;
    border-radius: 4px;
    font-size: 14px;
  }
</style>
