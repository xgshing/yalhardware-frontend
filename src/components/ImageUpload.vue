<!-- src/components/ImageUpload.vue -->
<template>
  <div class="image-upload">
    <!-- 上传 -->
    <label class="upload-dropzone">
      <input
        type="file"
        accept="image/*"
        :multiple="multiple"
        class="hidden-input"
        @change="onInputChange"
      />
      <div class="upload-placeholder">
        <span class="plus">＋</span>
        <p>点击或拖拽上传图片</p>
      </div>
    </label>

    <!-- 预览 -->
    <div class="preview-list">
      <div
        v-for="(item, idx) in previews"
        :key="item.key"
        class="preview-item"
      >
        <img :src="item.url" />

        <div class="preview-mask">
          <button @click.stop="remove(idx)">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  type PreviewItem = {
    key: string
    url: string
    file?: File
    isRemote: boolean
  }

  const props = defineProps<{
    modelValue: File | File[] | null
    existingImages?: string[]
    multiple?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', v: File | File[] | null): void
    (e: 'remove-remote', url: string): void
  }>()

  const files = ref<File[]>([])
  const previews = ref<PreviewItem[]>([])

  /* 初始化已有图片（编辑回显） */
  watch(
    () => props.existingImages,
    (list) => {
      // ✅ 核心：只在“没有本地文件”时，才同步 remote
      if (files.value.length > 0) return

      if (!list || list.length === 0) {
        previews.value = []
        return
      }

      previews.value = list.map((url) => ({
        key: `remote:${url}`,
        url,
        isRemote: true,
      }))
    },
    { immediate: true }
  )

  /* 文件选择 */
  function onInputChange(e: Event) {
    const input = e.target as HTMLInputElement
    if (!input.files) return

    const selected = Array.from(input.files)

    // ✅ 核心修复：单图模式直接清空
    if (!props.multiple) {
      previews.value = []
      files.value = []
    }

    selected.forEach((file) => {
      const url = URL.createObjectURL(file)
      previews.value.push({
        key: `local:${url}`,
        url,
        file,
        isRemote: false,
      })
      files.value.push(file)
    })

    emitValue()
    input.value = ''
  }

  /* 同步 v-model */
  function emitValue() {
    if (props.multiple) {
      emit('update:modelValue', files.value)
    } else {
      emit('update:modelValue', files.value[0] ?? null)
    }
  }

  /* 删除 */
  function remove(index: number) {
    const item = previews.value[index]
    if (!item) return

    previews.value.splice(index, 1)

    if (item.isRemote) {
      emit('remove-remote', item.url)

      // 🔥 核心补丁：单图模式 → 主动通知父组件“已清空”
      if (!props.multiple) {
        emit('update:modelValue', null)
      }
    } else if (item.file) {
      files.value = files.value.filter((f) => f !== item.file)
      emit(
        'update:modelValue',
        props.multiple ? files.value : (files.value[0] ?? null)
      )
    }
  }
</script>

<style scoped>
  .image-upload {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* 上传区 */
  .upload-dropzone {
    position: relative;
    height: 140px;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.18),
      rgba(255, 255, 255, 0.05)
    );
    backdrop-filter: blur(12px);
    border: 1px solid transparent;
    background-clip: padding-box;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .upload-dropzone::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(135deg, #6ee7ff, #8b5cf6, #ec4899);

    /* 标准属性 + WebKit 前缀 */
    mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    mask-composite: exclude;
    -webkit-mask:
      linear-gradient(#000 0 0) content-box,
      linear-gradient(#000 0 0);
    -webkit-mask-composite: xor;

    pointer-events: none;
  }

  .upload-dropzone:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  }

  /* 隐藏 input */
  .hidden-input {
    display: none;
  }

  /* 占位内容 */
  .upload-placeholder {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #cbd5f5;
    text-align: center;
  }

  .upload-placeholder .plus {
    font-size: 42px;
    line-height: 1;
    margin-bottom: 8px;
    background: linear-gradient(135deg, #6ee7ff, #a78bfa);

    /* 标准属性 + WebKit 前缀 */
    background-clip: text;
    -webkit-background-clip: text;

    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .upload-placeholder p {
    font-size: 14px;
    opacity: 0.9;
  }

  /* 预览列表 */
  .preview-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    gap: 12px;
  }

  /* 单个图片 */
  .preview-item {
    position: relative;
    aspect-ratio: 1 / 1;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
  }

  .preview-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  /* 悬浮遮罩 */
  .preview-mask {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.25s ease;
  }

  .preview-item:hover .preview-mask {
    opacity: 1;
  }

  .preview-mask button {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    background: linear-gradient(135deg, #f43f5e, #ec4899);
    color: #fff;
  }
</style>
