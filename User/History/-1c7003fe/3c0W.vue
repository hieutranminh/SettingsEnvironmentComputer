<template>
  <!-- Header -->
  <ReportByBranchHeader
    :title="$t('clients-by-period.title')"
    @print="handlePrint"
    @changeBranchShop="handleChangeBranchShop"
  />ádasd
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import { usePrintPreviewStore } from '@/stores/print-preview.store'

const { t } = useI18n()
const { openPrintPreview } = usePrintPreviewStore()

const handlePrint = async (): Promise<void> => {}

const handleChangeBranchShop = (value: number): void => {}
</script>
