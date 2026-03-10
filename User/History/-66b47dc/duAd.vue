<template>
  <div class="test-format">
    <h1>Test Format</h1>
    <p>This is a test file to check if format on save works correctly.</p>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

const handleClick = () => {
  count.value++
  console.log('Button clicked:', count.value)
}
</script>

<style lang="scss" scoped>
.test-format {
  padding: 20px;

  h1 {
    color: #333;
    margin-bottom: 10px;
  }

  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background: #0056b3;
    }
  }
}
</style>
