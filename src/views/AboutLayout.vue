<!-- src/views/AboutYal.vue -->
<!-- 公司简介页面 -->
<template>
  <div class="body">
    <!-- 直接使用导航栏组件，不需要传递数据 -->
    <NavBar />

    <!-- ============ 导航 ============ -->
    <div class="nav-container">
      <div
        class="nav-link"
        @click="goToHome"
      >
        Home
      </div>
      <!-- 点击返回首页的链接 -->
      <p class="separator"></p>
      <div>{{ purpose }}</div>
      <!-- 显示当前分类名称 -->
    </div>

    <div class="about-layout">
      <!-- 侧边栏 -->
      <AboutYalSidebar />
      <div class="about-content">
        <!-- 企业介绍 -->
        <div v-if="purpose === 'About Us'">
          <h2>About Us</h2>
          <p class="separator-long"></p>

          <div
            class="about-html"
            v-html="company.about_html"
          />
        </div>

        <!-- 联系方式 -->
        <div v-else-if="purpose === 'Contact Us'">
          <h2>Contact Us</h2>
          <p class="separator-long"></p>

          <div v-if="company">
            <p><strong>Company Name:</strong> {{ company.company_name }}</p>

            <p><strong>Address:</strong></p>
            <p class="address">
              {{ company.address }}
            </p>

            <p v-if="company.contact_person">
              <strong>Contact Person:</strong> {{ company.contact_person }}
            </p>

            <p v-if="company.mobile">
              <strong>Mob/WeChat:</strong> {{ company.mobile }}
            </p>

            <p v-if="company.email">
              <strong>Email:</strong>
              <a :href="`mailto:${company.email}`">
                {{ company.email }}
              </a>
            </p>
          </div>

          <div
            v-else
            class="loading"
          >
            Loading contact information...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { getCompanyProfile } from '@/api/admin/company'

  const route = useRoute()
  const router = useRouter()

  /* ================== State ================== */
  const company = ref<any>({
    about_html: '',
  })

  /* ================== Navigation ================== */
  const goToHome = (): void => {
    router.push({ name: 'home' })
  }

  /* ================== Purpose 计算属性 ================== */
  const purpose = computed(() => {
    // 获取 query 参数
    const purposeValue = route.query.purpose as string

    // 返回处理后的值
    return purposeValue || '默认页面'
  })

  /* ================== Load Company Info ================== */
  const loadCompanyProfile = async () => {
    const res = await getCompanyProfile()
    company.value = res.data || {}
  }

  /* ================== Life Cycle ================== */
  watch(
    () => purpose.value,
    (val) => {
      if (val === 'About Us' || val === 'Contact Us') {
        loadCompanyProfile()
      }
    },
    { immediate: true }
  )
</script>

<style scoped>
  /* 页面主容器样式 */
  .body {
    margin: 0 30px;
    height: 100vh;
  }

  /* 面包屑导航容器样式 */
  .nav-container {
    display: flex;
    background-color: #f7f3f3;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.8rem;
    padding: 50px;
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

  /* 
 * .nav-link::after 伪元素：创建下划线效果
 * ::after在.nav-link内容之后插入内容
 * 功能：创建动态下划线，悬停时从左向右消失
 */
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

  /* =========================主体样式========================= */
  .about-layout {
    display: flex;
  }

  .about-content {
    flex: 1;
    padding: 0 30px;
    overflow-y: auto;
    background-color: #f7f3f3;
  }
  .about-content h2 {
    font-size: 2.5rem;
  }
  .separator-long {
    width: 100%;
    height: 0.05rem;
    background-color: #ddd;
    margin: 0.2rem;
  }
  /* =========================联系信息========================= */
  .about-text {
    line-height: 1.8;
    margin-bottom: 16px;
  }

  .about-images {
    display: flex;
    gap: 20px;
    margin: 30px 0;
  }

  .about-images img {
    width: 50%;
    border-radius: 4px;
    object-fit: cover;
  }

  .about-slogan {
    text-align: center;
    font-size: 28px;
    font-weight: bold;
    margin-top: 40px;
  }

  /* =========================企业介绍========================= */
  .about-html {
    line-height: 1.8;
    font-size: 14px;
    color: #333;
  }

  .about-html p {
    margin-bottom: 12px;
  }

  .about-html img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 16px auto;
  }

  .about-html h1,
  .about-html h2,
  .about-html h3 {
    margin: 20px 0 12px;
  }
</style>
