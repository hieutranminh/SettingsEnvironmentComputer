import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePrintStore = defineStore('print', () => {
  // State
  const isDialogVisible = ref(false)
  const isProcessing = ref(false)
  const printConfig = ref({
    title: '',
    printType: 'table', // table | chart | mixed | content
    printData: null,
    content: null,
    sectionRef: null,
    enablePagination: false,
    rowsPerPage: 20,
    currentPage: 1,
    totalPages: 1,
    pageSize: 'A4',
    orientation: 'portrait',
    margins: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20,
    },
    selectedColumns: [],
    columnWidths: {},
    printSections: [],
  })

  // Computed
  const paginatedData = computed(() => {
    if (!printConfig.value.enablePagination || !printConfig.value.printData) {
      return printConfig.value.printData
    }

    const start = (printConfig.value.currentPage - 1) * printConfig.value.rowsPerPage
    const end = start + printConfig.value.rowsPerPage
    return printConfig.value.printData.slice(start, end)
  })

  // Actions
  const openDialog = async (config) => {
    isProcessing.value = true
    isDialogVisible.value = true

    // Reset pagination
    printConfig.value = {
      ...printConfig.value,
      ...config,
      currentPage: 1,
    }

    // Calculate total pages if pagination is enabled
    if (config.enablePagination && config.printData) {
      printConfig.value.totalPages = Math.ceil(config.printData.length / config.rowsPerPage)
    }

    // Auto-detect orientation
    if (config.sectionRef) {
      await detectOrientation(config.sectionRef)
    }

    // Simulate processing time
    setTimeout(() => {
      isProcessing.value = false
    }, 500)
  }

  const closeDialog = () => {
    isDialogVisible.value = false
    isProcessing.value = false
  }

  const detectOrientation = async (sectionRef) => {
    await nextTick()
    const element = sectionRef.value || sectionRef
    if (element) {
      const width = element.offsetWidth
      printConfig.value.orientation = width > 595.28 ? 'landscape' : 'portrait'
    }
  }

  const setPage = (page) => {
    printConfig.value.currentPage = page
  }

  const nextPage = () => {
    if (printConfig.value.currentPage < printConfig.value.totalPages) {
      printConfig.value.currentPage++
    }
  }

  const prevPage = () => {
    if (printConfig.value.currentPage > 1) {
      printConfig.value.currentPage--
    }
  }

  const firstPage = () => {
    printConfig.value.currentPage = 1
  }

  const lastPage = () => {
    printConfig.value.currentPage = printConfig.value.totalPages
  }

  return {
    isDialogVisible,
    isProcessing,
    printConfig,
    paginatedData,
    openDialog,
    closeDialog,
    setPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  }
})
