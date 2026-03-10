<template>
  <MessageDialog :type="dialogData.type" :message="dialogData.message" />
</template>

<script setup lang="ts">
import MessageDialog from './MessageDialog.vue'
import { inject } from 'vue'

const dialogData = inject('dialogData', {
  type: 'info' as const,
  message: ''
})
</script>
