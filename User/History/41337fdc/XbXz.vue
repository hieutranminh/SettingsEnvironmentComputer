<!-- components/dialogs/ErrorDialog.vue -->
<template>
  <div class="dialog-content">
    <div class="dialog-icon">
      <i class="pi pi-times-circle" style="color: #ef4444; font-size: 3rem;"></i>
    </div>
    <div class="dialog-message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string
}

defineProps<Props>()
</script>

<style scoped>
.dialog-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
}

.dialog-icon {
  flex-shrink: 0;
}

.dialog-message {
  flex: 1;
}

.dialog-message p {
  margin: 0;
  line-height: 1.5;
  font-size: 1rem;
}
</style>
