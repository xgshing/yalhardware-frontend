<!-- src/components/NavBar.vue -->
<template>
  <div>
    <header :class="['header', { 'header-hidden': !isNavVisible }]">
      <div class="nav-container">
        <!-- Logo -->
        <div class="logo">
          <span>{{ logo.text }}</span>
        </div>

        <!-- 桌面导航菜单 -->
        <ul class="nav-menu">
          <li
            v-for="item in menuItems"
            :key="item.id"
            class="nav-item"
            @mouseenter="handleMouseEnter(item.id)"
            @mouseleave="handleMouseLeave(item.id)"
          >
            <a
              href="#"
              class="nav-link"
              @click.prevent="handleMenuItemClick(item)"
            >
              {{ item.text }}
              <span
                v-if="item.hasDropdown"
                class="dropdown-icon"
                >▼</span
              >
            </a>

            <!-- 下拉菜单 -->
            <div
              v-if="item.hasDropdown && dropdownStates[item.id]"
              class="dropdown-menu"
            >
              <a
                v-for="subItem in item.subItems"
                :key="subItem.id"
                href="#"
                class="dropdown-item"
                @click.prevent="handleSubItemClick(subItem)"
              >
                {{ subItem.text }}
              </a>
            </div>
          </li>
        </ul>

        <div
          class="nav-link"
          @click="openAboutUs"
        >
          About Us
        </div>

        <!-- 桌面导航搜索、登录账户、购物车功能 -->
        <div class="nav-right">
          <a class="search"> <span class="rotate-char">⌕</span>Search</a>
          <!-- Account 下拉菜单 -->
          <div class="account-dropdown-wrapper">
            <a
              class="account"
              @click="toggleDropdown"
              >Account</a
            >

            <!-- 登录下拉窗 -->
            <div>
              <div
                v-if="isOpen"
                class="account-dropdown"
              >
                <div
                  @click="handleLogin"
                  class="dropdown-item"
                >
                  Log In
                </div>
                <div
                  @click="handleCreateAccount"
                  class="dropdown-item"
                >
                  Create Account
                </div>
              </div>
            </div>
          </div>

          <div
            class="cart"
            @click="openCart"
          >
            <a>Cart</a>
            <div
              class="circle"
              v-if="cartStore.totalItems > 0"
            >
              {{ cartStore.totalItems }}
            </div>
          </div>
        </div>

        <!-- 移动端菜单按钮 -->
        <button
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
        >
          ☰
        </button>
      </div>
    </header>
    <!-- 固定高度的占位元素 -->
    <div class="nav-placeholder"></div>
  </div>
</template>

<script setup>
  import { reactive, ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cart'
  import { adminService } from '@/services'

  const router = useRouter()
  const logo = reactive({
    text: 'YAL Industrial & Trading',
  })

  const isNavVisible = ref(true)
  const lastScrollTop = ref(0)
  const hasScrolled = ref(false)

  const menuItems = ref([]) // 菜单数组动态生成
  const dropdownStates = reactive({}) // 下拉状态

  // ===================== 关于公司 =====================
  const openAboutUs = () => {
    router.push({
      name: 'about',
      query: {
        purpose: 'About Us',
      },
    })
  }

  // ===================== 购物车 =====================
  const cartStore = useCartStore()

  const openCart = () => {
    cartStore.openDrawer() // 使用 Store 的方法
  }

  // ===================== 账户 =====================
  const isOpen = ref(false)
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value
  }
  const handleLogin = () => {
    router.push({
      name: 'login',
      params: {
        purpose: 'login',
      },
    })
    isOpen.value = false
  }

  const handleCreateAccount = () => {
    router.push({
      name: 'register',
      params: {
        purpose: 'register',
      },
    })
    isOpen.value = false
  }

  // ===================== 获取后台分类 =====================
  async function fetchCategories() {
    const data = await adminService.fetchCategoryTree()
    menuItems.value = data.map((cat) => ({
      id: cat.id,
      text: cat.name,
      hasDropdown: Array.isArray(cat.children) && cat.children.length > 0,
      subItems: (cat.children || []).map((sub) => ({
        id: sub.id,
        text: sub.name,
      })),
    }))
  }

  // ===================== 页面滚动 =====================
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    // 添加阴影效果的条件
    hasScrolled.value = scrollTop > 10

    // 向下滚动：隐藏导航栏
    if (scrollTop > lastScrollTop.value && scrollTop > 100) {
      isNavVisible.value = false
    }
    // 向上滚动：显示导航栏
    else if (scrollTop < lastScrollTop.value) {
      isNavVisible.value = true
    }

    lastScrollTop.value = scrollTop <= 0 ? 0 : scrollTop
  }
  // 添加防抖函数
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  // ===================== 鼠标、移动端 =====================
  const isMobileMenuOpen = ref(false)
  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false
  }

  function isMobileView() {
    return window.innerWidth <= 768
  }

  function handleMouseEnter(id) {
    if (isMobileView()) return
    dropdownStates[id] = true
  }

  function handleMouseLeave(id) {
    if (isMobileView()) return
    dropdownStates[id] = false
  }

  // ===================== 菜单点击 =====================
  // 处理主菜单项点击
  function handleMenuItemClick(item) {
    // 如果有下拉菜单，不跳转
    if (item.hasDropdown) {
      return
    }

    // 直接在这里使用 router
    router.push({
      name: 'product-categories',
      query: {
        category: item.text,
      },
    })
  }

  // 处理子菜单项点击
  function handleSubItemClick(subItem) {
    console.log('点击子菜单项:', subItem.text)
    router.push({
      name: 'product-categories',
      query: {
        category: subItem.text,
      },
    })
    closeMobileMenu()
  }

  // ===================== 生命周期 =====================
  onMounted(() => {
    fetchCategories()
    // 使用防抖优化性能
    const debouncedScroll = debounce(handleScroll, 10)
    window.addEventListener('scroll', debouncedScroll)
  })

  onUnmounted(() => {
    // 新增：移除滚动事件监听
    const debouncedScroll = debounce(handleScroll, 10)
    window.removeEventListener('scroll', debouncedScroll)
  })
  // 新增：处理滚动逻辑

  // 添加点击事件处理函数
</script>

<style scoped>
  /* 导航栏样式 */
  /* 导航栏样式 - 在这里设置动画时间 */
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background-color: white;
    transition:
      transform 0.4s ease,
      box-shadow 0.3s ease;
    transform: translateY(0);
    display: flex;
    align-items: center;
    width: 100%;
    height: 70px;
  }

  /* 隐藏状态 */
  .header-hidden {
    transform: translateY(-100%);
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* 关键修改：替代 margin-left: auto */
    width: 100%;
    padding: 0 30px;
  }

  .logo {
    font-size: 24px;
    font-weight: 700;
  }

  /* 桌面导航菜单 */
  .nav-menu {
    display: flex;
    list-style: none;
  }

  /* Mobile 隐藏桌面菜单 */
  @media (max-width: 768px) {
    .nav-menu {
      display: none;
    }
  }

  .nav-item {
    margin: 0 10px;
    position: relative;
  }

  .nav-link {
    color: black;
    text-decoration: none;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    border-radius: 6px;
    transition: all 0.3s ease;
    font-size: 16px;
    font-weight: 500;
    white-space: nowrap;
    cursor: pointer;
  }

  .nav-link:hover {
    background-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }

  .dropdown-icon {
    margin-left: 8px;
    font-size: 12px;
    transition: transform 0.3s ease;
  }

  .nav-item:hover .dropdown-icon {
    transform: rotate(180deg);
  }

  /* 下拉菜单 */
  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    min-width: 220px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 8px 0;
    z-index: 1000;
    border: 1px solid #e1e5e9;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    color: #333;
    text-decoration: none;
    transition: all 0.2s ease;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .dropdown-item:hover {
    background: linear-gradient(135deg, #f0f5ff 0%, #e6eeff 100%);
    color: #2575fc;
    padding-left: 25px;
  }

  /* 桌面导航搜索、登录账户、购物车 */
  .nav-right {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-left: auto;
  }

  .search {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .rotate-char {
    display: inline-block;
    transform: rotate(-90deg);
    /* 逆时针90度 */
    font-size: 24px;
    margin-right: 10px;
  }

  /* ============================用户登录============================ */
  /* 容器保持相对定位，方便下拉菜单绝对定位 */
  .account-dropdown-wrapper {
    position: relative;
    display: inline-block;
  }

  /* 下拉菜单绝对定位在 Account 下方 */
  .account-dropdown {
    position: absolute;
    top: 100%;
    /* 下方紧贴 Account */
    right: 0;
    /* 左对齐 Account */
    background-color: white;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    width: 150px;
    z-index: 1000;
  }

  /* 下拉项样式 */
  .account-dropdown .dropdown-item {
    padding: 10px 15px;
    cursor: pointer;
  }

  .account-dropdown .dropdown-item:hover {
    background-color: #f0f0f0;
  }

  .cart {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
  }

  .circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #333;
    transition: 0.3s;
  }

  /* 悬停整个 cart 的时候生效 */
  .cart:hover .circle {
    background: #000;
    border-color: #000;
    color: #fff;
  }

  /* 移动端菜单按钮 */
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: black;
    font-size: 24px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .mobile-menu-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  /* 占位元素：与导航栏相同高度 */
  .nav-placeholder {
    height: 70px;
    width: 100%;
    background: transparent;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .header {
      height: 60px;
    }

    .nav-placeholder {
      height: 60px;
    }

    .nav-menu {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }
  }
</style>
