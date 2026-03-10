<template>
  <div class="main-layout">
    <AppHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useShopStore } from '@/stores/shop'

const authStore = useAuthStore()
const shopStore = useShopStore()

/**
 * On page refresh (F5), re-initialize shop configuration data
 * if user is authenticated but shop data is not yet loaded.
 */
onMounted(async () => {
  if (authStore.isAuthenticated && !shopStore.isInitialized && authStore.userAuthInfo) {
    try {
      await shopStore.initialize(authStore.userAuthInfo.shopId, authStore.userAuthInfo.countryCode)
    } catch (error: unknown) {
      if (import.meta.env.DEV) {
        console.error('[MainLayout] Failed to initialize shop data:', error)
      }
    }
  }
})
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>
