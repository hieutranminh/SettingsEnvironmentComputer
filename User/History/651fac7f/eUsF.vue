<template>
  <Dialog
    v-model:visible="printStore.isVisible"
    modal
    maximizable
    header="Print Preview"
    class="print-preview-dialog"
    :draggable="false"
    :resizable="false"
    :close-on-escape="false"
    :style="{ width: '95vw', height: '95vh' }"
  >
    <!-- Processing State -->
    <div
      v-if="isProcessing"
      class="processing-state"
    >
      <ProgressSpinner />
    </div>

    <div
      v-else
      class="print-preview-content"
    >
      <!-- Configuration Panel -->
      <PrintConfigurationComponent
        v-if="showConfiguration"
        :configuration="localConfiguration"
        @update:configuration="handleConfigurationChange"
      />

      <!-- Preview Container -->
      <div class="preview-container">
        <!-- Preview Header -->
        <div class="preview-header">
          <PrintActions
            :is-processing="isProcessing"
            :current-page="currentPage"
            :total-pages="totalPages"
            @print="handlePrint"
            @downloadPdf="handleDownloadPDF"
            @downloadExcel="handleDownloadExcel"
            @toggleConfiguration="handleToggleConfiguration"
            @setPage="handleSetPage"
          />
        </div>

        <!-- Preview Content Area -->
        <div class="preview-content">
          <h3>{{ printData?.title }}</h3>
          <component
            v-if="printData"
            :is="getPreviewComponent()"
            :print-data="printData"
            :current-page="currentPage"
            :configuration="localConfiguration"
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

import { usePrint } from '@/composables/usePrint'
import { usePrintStore } from '@/stores/print/print'
import type { PrintConfiguration } from '@/types/print'

// Components
import PrintActions from './PrintActions.vue'
import PrintConfigurationComponent from './PrintConfiguration.vue'
import ChartPrintTemplate from './templates/ChartPrintTemplate.vue'
import ContentPrintTemplate from './templates/ContentPrintTemplate.vue'
import MixedContentTemplate from './templates/MixedContentTemplate.vue'
import TablePrintTemplate from './templates/TablePrintTemplate.vue'

// Store and composable
const printStore = usePrintStore()
const { print, downloadPDF, downloadExcel, setPage, setConfiguration } = usePrint()

// Local state
const showConfiguration = ref(false)

// Computed properties
const isProcessing = computed(() => printStore.isProcessing)
const currentPage = computed(() => printStore.currentPage)
const totalPages = computed(() => printStore.totalPages)
const printData = computed(() => printStore.printData)
const configuration = computed(() => printStore.configuration)

// Local configuration for real-time preview
const localConfiguration = ref<PrintConfiguration>({ ...configuration.value })

const handlePrint = async () => {
  try {
    await print()
  } catch (error) {
    console.error('Print failed:', error)
  }
}

const handleDownloadPDF = async () => {
  try {
    await downloadPDF()
  } catch (error) {
    console.error('PDF download failed:', error)
  }
}

const handleDownloadExcel = async () => {
  try {
    await downloadExcel()
  } catch (error) {
    console.error('Excel download failed:', error)
  }
}

const handleToggleConfiguration = () => {
  showConfiguration.value = !showConfiguration.value
}

const handleSetPage = (page: number) => {
  setPage(page)
}

const handleConfigurationChange = () => {
  setConfiguration(localConfiguration.value)
}

const getPreviewComponent = () => {
  if (!printData.value) return null

  switch (printData.value.printType) {
    case 'table':
      return TablePrintTemplate
    case 'chart':
      return ChartPrintTemplate
    case 'mixed':
      return MixedContentTemplate
    case 'content':
      return ContentPrintTemplate
    default:
      return null
  }
}

// Watchers
watch(
  configuration,
  (newConfig) => {
    localConfiguration.value = { ...newConfig }
  },
  { deep: true },
)

watch(currentPage, () => {
  // Page changed, any additional logic can be added here
})
</script>

<style lang="scss" scoped>
.print-preview-dialog {
  .preview-container {
    .preview-header {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--p-neutral-200);
    }
  }
}
</style>
