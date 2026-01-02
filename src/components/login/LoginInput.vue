<template>
  <div class="field">
    <input :type="currentType" v-model="modelValue" placeholder=" " required />

    <label>{{ label }}</label>

    <span v-if="type === 'password'" class="eye" @click="toggle">
      {{ show ? '👁' : '🙈' }}
    </span>
  </div>
</template>


<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  label: string
  type?: 'text' | 'password'
}>()

const modelValue = defineModel<string>()

const show = ref(false)

const currentType = computed(() =>
  props.type === 'password' && show.value ? 'text' : props.type ?? 'text'
)

const toggle = () => (show.value = !show.value)
</script>

<style scoped>
.field {
  position: relative;
  width: 100%;
}

/* 输入框 */
input {
  width: 100%;
  height: 56px;
  padding: 20px 44px 12px 16px;
  font-size: 16px;
  border: 1px solid #d8c3b8;
  border-radius: 6px;
  outline: none;
  background: #fff;
}

/* label：默认就在输入框里 */
label {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #777;
  pointer-events: none;
  background: #fff;
  padding: 0 6px;
  transition: 0.18s ease;
}

/* 🔑 只有：获取焦点 或 输入后 才上移 */
input:focus+label,
input:not(:placeholder-shown)+label {
  top: 8px;
  font-size: 12px;
  color: #aaa;
}

/* 👁 */
.eye {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}
</style>
