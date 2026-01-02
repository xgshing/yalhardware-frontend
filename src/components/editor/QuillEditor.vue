<!-- Quill 富文本图片上传 -->
<!-- src/components/editor/QuillEditor.vue -->
<template>
  <div
    ref="editorRef"
    class="quill-container"
  ></div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
  import Quill from 'quill'
import 'quill/dist/quill.snow.css'
  import request from '@/utils/request'

  // ------------------ Props ------------------
  interface Props {
    modelValue: string
    modules?: any
  }
  const props = defineProps<Props>()

  // ------------------ Emits ------------------
  const emit = defineEmits<{
    (e: 'update:modelValue', v: string): void
  }>()

  // ------------------ Refs ------------------
  const editorRef = ref<HTMLDivElement | null>(null)
  let quill: InstanceType<typeof Quill> | null = null
  // ------------------ 图片上传 ------------------
  const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('image', file)

  const res = await request.post('/upload/rich-image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return res.data.url
}
  // ------------------ 点击图片切换对齐 ------------------
  const handleImageClick = (img: HTMLImageElement) => {
    const currentAlign = img.getAttribute('data-align') || 'left'
    let nextAlign: 'left' | 'center' | 'right' = 'left'
    if (currentAlign === 'left') nextAlign = 'center'
    else if (currentAlign === 'center') nextAlign = 'right'
    else nextAlign = 'left'

    img.style.display = 'block'
    img.style.marginLeft = nextAlign === 'left' ? '0' : 'auto'
    img.style.marginRight = nextAlign === 'right' ? '0' : 'auto'
    img.style.margin = nextAlign === 'center' ? '0 auto' : img.style.margin
    img.setAttribute('data-align', nextAlign)
    img.style.maxWidth = '100%'
    img.style.height = 'auto'
  }

  // ------------------ 初始化 Quill ------------------
  onMounted(() => {
    if (!editorRef.value) return

    quill = new Quill(editorRef.value, {
      theme: 'snow',
      modules: props.modules || {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: [1, 2, 3, false] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ align: [] }],
            ['link', 'image'],
            ['clean'],
          ],
          handlers: {
            image: () => {
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.click()

              input.onchange = async () => {
                const file = input.files?.[0]
                if (!file || !quill) return

                const range = quill.getSelection(true)
                const imageUrl = await uploadImage(file)
                quill.insertEmbed(range.index, 'image', imageUrl)
                quill.setSelection(range.index + 1)

                // 自动设置图片样式 & 点击事件
                setTimeout(() => {
                  const imgs: NodeListOf<HTMLImageElement> =
                    quill!.root.querySelectorAll('img')
                  imgs.forEach((img) => {
                    img.style.maxWidth = '100%'
                    img.style.height = 'auto'
                    img.style.display = 'block'
                    img.style.margin = '8px 0'
                    img.onclick = () => handleImageClick(img)
                  })
                }, 50)
              }
            },
          },
        },
      },
    })

    // 初始化内容
    quill.root.innerHTML = props.modelValue || ''

    // 内容变化监听
    quill.on('text-change', () => {
      emit('update:modelValue', quill!.root.innerHTML)
    })
  })

  // 外部 modelValue 更新同步
  watch(
    () => props.modelValue,
    (v) => {
      if (quill && quill.root.innerHTML !== v) {
        quill.root.innerHTML = v || ''
      }
    }
  )

  onBeforeUnmount(() => {
    quill = null
  })
</script>

<style scoped>
  .quill-container {
    min-height: 300px;
    max-width: 100%;
    overflow-x: hidden;
  }

  /* toolbar 固定在上方 */
  .quill-container .ql-toolbar {
    display: block;
  }

  /* editor 宽度撑满 */
  .quill-container .ql-container {
    width: 100%;
  }

  /* 图片自适应 */
  .quill-container .ql-editor img {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 8px 0 !important;
    cursor: pointer;
  }
</style>
