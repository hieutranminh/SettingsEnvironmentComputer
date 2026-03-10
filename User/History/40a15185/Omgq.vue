<template>
  <section class="branch-sales-header">
    <!-- Title -->
    <div class="branch-sales-header-left">
      <h1>Branch Sales</h1>
    </div>

    <!-- Action -->
    <div class="branch-sales-header-right">
      <Button
        label="Primary"
        severity="info"
        @click="handlePrintPreview"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePrintConfig } from '@/composables/usePrintConfig'
import { usePrintPreview } from '@/composables/usePrintPreview'
import { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'

const { openPreview } = usePrintPreview()
const { createLandscapeConfig } = usePrintConfig()

const handlePrintPreview = () => {
  const config = createLandscapeConfig('Branch Sales Report', {
    from: '2025-01-01',
    to: '2025-01-01',
  })

  openPreview({
    type: PRINT_PREVIEW_WORKER_ACTIONS.BRANCH_SALES,
    config,
  })
}
</script>

<style lang="scss" scoped>
.branch-sales-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid var(--p-gray-950);

  .branch-sales-header-left {
    h1 {
      font-size: 18px;
      font-weight: 900;
    }
  }

  .branch-sales-header-right {
    margin-left: auto;

    .p-button {
      width: 150px;
    }
  }
}
</style>
