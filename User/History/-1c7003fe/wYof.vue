<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('clients-by-period.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { usePrintPreviewStore } from '@/stores/print-preview.store'

const { t } = useI18n()
const { openPrintPreview } = usePrintPreviewStore()

const handlePrint = async (): Promise<void> => {
  const sections = []
  if (!sections.length) return
  await openPrintPreview(sections, {
    title: t('clients-by-period.title'),
  })
}
</script>
