<template>
  <div />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth/auth'
import { useSignalRStore } from '@/stores/signalR/signalR'
import { gotoLoginPageWhenPossible } from '@/utils/common'

const router = useRouter()
const authStore = useAuthStore()
const signalRStore = useSignalRStore()

onMounted(async () => {
  // Get login path and country from store
  const loginPath = authStore.loginPath || ''
  const country = authStore.loginCountry || ''

  // Clear cache and logout
  // authStore.logout()
  authStore.updateLoginPath('')

  // Stop SignalR connection - silent fail to ensure logout completes
  try {
    await signalRStore.stopSignalR()
  } catch {
    // Ignore SignalR stop errors - user should still be logged out
  } finally {
    signalRStore.resetState()
  }

  // Navigate to login path if exists, otherwise use gotoLoginPageWhenPossible
  if (loginPath && loginPath.length > 0) {
    router.push({ path: loginPath }).catch(() => {
      // Fallback: use gotoLoginPageWhenPossible if router push fails
      gotoLoginPageWhenPossible(country)
    })
  } else {
    // Go to login page based on country
    gotoLoginPageWhenPossible(country)
  }
})
</script>
