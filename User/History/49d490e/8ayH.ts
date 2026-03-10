import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PrintState, PrintData, PrintConfiguration } from '@/types/print'

export const usePrintStore = defineStore('print', () => {
  // State
  const isVisible = ref(false)
  const isProcessing = ref(false)
  const currentPage = ref(1)
  const totalPages = ref(1)
  const printData = ref<PrintData | null>(null)

  const configuration = ref<PrintConfiguration>({
    pageSize: 'A4',
    orientation: 'landscape',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
  })

  // Computed
  const state = computed<PrintState>(() => ({
    isVisible: isVisible.value,
    isProcessing: isProcessing.value,
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    printData: printData.value,
    configuration: configuration.value,
  }))

  // Actions
  const openPrintPreview = (data: PrintData) => {
    printData.value = data
    isVisible.value = true
    isProcessing.value = true
    currentPage.value = 1

    // Calculate total pages based on data and pagination
    if (data.enablePagination && data.printData) {
      const rowsPerPage = data.rowsPerPage || 20
      totalPages.value = Math.ceil(data.printData.length / rowsPerPage)
    } else {
      totalPages.value = 1
    }

    // Simulate processing delay
    setTimeout(() => {
      isProcessing.value = false
    }, 1000)
  }

  const closePrintPreview = () => {
    isVisible.value = false
    isProcessing.value = false
    printData.value = null
    currentPage.value = 1
    totalPages.value = 1
  }

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const setConfiguration = (config: Partial<PrintConfiguration>) => {
    configuration.value = { ...configuration.value, ...config }
  }

  const setProcessing = (processing: boolean) => {
    isProcessing.value = processing
  }

  return {
    // State
    isVisible,
    isProcessing,
    currentPage,
    totalPages,
    printData,
    configuration,

    // Computed
    state,

    // Actions
    openPrintPreview,
    closePrintPreview,
    setPage,
    setConfiguration,
    setProcessing,
  }
})
