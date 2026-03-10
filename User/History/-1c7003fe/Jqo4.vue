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

// Components
import ReportByBranchHeader from '../partials/ReportByBranchHeader.vue'

const { t } = useI18n()
const { openPrintPreview } = usePrintPreviewStore()

const handlePrint = async (): Promise<void> => {}

const handleChangeBranchShop = (value: number): void => {}
</script>
