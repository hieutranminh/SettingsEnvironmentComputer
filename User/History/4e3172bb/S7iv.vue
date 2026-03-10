<template>
  <main>
    <h2>Edit Popups</h2>
    <p>Edit popups content</p>
    <p>Popup ID: {{ id }}</p>
  </main>
</template>

<script setup lang="ts">
// Edit Popups page logic will be added here
defineProps({
  id: String,
})
</script>
