<template>
  <ConfirmDialog :draggable="false" />
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

import { t } from '@/plugins/i18n'

const props = withDefaults(defineProps<Props>(), {
  title: t('general.alert'),
  message: '',
  acceptLabel: t('common.confirm'),
  rejectLabel: t('general.cancel'),
})

interface Props {
  title?: string
  message?: string
  acceptLabel?: string
  rejectLabel?: string
}

const confirm = useConfirm()

interface OpenOptions {
  title?: string
  header?: string
  message?: string
  icon?: string
  acceptLabel?: string
  rejectLabel?: string
}

const open = (options: OpenOptions = {}): Promise<boolean> => {
  return new Promise((resolve) => {
    confirm.require({
      header: options.header ?? options.title ?? props.title,
      message: options.message ?? props.message,
      acceptLabel: options.acceptLabel ?? props.acceptLabel,
      rejectLabel: options.rejectLabel ?? props.rejectLabel,
      acceptClass: 'p-button-primary',
      rejectClass: 'p-button-secondary',
      accept: () => resolve(true),
      reject: () => resolve(false),
    })
  })
}

defineExpose({ open: () => Promise<boolean> })
</script>
