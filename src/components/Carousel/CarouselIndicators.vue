<!-- src/components/Carousel/CarouselIndicators.vue -->
<!-- 圆圈 + hover放大 -->
<template>
  <!-- 指示器容器，绝对定位在轮播图底部右侧 -->
  <div class="dots">
    <!-- 
      遍历所有幻灯片，为每个幻灯片创建一个指示点 
      当前激活的点不显示背景图片
    -->
    <div v-for="(s, i) in props.slides"
      :style="{ backgroundImage: i === props.currentSlide ? 'none' : 'url(' + s.imageUrl + ')' }" class="dot"
      :class="{ active: i === props.currentSlide }" @click="onSelect(i)">
      <!-- 仅在当前激活的指示点上显示数字 -->
      <span v-if="i === props.currentSlide" class="dot-number">{{ i + 1 }}</span> <!-- 显示数字（从1开始） -->
      <!-- 仅在当前激活的指示点上显示进度圆环组件 -->
      <ProgressCircle v-if="i === props.currentSlide" :duration="speed" />
    </div>
  </div>
</template>

<script setup>
import ProgressCircle from "./ProgressCircle.vue";

const props = defineProps({
  slides: Array,
  currentSlide: Number,
  onSelect: Function,
  speed: Number
});
</script>


<style scoped>
.dots {
  position: absolute;
  bottom: 20px;
  right: 40px;
  display: flex;
  gap: 60px;
}

.dot {
  position: relative;
  /* 确保数字可以相对于指示点绝对定位 */
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  width: 60px;
  height: 60px;
  transition: .2s;
}

/* 当前激活的指示点样式 */
.dot.active {
  background-color: white !important;
  /* 背景颜色设为白色 */
}

/* 数字样式 */
.dot-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 居中显示 */
  font-size: 24px;
  font-weight: bold;
  color: #333;
  /* 深色数字，在白色背景上清晰可见 */
  z-index: 1000;
  /* 确保数字在进度圆环上方 */
}

@media(max-width:768px) {
  .dot {
    width: 70px;
    height: 70px;
  }

  .dot-number {
    font-size: 20px;
    /* 小屏幕上稍微减小字体 */
  }
}
</style>