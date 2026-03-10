<template>
  <div class="main-layout">
    <AppHeader v-if="shouldShowHeader" />

    <main class="main-content">
      <RouterView />
    </main>

    <!-- Global Loading Component -->
    <LoadingComponent
      :show="loadingStore.isLoading"
      type="overlay"
      size="medium"
      color="white"
      :backdrop="true"
    />
    <AppFooter v-if="shouldShowFooter" />
  </div>

  <DynamicDialog />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import { useAuthStore } from '@/stores/auth/auth'
import { useLoadingStore } from '@/stores/common/loading'
// import { useMenuStore } from '@/stores/common/menu'

const route = useRoute()
const authStore = useAuthStore()
const loadingStore = useLoadingStore()
// const menuStore = useMenuStore()

// Computed property to determine if header and footer should be shown based on route meta
const shouldShowHeader = computed(() => {
  return !route?.meta?.hideHeader
})

const shouldShowFooter = computed(() => {
  return !route?.meta?.hideHeader
})

onMounted(() => {
  // Initialize auth and menu for main layout
  authStore.initializeAuth()
  // menuStore.getUserMenu()
})
</script>
