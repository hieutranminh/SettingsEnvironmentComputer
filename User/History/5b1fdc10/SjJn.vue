<template>
  <Card>
    <template #content>
      <div class="print-actions">
        <!-- Pagination Controls -->
        <div
          v-if="totalPages > 1"
          class="pagination-controls"
        >
          <span class="page-info">
            {{ $t('general.page') }} {{ currentPage }} {{ $t('general.of') }} {{ totalPages }}
          </span>

          <Button
            icon="pi pi-angle-double-left"
            variant="outlined"
            severity="contrast"
            @click="handleSetPage(1)"
            :disabled="currentPage === 1"
          />
          <Button
            icon="pi pi-angle-left"
            variant="outlined"
            severity="contrast"
            @click="handleSetPage(currentPage - 1)"
            :disabled="currentPage === 1"
          />
          <Button
            icon="pi pi-angle-right"
            variant="outlined"
            severity="contrast"
            @click="handleSetPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
          />
          <Button
            icon="pi pi-angle-double-right"
            variant="outlined"
            severity="contrast"
            @click="handleSetPage(totalPages)"
            :disabled="currentPage === totalPages"
          />

          <div class="go-to-page">
            <Button
              severity="secondary"
              @click="handleToggleSelectGoToPage"
            >
              {{ $t('general.goto') }}
            </Button>

            <Select
              v-if="isSelectGoToPage"
              v-model="goToPage"
              :options="Array.from({ length: totalPages }, (_, i) => ({ label: i + 1, value: i + 1 }))"
              option-label="label"
              option-value="value"
              @update:model-value="handleGoToPage"
            />
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <Button
            icon="pi pi-print"
            @click="handlePrint"
            :loading="isProcessing"
          />
          <Button
            icon="pi pi-download"
            @click="handleDownload"
            :loading="isProcessing"
          />
          <Select
            v-model="downloadType"
            :options="Object.values(DOWNLOAD_TYPE)"
            option-label="label"
            option-value="value"
          />
          <!-- <Button
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
          /> -->
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { DOWNLOAD_TYPE } from '@/constants'

interface Props {
  isProcessing: boolean
  currentPage: number
  totalPages: number
}

interface Emits {
  (e: 'print'): void
  (e: 'download'): void
  (e: 'setPage', page: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const goToPage = ref<number>(props.currentPage)
const downloadType = ref<string>(DOWNLOAD_TYPE.PDF)
const isSelectGoToPage = ref<boolean>(false)

const handlePrint = () => {
  emit('print')
}

const handleDownload = () => {
  emit('download')
}

const handleSetPage = (page: number) => {
  emit('setPage', page)
}

const handleToggleSelectGoToPage = () => {
  isSelectGoToPage.value = !isSelectGoToPage.value
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
    goToPage.value = props.currentPage
  },
)
</script>

<style lang="scss" scoped>
.p-card {
  :deep(.p-card-body) {
    padding: 0.75rem;
  }
}

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
      margin-right: 1rem;
    }

    .go-to-page {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      margin-left: 0.3rem;
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    margin-left: auto;
  }
}
</style>
