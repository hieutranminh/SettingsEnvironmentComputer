<template>
  <div class="main-layout">
    <AppHeader v-if="shouldShowHeader" />

    <main class="main-content">
      <RouterView />
    </main>

    <!-- Global Loading Component -->
    <LoadingComponent
      :show="storeLoading.isLoading"
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
import { computed, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

import AppFooter from '@/components/common/AppFooter.vue'
import AppHeader from '@/components/common/AppHeader.vue'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useAuthStore } from '@/stores/auth/auth'
import { useLoadingStore } from '@/stores/common/loading'
import { useMenuStore } from '@/stores/common/menu'

const route = useRoute()
const authStore = useAuthStore()
const storeLoading = useLoadingStore()
const menuStore = useMenuStore()

const { showError } = useMessageDialog()

// Computed property to determine if header and footer should be shown based on route meta
const shouldShowHeader = computed(() => {
  return !route?.meta?.hideHeader
})

const shouldShowFooter = computed(() => {
  return !route?.meta?.hideHeader
})

const getMenuAsync = async () => {
  try {
    storeLoading.startLoading(true)
    const payload = {
      countryCode: authStore.shop.country,
      serviceTypeCode: authStore.shop.serviceTypeCode,
      businessTypeCode: authStore.shop.businessTypeCode,
      userRoleCode: authStore.user.userRoleCode,
      shopUserRoleId: 0,
      solutionId: authStore.shop.solutionId,
    }
    const response = await menuStore.getUserMenu(payload)
    if (!response.isOK) {
      showError('Error', response?.errorMessages)
    }
  } catch (error) {
    showError('Error', error instanceof Error ? error.message : 'Unknown error')
  } finally {
    storeLoading.startLoading(false)
  }
}
onBeforeMount(() => {
  // Initialize auth and menu for main layout
  authStore.initializeAuth()
  getMenuAsync()
})
</script>
