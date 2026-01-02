<template>
  <div class="shipping-protection-icon">
    <!-- 盾牌 -->
    <Icon icon="material-symbols-light:shield" class="shield" :class="{ active }" />

    <!-- 打钩 -->
    <Icon icon="mdi:tick" class="tick" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'

defineProps<{
  active: boolean
}>()
</script>

<style scoped>
.shipping-protection-icon {
  position: relative;
  width: 40px;
  height: 40px;
  color: #b5b5b5;
  /* 未选中灰色 */
  transition: color 0.2s ease;
}



.shield {
  font-size: 40px;
}

.shield.active {
  color: #008060;
  /* Navidium 绿色 */
}

.tick {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: white;
  border-radius: 50%;
}
</style>
