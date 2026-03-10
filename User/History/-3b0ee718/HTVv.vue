<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import { useAuthStore } from '@/stores/auth/auth'
import { useLoadingStore } from '@/stores/common/loading'

const authStore = useAuthStore()
const loadingStore = useLoadingStore()

const route = useRoute()

const shouldShowFooter = computed(() => {
  return !route?.meta?.hideHeader
})

onMounted(() => {
  // Initialize auth and set language from user data if available
  authStore.initializeAuth()
})
</script>

<template>
  <div id="app">
    <RouterView />

    <!-- Global Loading Component -->
    <LoadingComponent
      :show="loadingStore.isLoading"
      type="overlay"
      size="medium"
      color="white"
      :backdrop="true"
    />
  </div>

  <DynamicDialog />
</template>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
