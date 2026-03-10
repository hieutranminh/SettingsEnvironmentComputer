<template>
  <Dialog
    :visible="true"
    :modal="options.modal ?? true"
    :closable="options.closable ?? true"
    :close-on-escape="options.closeOnEscape ?? true"
    :close-on-overlay-click="options.closeOnOverlayClick ?? true"
    :draggable="options.draggable ?? false"
    :resizable="options.resizable ?? false"
    :style="{ width: options.width ?? '450px', height: options.height }"
    :header="options.title"
    @update:visible="handleClose"
  >
    <div class="dialog-content">
      <div class="dialog-message">
        <i v-if="iconClass" :class="iconClass" class="dialog-icon"></i>
        <p>{{ options.message }}</p>
      </div>
    </div>

    <template #footer>
      <div class="dialog-actions">
        <Button
          v-for="(action, index) in options.actions"
          :key="index"
          :label="action.label"
          :severity="action.severity"
          :outlined="action.outlined"
          :disabled="action.disabled"
          @click="handleAction(action)"
        />
        <Button
          v-if="options.closable !== false"
          label="Close"
          severity="secondary"
          outlined
          @click="handleClose"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const iconClass = computed(() => {
  if (props.options.icon) {
    return props.options.icon
  }

  const typeIcons = {
    info: 'pi pi-info-circle',
    success: 'pi pi-check-circle',
    warning: 'pi pi-exclamation-triangle',
    error: 'pi pi-times-circle',
    confirm: 'pi pi-question-circle'
  }

  return typeIcons[props.options.type ?? 'info']
})

const handleClose = () => {
  emit('close')
}

const handleAction = async (action: DialogAction) => {
  try {
    await action.action()
  } catch (error) {
    console.error('Dialog action failed:', error)
  }
  emit('action', action)
}
</script>

<style scoped lang="scss">
.dialog-content {
  .dialog-message {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;

    .dialog-icon {
      font-size: 1.25rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    p {
      margin: 0;
      line-height: 1.5;
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
