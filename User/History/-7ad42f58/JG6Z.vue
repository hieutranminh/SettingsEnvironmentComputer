<template>
  <MessageDialog :type="type" :message="message" />
</template>

<script setup lang="ts">
import MessageDialog from './MessageDialog.vue'

interface Props {
  type: 'error' | 'success' | 'warning' | 'info'
  message: string
}

defineProps<Props>()
</script>
