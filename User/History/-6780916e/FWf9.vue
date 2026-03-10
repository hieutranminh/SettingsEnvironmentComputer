<template>
  <div class="print-actions">
    <!-- Pagination Controls -->
    <div
      v-if="totalPages > 1"
      class="pagination-controls"
    >
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>

      <Button
        icon="pi pi-angle-double-left"
        variant="outlined"
        severity="contrast"
        size="small"
        @click="handleSetPage(1)"
        :disabled="currentPage === 1"
      />
      <Button
        icon="pi pi-angle-left"
        variant="outlined"
        severity="contrast"
        size="small"
        @click="handleSetPage(currentPage - 1)"
        :disabled="currentPage === 1"
      />
      <Button
        icon="pi pi-angle-right"
        variant="outlined"
        severity="contrast"
        size="small"
        @click="handleSetPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      />
      <Button
        icon="pi pi-angle-double-right"
        variant="outlined"
        severity="contrast"
        size="small"
        @click="handleSetPage(totalPages)"
        :disabled="currentPage === totalPages"
      />

      <div class="go-to-page">
        <Button
          severity="secondary"
          size="small"
          @click="handleSetPage(currentPage + 1)"
        >
          Goto
        </Button>

        <Select
          v-model="goToPage"
          size="small"
          :options="Array.from({ length: totalPages }, (_, i) => ({ label: i + 1, value: i + 1 }))"
          option-label="label"
          option-value="value"
          @change="handleGoToPage"
        />
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <Button
        icon="pi pi-cog"
        severity="secondary"
        @click="handleToggleConfiguration"
      />
      <Button
        icon="pi pi-print"
        label="Print"
        @click="handlePrint"
        :loading="isProcessing"
      />
      <Button
        icon="pi pi-download"
        label="PDF"
        severity="secondary"
        @click="handleDownloadPDF"
        :loading="isProcessing"
      />
      <Button
        icon="pi pi-file-excel"
        label="Excel"
        severity="secondary"
        @click="handleDownloadExcel"
        :loading="isProcessing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  isProcessing: boolean
  currentPage: number
  totalPages: number
}

interface Emits {
  (e: 'print'): void
  (e: 'downloadPdf'): void
  (e: 'downloadExcel'): void
  (e: 'setPage', page: number): void
  (e: 'toggleConfiguration'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const goToPage = ref<number | null>(props.currentPage)

const handlePrint = () => {
  emit('print')
}

const handleDownloadPDF = () => {
  emit('downloadPdf')
}

const handleDownloadExcel = () => {
  emit('downloadExcel')
}

const handleSetPage = (page: number) => {
  emit('setPage', page)
  goToPage.value = null
}

const handleToggleConfiguration = () => {
  emit('toggleConfiguration')
}

const handleGoToPage = () => {
  if (goToPage.value && goToPage.value >= 1 && goToPage.value <= props.totalPages) {
    handleSetPage(goToPage.value)
  }
}

// Reset goToPage when currentPage changes
watch(
  () => props.currentPage,
  () => {
    goToPage.value = null
  },
)
</script>

<style lang="scss" scoped>
.print-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;

  .pagination-controls {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.3rem;

    .page-info {
      margin-right: 0.5rem;
    }

    .go-to-page {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      margin-left: 0.5rem;

      .p-button {
        height: 28.5px;
      }

      :deep(.p-select-sm) {
        .p-select-label {
          padding: 5px 15px;
        }
      }
    }
  }
}
</style>
