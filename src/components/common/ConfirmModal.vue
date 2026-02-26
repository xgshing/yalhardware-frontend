<!-- 通用确认弹窗组件 -->
<!-- src/components/common/ConfirmModal.vue -->
<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="overlay"
    >
      <div class="modal">
        <h3 class="title">{{ title }}</h3>
        <p class="content">{{ content }}</p>

        <div class="actions">
          <button
            class="btn secondary"
            :disabled="loading"
            @click="onCancel"
          >
            取消
          </button>
          <button
            class="btn danger"
            :disabled="loading"
            @click="onConfirm"
          >
            {{ loading ? '处理中...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
  defineProps<{
    visible: boolean
    title: string
    content: string
    confirmText?: string
    loading?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'confirm'): void
  }>()

  const onCancel = () => emit('cancel')
  const onConfirm = () => emit('confirm')
</script>

<style scoped>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
  }

  .modal {
    width: 360px;
    background: #fff;
    border-radius: 12px;
    padding: 20px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .content {
    font-size: 14px;
    color: #555;
    margin-bottom: 20px;
    line-height: 1.6;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }

  .btn {
    height: 36px;
    padding: 0 14px;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
  }

  .secondary {
    background: #fff;
    border: 1px solid #ddd;
  }

  .danger {
    background: #f5222d;
    border: none;
    color: #fff;
  }

  .danger:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
