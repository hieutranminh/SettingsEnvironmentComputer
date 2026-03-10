<template>
  <Teleport to="body">
    <TransitionGroup
      name="error-dialog"
      tag="div"
      class="error-dialog-container"
    >
      <ErrorDialog
        v-for="dialog in visibleDialogs"
        :key="dialog.id"
        :options="dialog.options"
        :is-visible="dialog.isVisible"
        :z-index="dialog.zIndex"
        @close="handleDialogClose(dialog.id)"
        @confirm="handleDialogConfirm(dialog.id)"
        @cancel="handleDialogCancel(dialog.id)"
      />
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { TransitionGroup } from 'vue'
import ErrorDialog from './ErrorDialog.vue'
import { useErrorDialogStore } from '@/stores/errorDialog'

const errorDialogStore = useErrorDialogStore()

const visibleDialogs = computed(() => errorDialogStore.visibleDialogs)

const handleDialogClose = (id: string) => {
  errorDialogStore.hideDialog(id)
}

const handleDialogConfirm = (id: string) => {
  const dialog = visibleDialogs.value.find(d => d.id === id)
  if (dialog?.options.onConfirm) {
    dialog.options.onConfirm()
  }
  errorDialogStore.hideDialog(id)
}

const handleDialogCancel = (id: string) => {
  const dialog = visibleDialogs.value.find(d => d.id === id)
  if (dialog?.options.onClose) {
    dialog.options.onClose()
  }
  errorDialogStore.hideDialog(id)
}
</script>

<style scoped lang="scss">
.error-dialog-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

// Transition animations
.error-dialog-enter-active,
.error-dialog-leave-active {
  transition: all 0.3s ease;
}

.error-dialog-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.error-dialog-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.error-dialog-move {
  transition: transform 0.3s ease;
}
</style>
