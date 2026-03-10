<template>
  <main>
    <h2>Popups Detail</h2>
    <p>Popups detail content</p>
    <p>Popup ID: {{ id }}</p>
  </main>
</template>

<script setup lang="ts">
// Popups Detail page logic will be added here
defineProps({
  id: String,
})
</script>
