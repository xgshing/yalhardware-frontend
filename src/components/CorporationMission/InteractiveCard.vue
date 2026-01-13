<template>
  <!-- 
   * 交互式卡片主容器
   * :class 动态绑定类名，根据悬停状态切换样式
   * @mouseenter/@mouseleave 监听鼠标事件,触发父组件事件
   * role="article" 提高可访问性
   -->
  <article
    class="interactive-card"
    :class="{ 'is-hovered': isHovered }"
    @mouseenter="emit('mouseenter')"
    @mouseleave="emit('mouseleave')"
    role="article"
    aria-labelledby="interactive-title"
  >
    <!-- 左上角圆圈 -->
    <div
      class="corner-circle"
      aria-hidden="false"
    >
      <div class="circle-inner">
        <!-- 非悬停状态：显示图标 -->
        <img
          v-if="!isHovered"
          :src="imageUrl"
          :alt="`${number} icon`"
          class="circle-icon"
        />
        <!-- 悬停状态：显示数字 -->
        <span class="circle-number">{{ number }}</span>
      </div>
    </div>

    <!-- 背景图片容器 -->
    <div class="card-background">
      <!-- 
       * 背景图片
       * :class 动态控制可见性
       * loading="lazy" 图片懒加载
       -->
      <img
        :src="imageUrl"
        :alt="title"
        class="background-image"
        :class="{ visible: isHovered }"
        loading="lazy"
      />
    </div>

    <!-- 卡片内容区域 -->
    <div class="card-content">
      <h3
        class="card-title"
        id="interactive-title"
      >
        {{ title }}
      </h3>
      <p class="card-description">{{ description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
  // ============= 组件Props类型定义 =============
  interface Props {
    id: number // 卡片唯一标识
    title: string // 卡片标题
    description: string // 卡片描述
    imageUrl: string // 背景图片URL
    number: number // 显示的数字（2或3）
    isHovered: boolean // 是否处于悬停状态
  }

  // ============= 组件事件定义 =============
  interface Emits {
    (e: 'mouseenter'): void // 鼠标进入事件
    (e: 'mouseleave'): void // 鼠标离开事件
  }

  // 定义组件props（使用TypeScript类型推断）
  const props = defineProps<Props>()
  // 定义组件事件
  const emit = defineEmits<Emits>()
</script>

<style lang="scss" scoped>
  /* 
 * 交互式卡片基础样式
 * 实现要求的悬停效果
 */
  .interactive-card {
    position: relative; /* 必须添加这个！ */
    background: #eee9e9; /* 浅灰色背景 */
    border-radius: 8px; /* 圆角 */
    overflow: hidden; /* 隐藏溢出 */
    padding: 35px; /* 内边距 */
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); /* 贝塞尔曲线过渡 */

    /* 悬停基础效果 */
    &:hover {
      transform: translateY(-5px); /* 上移效果 */
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15); /* 阴影效果 */
    }

    /* 悬停状态样式（当is-hovered类被添加时） */
    &.is-hovered {
      background: rgba(0, 0, 0, 0.7); /* 黑色半透明背景 */

      /* 悬停时文字变白色 */
      .card-title {
        color: #ffffff; /* 白色文字 */
        font-size: 2.5rem;
      }
      .card-description {
        color: #ffffff; /* 白色文字 */
        font-size: 0.9rem;
      }

      /* 悬停时圆圈效果：背景透明，白色边框 */
      .corner-circle .circle-inner {
        background: transparent; /* 透明背景 */
        border: 2px solid #ffffff; /* 白色边框 */
      }
    }
  }

  /* ============= 左上角圆圈样式 ============= */
  .corner-circle {
    position: absolute; /* 绝对定位 */
    top: 20px; /* 距离顶部20px */
    left: 20px; /* 距离左侧20px */
    z-index: 2; /* 堆叠顺序，确保在背景之上 */

    /* 圆圈内部容器 */
    .circle-inner {
      width: 80px; /* 宽度 */
      height: 80px; /* 高度 */
      border-radius: 50%; /* 圆形 */
      background: #ffffff; /* 白色背景 */
      display: flex; /* Flex布局 */
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
      transition: all 0.3s ease; /* 过渡动画 */
      overflow: hidden; /* 关键：隐藏放大后溢出的部分 */
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 阴影 */

      /* 圆圈图片样式 */
      .circle-icon {
        width: 100%; /* 缩小图标 */
        width: 100%; /* 缩小图标 */
        object-fit: cover; /* 等比例裁剪 */
        z-index: 1;
      }

      /* 圆圈数字样式 */
      .circle-number {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2.5rem; /* 字体大小 */
        color: white;
        transition: color 0.3s ease; /* 颜色过渡 */
        z-index: 5; /* 堆叠顺序，确保在背景之上 */
      }
    }
  }

  /* ============= 背景图片样式 ============= */
  .card-background {
    position: absolute; /* 绝对定位 */
    top: 0; /* 顶部对齐 */
    left: 0; /* 左侧对齐 */
    width: 100%; /* 宽度100% */
    height: 100%; /* 高度100% */
    overflow: hidden; /* 隐藏溢出 */

    /* 背景图片 */
    .background-image {
      width: 100%; /* 宽度100% */
      height: 100%; /* 高度100% */
      object-fit: cover; /* 覆盖容器 */
      opacity: 0; /* 初始透明 */
      transform: scale(1.1); /* 初始放大110% */
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); /* 过渡动画 */

      /* 可见状态 */
      &.visible {
        opacity: 0.9; /* 90%不透明度 */
        transform: scale(1); /* 恢复原始大小 */
      }
    }
  }

  /* ============= 卡片内容样式 ============= */
  .card-content {
    position: relative; /* 相对定位 */
    z-index: 1; /* 堆叠顺序，确保在背景之上 */
    height: 100%; /* 高度100% */
    display: flex; /* Flex布局 */
    flex-direction: column; /* 垂直排列 */
    justify-content: flex-end; /* 底部对齐 */

    /* 卡片标题 */
    .card-title {
      font-size: 1.75rem; /* 字体大小 */
      font-weight: 600; /* 字体粗细 */
      margin-bottom: 15px; /* 底部边距 */
      color: #2c3e50; /* 深灰色 */
      transition: color 0.3s ease; /* 颜色过渡 */
      line-height: 1.3; /* 行高 */
    }

    /* 卡片描述 */
    .card-description {
      font-size: 1rem; /* 基础字体大小 */
      line-height: 1.6; /* 行高 */
      color: #5d6d7e; /* 中灰色 */
      margin: 0; /* 清除边距 */
      transition: color 0.3s ease; /* 颜色过渡 */

      /* 初始状态：隐藏 */
      max-height: 0; /* 最大高度0 */
      overflow: hidden; /* 隐藏溢出 */
      opacity: 0; /* 透明 */
      transform: translateY(20px); /* 下移20px */

      /* 悬停状态：显示 */
      .is-hovered & {
        max-height: 200px; /* 最大高度 */
        opacity: 1; /* 不透明 */
        transform: translateY(0); /* 复位 */
        transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.1s; /* 延迟动画 */
      }
    }
  }

  /* ============= 响应式设计 ============= */
  @media (max-width: 768px) {
    /* 移动端调整高度 */
    .interactive-card {
      height: 350px; /* 降低高度 */
      padding: 20px; /* 减少内边距 */
    }

    /* 调整标题大小 */
    .card-title {
      font-size: 1.5rem; /* 缩小字体 */
    }

    /* 调整圆圈大小 */
    .corner-circle .circle-inner {
      width: 45px; /* 缩小宽度 */
      height: 45px; /* 缩小高度 */

      .circle-icon {
        width: 100%; /* 缩小图标 */
        width: 100%; /* 缩小图标 */
      }
    }
  }
</style>
