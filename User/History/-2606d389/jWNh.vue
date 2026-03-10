<template>
  <main>
    <h2>Ahasoft Notice Detail</h2>
    <p>Ahasoft notice detail content</p>
    <p>Notice ID: {{ id }}</p>
  </main>
</template>

<script setup lang="ts">
// Ahasoft Notice Detail page logic will be added here
defineProps({
  id: String,
})
</script>
