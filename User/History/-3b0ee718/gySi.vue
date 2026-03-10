<script setup lang="ts">
import { RouterView } from 'vue-router'
import ErrorDialogContainer from '@/components/modals/ErrorDialogContainer.vue'
</script>

<template>
  <div id="app">
    <RouterView />
    <ErrorDialogContainer />
  </div>
</template>

<style>
#app {
  width: 100%;
  height: 100vh;
}
</style>
