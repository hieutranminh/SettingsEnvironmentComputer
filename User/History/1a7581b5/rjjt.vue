<template>
  <Dialog
    :visible="true"
    :modal="config.modal ?? true"
    :draggable="config.draggable ?? false"
    :resizable="config.resizable ?? false"
    :closeOnEscape="config.closeOnEscape ?? true"
    :dismissableMask="config.dismissableMask ?? false"
    :style="{ width: config.width ?? '450px' }"
    :header="config.title"
    @update:visible="handleClose"
  >
    <div class="dialog-content">
      <div class="dialog-message">
        <i v-if="config.icon" :class="config.icon" class="dialog-icon"></i>
        <div class="message-text">{{ config.message }}</div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-actions">
        <Button
          v-for="(action, index) in config.actions"
          :key="index"
          :label="action.label"
          :severity="action.severity ?? 'primary'"
          :disabled="action.disabled"
          @click="handleActionClick(action)"
        />
        <Button
          v-if="config.closable !== false"
          label="Close"
          severity="secondary"
          text
          @click="handleClose"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, Button } from 'primevue'
import type { DialogConfig, DialogAction } from '@/types/dialog'

interface Props {
  config: DialogConfig
}

interface Emits {
  (e: 'close'): void
  (e: 'action', action: DialogAction): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = (): void => {
  emit('close')
}

const handleActionClick = (action: DialogAction): void => {
  if (action.onClick) {
    action.onClick()
  }
  emit('action', action)
}
</script>

<style scoped lang="scss">
.dialog-content {
  .dialog-message {
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    .dialog-icon {
      font-size: 1.5rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .message-text {
      line-height: 1.5;
      white-space: pre-wrap;
    }
  }
}

.dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
