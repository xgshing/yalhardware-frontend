<!-- src/components/CorporationMission/SustainableCraftsmanshipCard.vue -->
<template>
  <!-- 
   * 卡片主容器
   * :class 动态绑定类名，根据isLeftFixed属性添加样式
   * role="article" 提高可访问性，表示独立的内容区域
   -->
  <article 
    class="craftsmanship-card"
    :class="{ 'left-fixed': isLeftFixed }"
    role="article"
    aria-labelledby="card-title"
  >
    <!-- 图片容器 -->
    <div class="card-image-container">
      <!-- 
       * 卡片图片
       * :src 动态绑定图片URL
       * :alt 为图片提供替代文本，提高可访问性
       * loading="lazy" 启用图片懒加载，提升页面性能
       -->
      <img 
        :src="imageUrl" 
        :alt="title"
        class="card-image"
        loading="lazy"
      />
    </div>
    
    <!-- 卡片内容区域 -->
    <div class="card-content">
      <!-- 卡片标题，使用h2标签提高SEO和可访问性 -->
      <h2 class="card-title" id="card-title">{{ title }}</h2>
      <!-- 卡片描述 -->
      <p class="card-description">{{ description }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
// ============= 组件Props类型定义 =============
/**
 * 组件属性接口
 * 定义组件接收的所有props及其类型
 */
interface Props {
  title: string      // 卡片标题，必需
  description: string // 卡片描述，必需
  imageUrl: string   // 图片URL，必需
  isLeftFixed?: boolean // 是否为左侧固定卡片，可选，默认false
}

// 使用defineProps定义组件props，TypeScript自动推断类型
defineProps<Props>()
</script>

<style lang="scss" scoped>
/* 
 * 卡片基础样式
 * 使用BEM命名规范：block__element--modifier
 */
.craftsmanship-card {
  position: relative;  /* 关键：为绝对定位子元素提供参考 */
  background: #ffffff;                          /* 白色背景 */
  border-radius: 8px;                           /* 圆角边框 */
  overflow: hidden;                             /* 隐藏溢出内容 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);   /* 阴影效果 */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 过渡动画 */
  height: fit-content;                          /* 高度自适应内容 */
  
  /* 悬停效果 */
  &:hover {
    transform: translateY(-4px);                /* 上移效果 */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12); /* 加深阴影 */
  }
  
  /* 左侧固定卡片专用样式 */
  &.left-fixed {
    width: 50%;   /* 屏幕一半寬度 */
    flex-shrink: 0; /* 禁止收缩 */
  }
}

/* 图片容器样式 */
.card-image-container {

  width: 100%;      /* 宽度100% */
  height: 100%;    /* 固定高度 */
  overflow: hidden; /* 隐藏溢出 */
  
  /* 图片样式 */
  .card-image {
    width: 100%;                   /* 宽度100% */
    height: 100%;                  /* 高度100% */
    object-fit: cover;             /* 保持比例覆盖容器 */
    transition: transform 0.5s ease; /* 缩放过渡动画 */
    
    /* 悬停时图片放大效果 */
    .craftsmanship-card:hover & {
      transform: scale(1.05);      /* 轻微放大 */
    }
  }
}

/* 卡片内容区域样式 */
.card-content {
  position: absolute;  /* 相对于父元素定位 */
  /* 定位到图片容器的底部 */
  bottom: 10px;
  left: 0;
  right: 0;
  z-index: 10;         /* 堆叠顺序高于图片 */
  width: 300px;
  color: white;
  padding: 24px;  /* 内边距 */
  
  /* 标题样式 */
  .card-title {
    font-size: 2.5rem;     /* 字体大小 */
    font-weight: 400;      /* 字体粗细 */
    margin-bottom: 12px;   /* 底部边距 */
    line-height: 1.3;      /* 行高 */
  }
  
  /* 描述文本样式 */
  .card-description {
    font-size: 0.9rem;       /* 基础字体大小 */
    line-height: 1.6;      /* 舒适的行高 */
    margin: 0;             /* 清除默认边距 */
  }
}

/* ============= 响应式设计 ============= */
@media (max-width: 768px) {
  /* 移动端：左侧固定卡片变为全宽 */
  .craftsmanship-card.left-fixed {
    width: 100%;  /* 宽度100% */
  }
  
  /* 调整图片高度 */
  .card-image-container {
    height: 180px;  /* 缩小高度 */
  }
  
  /* 调整内边距 */
  .card-content {
    padding: 20px;  /* 减少内边距 */
  }
}
</style>