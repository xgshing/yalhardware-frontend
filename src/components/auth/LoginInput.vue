<!-- 输入框组件 -->
<!-- src/components/auth/LoginInput.vue -->
<template>
  <div class="field">
    <input
      :type="currentType"
      v-model="modelValue"
      placeholder=" "
      required
    />

    <label>{{ label }}</label>
    <Icon
      v-if="type === 'password'"
      :icon="show ? 'clarity:eye-line' : 'clarity:eye-hide-line'"
      class="eye"
      @click="show = !show"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Icon } from '@iconify/vue'

  const props = defineProps<{
    label: string
    type?: 'text' | 'password'
  }>()

  const modelValue = defineModel<string>()

  const show = ref(false)

  const currentType = computed(() =>
    props.type === 'password' && show.value ? 'text' : (props.type ?? 'text')
  )
</script>

<style scoped>
  .field {
    position: relative;
    width: 100%;
  }

  /* 输入框 */
  input {
    width: 100%;
    height: 50px;
    padding: 0 16px;
    font-size: 14px;
    border: 1px solid #d8c3b8;
    border-radius: 3px;
    outline: none;
    background: #fff;
  }

  /* label：默认就在输入框里 */
  label {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: #777;
    pointer-events: none;
    background: transparent;
    padding: 0 6px;
    transition: 0.18s ease;
  }

  /*  只有：获取焦点 或 输入后 才上移 */
  input:focus + label,
  input:not(:placeholder-shown) + label {
    top: 8px;
    font-size: 12px;
    color: #aaa;
  }

  /* 👁 */
  .eye {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    user-select: none;
  }
</style>
