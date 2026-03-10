<template>
  <AppDialog
    v-if="isDialogVisible && currentDialogConfig"
    :config="currentDialogConfig"
    @close="handleClose"
    @action="handleAction"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDialog } from '@/composables/useDialog'
import type { DialogAction } from '@/types/dialog'

const dialogService = useDialog()

const isDialogVisible = computed(() => dialogService.isDialogVisible)
const currentDialogConfig = computed(() => dialogService.currentDialogConfig)

const handleClose = (): void => {
  dialogService.close()
}

const handleAction = (action: DialogAction): void => {
  if (action.onClick) {
    action.onClick()
  }
  dialogService.close()
}
</script>
