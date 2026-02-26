<template>
  <!-- ================= 面包屑导航 ================= -->
  <nav class="breadcrumb">
    <template
      v-for="(item, index) in items"
      :key="index"
    >
      <!-- 分隔符（第一个不显示） -->
      <span
        v-if="index !== 0"
        class="separator"
      ></span>

      <!-- 可点击项 -->
      <p
        v-if="item.clickable"
        class="nav-link"
        @click="handleClick(index)"
      >
        {{ item.label }}
      </p>

      <!-- 当前项 / 不可点击 -->
      <p
        v-else
        class="current"
      >
        {{ item.label }}
      </p>
    </template>
  </nav>
</template>

<script setup lang="ts">
  interface BreadcrumbItem {
    label: string
    clickable?: boolean // 是否可点击
  }

  // 声明组件可以向父组件触发的事件（并进行类型约束）
  const emit = defineEmits<{
    // 声明一个名为 "item-click" 的事件, 当触发该事件时，必须携带一个 number 类型的 index 参数
    (e: 'item-click', index: number): void
  }>()

  // 定义组件接收的 props，并使用泛型进行类型声明
  defineProps<{
    items: BreadcrumbItem[]
  }>()

  const handleClick = (index: number) => {
    emit('item-click', index)
  }
</script>

<style scoped>
  /* ================= 面包屑容器 ================= */
  .breadcrumb {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }

  /* ================= 分隔符 ================= */
  .separator {
    width: 1.6rem;
    height: 0.05rem;
    background-color: #999;
    margin: 0.2rem;
  }

  /* ================= 可点击项 ================= */
  .nav-link {
    cursor: pointer;
    position: relative; /* 为下划线伪元素提供定位上下文 */
    color: #333;
    padding-bottom: 1px; /* 为下划线预留空间 */
    transition: color 0.2s ease; /* 文字颜色过渡动画 */
  }

  .nav-link::after {
    content: ''; /* 必须内容，用于显示伪元素 */
    position: absolute; /* 绝对定位，相对于.nav-link */
    width: 100%; /* 下划线宽度与文字等宽*/
    height: 1px;
    bottom: 0;
    left: 0; /* 从左开始 */
    background-color: #999;
    transition: transform 0.5s ease; /* 下划线变换动画（0.5秒缓动） */
    transform: scaleX(1); /* 初始状态：完全显示 */
    transform-origin: left center; /*变换原点：从左侧开始 */
  }

  /* 导航链接悬停状态
    功能：鼠标悬停时改变文字颜色和下划线状态 
    */
  .nav-link:hover {
    color: #007bff; /*悬停时文字颜色变为蓝色 */
  }

  /* 导航链接悬停时的下划线动画
功能：下划线从左侧开始向右收缩，实现向左消失效果 */
  .nav-link:hover::after {
    transform: scaleX(0); /* 水平缩放为0，实现消失效果 */
    transform-origin: right center; /* 变换原点改为右侧，实现从左向右消失 */
  }
  /* ================= 当前项 ================= */
  .current {
    color: #999;
    cursor: default;
  }
</style>
