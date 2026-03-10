<template>
  <BaseButton
    :loading="isWorkerProcessing"
    :disabled="!canStartPrint"
    :variant="variant"
    :size="size"
    :icon="icon"
    @click="handleClick"
  >
    <template #default>
      <slot>
        {{ buttonText }}
      </slot>
    </template>
  </BaseButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/common/BaseButton.vue'
import { usePrintPreview } from '../composables/usePrintPreview'
import type { WorkerType, TableHeader, ReportHeader } from '../types/print-preview.types'

interface Props {
  workerType: WorkerType
  tableHeaders: TableHeader[]
  reportHeaders: ReportHeader[]
  requestPayload?: Record<string, any>
  additionalOptions?: Record<string, any>
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  requestPayload: () => ({}),
  additionalOptions: () => ({}),
  variant: 'primary',
  size: 'md',
  icon: 'printer',
  buttonText: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  start: []
  error: [error: string]
}>()

const { t } = useI18n()
const {
  isWorkerProcessing,
  canStartPrint,
  handlePrintButtonClick,
  handleError,
} = usePrintPreview()

const buttonText = computed(() => 
  props.buttonText || t('common.print')
)

const handleClick = async (event: MouseEvent): Promise<void> => {
  emit('click', event)
  emit('start')

  try {
    await handlePrintButtonClick(
      props.workerType,
      props.tableHeaders,
      props.reportHeaders,
      props.requestPayload,
      props.additionalOptions
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    handleError(errorMessage)
    emit('error', errorMessage)
  }
}
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 