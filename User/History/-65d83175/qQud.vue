<template>
  <InputText :class="$style.myinput" placeholder="Search" />
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext'
</script>

<style module lang="scss">
.myinput {
  border-radius: 2rem;
  padding: 1rem 2rem;
  border-width: 2px;
}
</style>
