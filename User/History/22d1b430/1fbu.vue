<template>
  <main>
    <h2>Edit Headquarter Notice</h2>
    <p>Edit headquarter notice content</p>
    <p>Notice ID: {{ id }}</p>
  </main>
</template>

<script setup lang="ts">
// Edit Headquarter Notice page logic will be added here
defineProps({
  id: String,
})
</script>
