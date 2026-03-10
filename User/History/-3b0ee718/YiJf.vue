<template>
  <RouterView />

  <GlobalDialog />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import GlobalDialog from '@/components/modals/GlobalDialog.vue'
</script>

<style scoped>
</style>
