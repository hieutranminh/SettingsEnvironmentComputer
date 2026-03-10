<template>
  <BaseDialog
    v-if="dialogState"
    :options="dialogState.options"
    @close="handleClose"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { dialogService } from '@/services/dialogService'
import BaseDialog from './BaseDialog.vue'
import type { DialogAction } from '@/types/dialog'

const dialogState = computed(() => dialogService.getState().value)

const handleClose = (): void => {
  dialogService.close()
}

const handleAction = (action: DialogAction): void => {
  dialogService.close(action)
}
</script>
