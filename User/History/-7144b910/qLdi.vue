<template>
  <div class="date-picker-examples">
    <div class="example-section">
      <DatePickerField v-model="basicDate" placeholder="Choose a date" required />
      <p class="result">{{ basicDate }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DatePickerField } from '@/components/common'

const basicDate = ref<Date | null>(new Date())
</script>

<style scoped lang="scss"></style>
