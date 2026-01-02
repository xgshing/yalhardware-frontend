<!-- src/components/DebugInfo.vue -->
<template>
  <div
    class="debug-info"
    v-if="showDebug"
  >
    <div
      class="debug-header"
      @click="toggleDebug"
    >
      🔍 调试信息 (点击收起)
    </div>
    <div class="debug-content">
      <h3>路由信息</h3>
      <pre>{{ routeInfo }}</pre>

      <h3>认证状态</h3>
      <pre>{{ authInfo }}</pre>

      <h3>API 请求</h3>
      <button @click="testApi">测试 /api/products/</button>
      <div v-if="apiResponse">
        <pre>{{ apiResponse }}</pre>
      </div>
    </div>
  </div>
  <div
    class="debug-toggle"
    @click="toggleDebug"
    v-else
  >
    🔍 显示调试信息
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { productsApi } from '@/api/products'

  const route = useRoute()
  const router = useRouter()
  const authStore = useAuthStore()
  const showDebug = ref(true)
  const apiResponse = ref<any>(null)

  const routeInfo = computed(() => ({
    path: route.path,
    fullPath: route.fullPath,
    name: route.name,
    params: route.params,
    query: route.query,
    meta: route.meta,
  }))

  const authInfo = computed(() => ({
    isAuthenticated: authStore.isAuthenticated,
    token: authStore.token ? `${authStore.token.substring(0, 20)}...` : null,
    user: authStore.user,
  }))

  const toggleDebug = () => {
    showDebug.value = !showDebug.value
  }

  const testApi = async () => {
    try {
      const response = await productsApi.getProducts()
      apiResponse.value = {
        status: '成功',
        data: response.data,
        count: response.data.count,
        results: response.data.results?.length || 0,
      }
    } catch (error: any) {
      apiResponse.value = {
        status: '失败',
        error: error.message,
        response: error.response?.data,
      }
    }
  }
</script>

<style scoped>
  .debug-info {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    z-index: 9999;
    max-height: 50vh;
    overflow-y: auto;
  }

  .debug-header {
    background: #333;
    padding: 5px 10px;
    cursor: pointer;
    font-weight: bold;
  }

  .debug-content {
    padding: 10px;
  }

  .debug-content h3 {
    margin: 10px 0 5px 0;
    color: #4fc3f7;
  }

  .debug-content pre {
    background: #222;
    padding: 5px;
    border-radius: 3px;
    overflow-x: auto;
    margin: 5px 0;
  }

  .debug-toggle {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #007bff;
    color: white;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    z-index: 9999;
  }

  button {
    background: #28a745;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    margin: 5px 0;
  }
</style>
