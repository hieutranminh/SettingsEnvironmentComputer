<script setup lang="ts">
import { RouterView } from 'vue-router'

import { useLoadingStore } from '@/stores/common/loading'

const loadingStore = useLoadingStore()
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

  <!-- Print Preview Dialog -->
  <PrintPreviewDialog />
</template>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
