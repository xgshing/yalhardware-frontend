<!-- src/views/admin/content/ContentForm.vue -->
<template>
  <el-form label-position="top">
    <el-form-item
      v-for="field in config?.formFields || []"
      :key="field.prop"
      :label="field.label"
    >
      <component
        :is="getComponent(field.type)"
        v-model="internalValue[field.prop]"
        v-bind="getProps(field)"
        @change="onChange(field)"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'
  import ImageUpload from '@/components/ImageUpload.vue'

  interface FormField {
    prop: string
    label: string
    type: 'input' | 'textarea' | 'number' | 'switch' | 'image' | string
    multiple?: boolean
  }

  interface FormConfig {
    formFields: FormField[]
  }

  interface ImageItem {
    id: number
    image_url: string
  }

  const props = defineProps<{
    modelValue: Record<string, any>
    config: FormConfig
    existingImages?: ImageItem[]
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', val: Record<string, any>): void
    (e: 'remove-remote', id: number): void
  }>()

  const internalValue = reactive({ ...props.modelValue })

  watch(
    () => internalValue,
    (val) => {
      emit('update:modelValue', val)
      console.log('[DEBUG][ContentForm] internalValue updated', val)
    },
    { deep: true }
  )

  function getComponent(type: FormField['type']) {
    switch (type) {
      case 'input':
        return 'el-input'
      case 'textarea':
        return 'el-input'
      case 'number':
        return 'el-input-number'
      case 'switch':
        return 'el-switch'
      case 'image':
        return ImageUpload
      default:
        return 'el-input'
    }
  }

  function getProps(field: FormField) {
    if (field.type === 'textarea')
      return { type: 'textarea', placeholder: field.label }

    if (field.type === 'image') {
      const urls = (props.existingImages ?? []).map((i) => i.image_url)
      console.log(
        '[DEBUG][ContentForm] existingImages passed to ImageUpload',
        urls
      )
      return {
        multiple: field.multiple ?? false,
        existingImages: urls,
        'onRemove-remote': (url: string) => {
          const item = (props.existingImages ?? []).find(
            (i) => i.image_url === url
          )
          if (item) {
            console.log('[DEBUG][ContentForm] remove-remote emitted', item.id)
            emit('remove-remote', item.id)
          }
        },
      }
    }

    if (field.type === 'number') return { min: 0, placeholder: field.label }
    return { placeholder: field.label }
  }

  function onChange(field: FormField) {
    if (field.type === 'switch') {
      internalValue[field.prop] = Boolean(internalValue[field.prop])
      console.log(
        `[DEBUG][ContentForm] switch ${field.prop} changed to`,
        internalValue[field.prop]
      )
    }
  }
</script>
