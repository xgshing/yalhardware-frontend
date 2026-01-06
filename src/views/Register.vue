<!-- src/views/Register.vue -->
<!-- 注册页面组件 -->
<template>
  <!-- 根容器 -->
  <div class="register-body">
    <NavBar />

    <!-- 页面导航路径 -->
    <div class="nav-container">
      <div
        class="nav-link"
        @click=""
      >
        Home
      </div>
      <p class="separator"></p>
      <div>Create Account</div>
    </div>

    <!-- 注册表单容器 -->
    <div class="register-container">
      <h1>Create Account</h1>
      <!-- 注册表单，阻止默认提交行为 -->
      <form
        class="register-box"
        @submit.prevent="submit"
      >
        <div class="input-name">
          <LoginInput
            label="First Name"
            v-model="firstName"
          />
          <LoginInput
            label="Last Name"
            v-model="lastName"
          />
        </div>
        <LoginInput
          label="E-mail"
          v-model="email"
        />
        <LoginInput
          label="Password"
          type="password"
          v-model="password"
        />
        <!-- 添加这行：确认密码输入框 -->
        <LoginInput
          label="Confirm Password"
          type="password"
          v-model="confirmPassword"
        />
        <!-- 错误信息显示 -->
        <p
          v-if="error"
          class="error"
        >
          {{ error }}
        </p>
        <!-- 成功信息显示 -->
        <!-- 成功信息显示 -->
        <p
          v-if="success"
          class="success"
        >
          {{ success }}
        </p>
        <!-- 注册按钮，根据加载状态禁用 -->
        <button
          class="register-btn"
          :disabled="loading"
        >
          {{ loading ? 'Creating Account...' : 'Create Account' }}
        </button>
        <!-- 登录页面链接 -->
        <p class="login-link">
          Already have an account?
          <span @click="router.push('/login')">Sign in</span>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import LoginInput from '@/components/login/LoginInput.vue'

  import { useRouter } from 'vue-router'

  // 定义响应式数据
  const firstName = ref('') // 名字
  const lastName = ref('') // 姓氏
  const email = ref('') // 邮箱
  const password = ref('') // 密码
  const confirmPassword = ref('') // 确认密码
  const error = ref('') // 错误信息
  const success = ref('') // 成功信息
  const loading = ref(false) // 加载状态
  const router = useRouter() // 路由实例

  // 密码验证函数
  const validatePassword = () => {
    // 检查密码是否匹配
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      return false
    }
    // 检查密码长度
    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters'
      return false
    }
    return true
  }

  // 表单提交处理函数
  const submit = async () => {
    // 清空之前的信息
    error.value = ''
    success.value = ''

    console.log('1. 开始提交表单...')

    // 基础验证：检查必填字段
    if (
      !firstName.value ||
      !lastName.value ||
      !email.value ||
      !password.value ||
      !confirmPassword.value
    ) {
      error.value = 'Please fill in all fields'
      console.log('❌ 字段验证失败')
      return
    }

    // 密码验证
    if (!validatePassword()) {
      console.log('❌ 密码验证失败')
      return
    }

    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.value)) {
      error.value = 'Please enter a valid email address'
      console.log('❌ 邮箱格式验证失败')
      return
    }

    // 开始加载
    loading.value = true
    console.log('2. 设置 loading = true')

    try {
      // 准备请求数据
      const requestData = {
        first_name: firstName.value.trim(),
        last_name: lastName.value.trim(),
        email: email.value.trim(),
        password: password.value,
        confirm_password: confirmPassword.value,
      }

      console.log('3. 准备请求数据:', requestData)

      // 调用注册API - 添加详细的 Promise 链跟踪

      console.log('4. 开始调用 registerApi...')

      console.log('5. Promise 已创建，等待响应...')

      // 注册成功处理
      success.value = 'Account created successfully! Redirecting to login...'
      console.log('7. 设置 success 消息')

      // 3秒后跳转到登录页面
      setTimeout(() => {
        console.log('8. 执行 setTimeout 跳转')
        router.push('/login')
      }, 3000)
    } catch (err: any) {
      console.error('❌ try-catch 捕获错误:', err)
      console.error('❌ 错误类型:', typeof err)
      console.error('❌ 错误消息:', err.message)
      console.error('❌ 错误栈:', err.stack)

      if (err.response) {
        console.error('❌ 响应状态:', err.response.status)
        console.error('❌ 响应数据:', err.response.data)
        error.value = `Error ${err.response.status}: ${JSON.stringify(err.response.data)}`
      } else if (err.request) {
        console.error('❌ 没有响应:', err.request)
        error.value = 'No response from server'
      } else {
        console.error('❌ 其他错误:', err.message)
        error.value = `Error: ${err.message}`
      }
    } finally {
      console.log('9. 进入 finally 块')
      loading.value = false
      console.log('10. 设置 loading = false')
    }

    console.log('11. submit 函数结束')
  }
</script>

<style scoped>
  .register-body {
    margin: 0 30px;
  }

  /* 面包屑导航容器样式 */
  .nav-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    opacity: 0.7;
    /* 0 完全透明，1 完全不透明 */
    font-size: 0.8rem;
    padding-top: 30px;
  }

  /* 导航链接样式 */
  .nav-link {
    position: relative;
    /* 设置为相对定位，为伪元素::after提供定位参考 */
    cursor: pointer;
    padding-bottom: 3px;
    /* 为下划线预留空间 */
    transition: color 0.3s;
    /* 文字颜色过渡动画 */
  }

  .nav-link::after {
    content: '';
    /* 伪元素必须设置content属性，这里为空内容 */
    position: absolute;
    /* 绝对定位，相对于.nav-link元素定位 */
    width: 100%;
    /* 下划线宽度与文字等宽 */
    height: 1px;
    bottom: 0;
    left: 0;
    /* 从左开始 */
    background-color: #333;
    transition: transform 0.5s ease;
    /* 设置transform变换的过渡动画，持续0.5秒，缓动效果 */
    transform: scaleX(1);
    /* 初始状态：完全显示 */
    transform-origin: left center;
    /* 变换原点：从左侧开始 */
  }

  /* 
 * .nav-link:hover 伪类：鼠标悬停状态样式
 * 当鼠标悬停在.nav-link上时应用
 * 功能：鼠标悬停时改变文字颜色和下划线状态
 */
  .nav-link:hover {
    color: #007bff;
    /* 悬停时文字颜色变为蓝色 */
  }

  /* 
 * .nav-link:hover::after 伪元素：悬停时下划线动画
 * 鼠标悬停时改变::after伪元素的样式
 * 功能：下划线从左侧开始向右收缩，实现向左消失效果
 */
  .nav-link:hover::after {
    transform: scaleX(0);
    /* 水平缩放为0，实现消失效果 */
    transform-origin: right center;
    /* 变换原点改为右侧，实现从左向右消失 */
  }

  /* 面包屑分隔符样式 */
  .separator {
    width: 1.6rem;
    height: 0.05rem;
    background-color: #333;
    margin: 0.2rem;
  }

  .register-container h1 {
    font-size: 3.5rem;
    font-weight: 400;
  }

  .register-box {
    width: 600px;
    padding: 32px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  }

  .register-box > * + * {
    margin-top: 18px;
  }

  .input-name {
    display: flex;
  }

  .register-btn {
    height: 48px;
    background: #1677ff;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
  }

  .error {
    color: #d33;
    font-size: 14px;
  }
</style>
