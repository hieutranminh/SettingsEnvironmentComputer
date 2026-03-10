<template>
  <main>
    <h2>Headquarter Notice Detail</h2>
    <p>Headquarter notice detail content</p>
    <p>Notice ID:a {{ id }}</p>
  </main>
</template>

<script setup lang="ts">
// Headquarter Notice Detail page logic will be added here
defineProps({
  id: String,
})
</script>
