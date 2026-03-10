<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
// import { useAuthStore } from '@/stores/auth/auth'
import AppHeader from '@/components/common/AppHeader.vue'

// const authStore = useAuthStore()

onMounted(() => {
  // Initialize auth and set language from user data if available
  // authStore.initializeAuth()
})
</script>

<template>
  <div id="app">
    <AppHeader />

    <main>
      <RouterView />
    </main>

    <DynamicDialog />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>

