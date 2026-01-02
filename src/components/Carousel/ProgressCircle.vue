<!-- src/components/Carousel/ProgressCircle.vue -->
<!-- SVG进度环（无旋转动画） -->
<template>
  <!-- 
    SVG容器，定义100x100的视图框
    viewBox="0 0 100 100" 表示坐标系统从(0,0)到(100,100)
  -->
  <svg class="ring" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="47" class="background-ring" />
    <!-- 
      圆形进度条
      cx="50" cy="50" - 圆心在(50,50)位置（中心点）
      r="47" - 半径47（在100x100的画布中留出边缘空间）
    -->
    <circle cx="50" cy="50" r="47" :style="{
      strokeDasharray: '300', // 虚线总长度（周长近似值）
      strokeDashoffset: (300 - 300 * dash / 100), // 虚线偏移量，控制进度显示
      transition: `${duration}ms linear`  // 过渡动画效果
    }" />
  </svg>
</template>


<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  duration: Number
});

// 响应式变量，控制进度条进度（0-100）
const dash = ref(0);

onMounted(() => {
  dash.value = 0;
  //在同一帧内跳过 transition 导致动画不触发.
  // 使用 双 requestAnimationFrame（double rAF） 强制浏览器渲染初始状态 → 再渲染结束状态，动画自然 100 % 稳定出现。
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      dash.value = 100; // 第二帧再改，浏览器一定触发 transition
    });
  });
});
</script>


<style scoped>
/* 
  进度环容器样式
  绝对定位，用于在轮播图上覆盖显示
*/
.ring {
  position: absolute;
  width: 80px;
  height: 80px;
  transform: translate(-10px, -10px);
  /*
    通过transform调整位置，使其居中
    向左移动10px，向上移动10px（因为宽度比viewBox大）
  */
}

/* 背景环样式（半透明边框） */
.background-ring {
  stroke: rgba(255, 255, 255, 0.2);
  stroke-width: 2;
  fill: none;
  opacity: 1;
}

/* 圆形进度条样式 */
circle {
  stroke: white;
  /* 进度条颜色为白色 */
  opacity: 1;
  /* 完全不透明 */
  fill: none;
  /* 无填充色（默认值，但明确写出更好） */
  stroke-width: 2.5;
  /* 线条宽度（建议明确指定） */
}

@media(max-width:768px) {
  .ring {
    width: 70px;
    height: 70px;
    transform: translate(-5px, -5px);
  }
}
</style>