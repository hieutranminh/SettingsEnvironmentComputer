<template>
  <Dialog
    :visible="isVisible"
    :modal="true"
    :closable="options.closable"
    :close-on-escape="options.closable"
    :dismissable-mask="options.closable"
    :style="{ zIndex: zIndex }"
    :class="dialogClasses"
    @hide="handleClose"
    @keydown.escape="handleClose"
  >
    <template #header>
      <div class="error-dialog__header">
        <i :class="severityIcon" class="error-dialog__icon"></i>
        <h2 class="error-dialog__title">{{ options.title }}</h2>
      </div>
    </template>

    <div class="error-dialog__content">
      <p class="error-dialog__message">{{ options.message }}</p>

      <div v-if="options.details && showDetails" class="error-dialog__details">
        <button
          type="button"
          class="error-dialog__details-toggle"
          @click="toggleDetails"
          @keydown.enter="toggleDetails"
          @keydown.space="toggleDetails"
          :aria-expanded="showDetails"
          aria-controls="error-details"
        >
          <i class="pi" :class="detailsIcon"></i>
          {{ showDetails ? 'Hide Details' : 'Show Details' }}
        </button>

        <div
          v-show="showDetails"
          id="error-details"
          class="error-dialog__details-content"
          role="region"
          aria-label="Error details"
        >
          <pre class="error-dialog__details-text">{{ options.details }}</pre>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="error-dialog__footer">
        <BaseButton
          v-if="options.showCancelButton"
          variant="secondary"
          size="medium"
          @click="handleCancel"
        >
          {{ options.cancelText }}
        </BaseButton>

        <BaseButton
          variant="primary"
          size="medium"
          @click="handleConfirm"
        >
          {{ options.confirmText }}
        </BaseButton>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Dialog from 'primevue/dialog'
import BaseButton from '@/components/common/BaseButton.vue'
import type { ErrorDialogOptions } from '@/types/ErrorDialog'

interface Props {
  options: ErrorDialogOptions
  isVisible: boolean
  zIndex: number
}

interface Emits {
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const showDetails = ref(props.options.showDetails ?? false)

const severityIcon = computed(() => {
  switch (props.options.severity) {
    case 'error':
      return 'pi pi-exclamation-triangle'
    case 'warning':
      return 'pi pi-exclamation-circle'
    case 'info':
      return 'pi pi-info-circle'
    default:
      return 'pi pi-exclamation-triangle'
  }
})

const detailsIcon = computed(() =>
  showDetails.value ? 'pi-chevron-up' : 'pi-chevron-down'
)

const dialogClasses = computed(() => [
  'error-dialog',
  `error-dialog--${props.options.severity}`
])

const handleClose = () => {
  if (props.options.onClose) {
    props.options.onClose()
  }
  emit('close')
}

const handleConfirm = () => {
  if (props.options.onConfirm) {
    props.options.onConfirm()
  }
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}

const toggleDetails = () => {
  showDetails.value = !showDetails.value
}
</script>

<style scoped lang="scss">
.error-dialog {
  &__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  &__title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
  }

  &__content {
    padding: 1rem 0;
  }

  &__message {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    line-height: 1.5;
    color: var(--text-color);
  }

  &__details {
    margin-top: 1rem;
  }

  &__details-toggle {
    background: none;
    border: none;
    padding: 0.5rem 0;
    font-size: 0.875rem;
    color: var(--primary-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-600);
    }

    &:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
      border-radius: 0.25rem;
    }
  }

  &__details-content {
    margin-top: 0.75rem;
    padding: 1rem;
    background-color: var(--surface-100);
    border-radius: 0.375rem;
    border: 1px solid var(--surface-300);
  }

  &__details-text {
    margin: 0;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    line-height: 1.4;
    color: var(--text-color);
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__footer {
    display: flex;
    gap: 0.75rem;
    justify-content: flex-end;
  }

  // Severity-specific styles
  &--error {
    .error-dialog__icon {
      color: var(--red-500);
    }
  }

  &--warning {
    .error-dialog__icon {
      color: var(--orange-500);
    }
  }

  &--info {
    .error-dialog__icon {
      color: var(--blue-500);
    }
  }
}

// PrimeVue Dialog customization
:deep(.p-dialog) {
  max-width: 500px;
  width: 90vw;
}

:deep(.p-dialog-header) {
  padding: 1.5rem 1.5rem 0 1.5rem;
}

:deep(.p-dialog-content) {
  padding: 0 1.5rem;
}

:deep(.p-dialog-footer) {
  padding: 0 1.5rem 1.5rem 1.5rem;
}
</style>
