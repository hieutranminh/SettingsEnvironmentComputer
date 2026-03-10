<template>
  <RouterView />

  <!-- Global Loading Component -->
  <LoadingComponent type="overlay" size="medium" color="white" :backdrop="true" />

  <DynamicDialog />

  <!-- Print Preview Dialog -->
  <PrintPreviewDialog />

  <HelpCenterInfomation />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'

import HelpCenterInfomation from '@/components/common/HelpCenterInfomation.vue'
</script>

<style scoped>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
