<template>
  <Dialog
    :visible="true"
    :modal="options.modal ?? true"
    :draggable="options.draggable ?? false"
    :resizable="options.resizable ?? false"
    :maximizable="options.maximizable ?? false"
    :minimizable="options.minimizable ?? false"
    :closeOnEscape="options.closeOnEscape ?? true"
    :closeOnOverlayClick="options.closeOnOverlayClick ?? false"
    :style="{ width: options.width ?? '450px' }"
    :header="options.title"
    @update:visible="handleClose"
  >
    <div class="dialog-content">
      <div v-if="options.icon" class="dialog-icon">
        <i :class="options.icon"></i>
      </div>
      <div class="dialog-message">
        {{ options.message }}
      </div>
    </div>

    <template #footer>
      <div class="dialog-actions">
        <Button
          v-for="(action, index) in options.actions"
          :key="index"
          :label="action.label"
          :severity="action.severity ?? 'primary'"
          :disabled="action.disabled"
          @click="handleActionClick(action)"
        />
        <Button
          v-if="options.closable !== false"
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
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import type { DialogOptions, DialogAction } from '@/types/dialog'

interface Props {
  options: DialogOptions
}

interface Emits {
  (e: 'close'): void
  (e: 'action', action: DialogAction): void
}

defineProps<Props>()
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
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;

  .dialog-icon {
    flex-shrink: 0;
    font-size: 1.5rem;
    color: var(--primary-color);
  }

  .dialog-message {
    flex: 1;
    line-height: 1.5;
  }
}

.dialog-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}
</style>
