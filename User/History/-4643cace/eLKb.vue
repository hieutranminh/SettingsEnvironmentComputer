<template>
  <main>
    <h1>User Detail</h1>
    <p>User detail page content for user ID: {{ $route.params.id }}</p>
  </main>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>
