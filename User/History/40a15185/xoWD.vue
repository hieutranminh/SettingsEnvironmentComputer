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
import { usePrintPreview } from '@/composables/usePrintPreview'
import { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'

const { openPreview } = usePrintPreview()

const handlePrintPreview = () => {
  openPreview({
    type: PRINT_PREVIEW_WORKER_ACTIONS.BRANCH_SALES,
    config: {
      header: {
        title: 'Branch Sales Report',
        // subtitle: 'Sales Summary by Branch',
        dateRange: { from: '2024-01-01', to: '2025-01-02' },
        showCurrentDate: true,
        showPageNumber: true,
      },
      page: {
        orientation: 'landscape',
      },
      exportType: 'both',
    },
    data: [
      { branch: 'Main Branch', sales: 15000, date: '2025-01-01', totalSales: 15000, totalQuantity: 100 },
      { branch: 'North Branch', sales: 12000, date: '2025-01-01', totalSales: 12000, totalQuantity: 80 },
      { branch: 'South Branch', sales: 10000, date: '2025-01-01', totalSales: 10000, totalQuantity: 60 },
      { branch: 'East Branch', sales: 8000, date: '2025-01-01', totalSales: 8000, totalQuantity: 40 },
      { branch: 'West Branch', sales: 6000, date: '2025-01-01', totalSales: 6000, totalQuantity: 20 },
      { branch: 'Central Branch', sales: 4000, date: '2025-01-01', totalSales: 4000, totalQuantity: 10 },
      { branch: 'Downtown Branch', sales: 2000, date: '2025-01-01', totalSales: 2000, totalQuantity: 5 },
      { branch: 'Suburban Branch', sales: 1000, date: '2025-01-01', totalSales: 1000, totalQuantity: 3 },
      { branch: 'Rural Branch', sales: 500, date: '2025-01-01', totalSales: 500, totalQuantity: 2 },
      { branch: 'Urban Branch', sales: 250, date: '2025-01-01', totalSales: 250, totalQuantity: 1 },
    ],
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
