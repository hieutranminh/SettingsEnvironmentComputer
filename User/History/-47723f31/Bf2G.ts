import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PrintPreviewState, PrintDataOption, WorkerType, TableHeader, ReportHeader } from '../types/print-preview.types'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/print-preview.constants'

export const usePrintPreviewStore = defineStore('printPreview', () => {
  // State
  const pdfBlobUrl = ref<string>('')
  const excelBlob = ref<Blob | null>(null)
  const isWorkerDone = ref<boolean>(false)
  const isWorkerError = ref<boolean>(false)
  const isWorkerProcessing = ref<boolean>(false)
  const progressPercentage = ref<number>(0)
  const printPreviewWorker = ref<Worker | null>(null)
  const reportPrintDate = ref<Date | null>(null)
  const isLandscapePrintContent = ref<boolean>(false)
  const printDataOption = ref<PrintDataOption | null>(null)
  const errorMessage = ref<string>('')
  const successMessage = ref<string>('')

  // Computed
  const state = computed<PrintPreviewState>(() => ({
    pdfBlobUrl: pdfBlobUrl.value,
    excelBlob: excelBlob.value,
    isWorkerDone: isWorkerDone.value,
    isWorkerError: isWorkerError.value,
    isWorkerProcessing: isWorkerProcessing.value,
    progressPercentage: progressPercentage.value,
    printPreviewWorker: printPreviewWorker.value,
    reportPrintDate: reportPrintDate.value,
    isLandscapePrintContent: isLandscapePrintContent.value,
    printDataOption: printDataOption.value,
  }))

  const isReady = computed(() => 
    isWorkerDone.value && !isWorkerError.value && pdfBlobUrl.value && excelBlob.value
  )

  const hasError = computed(() => isWorkerError.value || errorMessage.value)

  const canDownload = computed(() => 
    isReady.value && !isWorkerProcessing.value
  )

  const printDate = computed(() => {
    if (!reportPrintDate.value) return ''
    const date = new Date(reportPrintDate.value)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const formattedDate = date.toISOString().split('T')[0]
    const dayName = dayNames[date.getDay()]
    return `${formattedDate} (${dayName})`
  })

  // Actions
  const resetState = (): void => {
    pdfBlobUrl.value = ''
    excelBlob.value = null
    isWorkerDone.value = false
    isWorkerError.value = false
    isWorkerProcessing.value = false
    progressPercentage.value = 0
    reportPrintDate.value = null
    isLandscapePrintContent.value = false
    printDataOption.value = null
    errorMessage.value = ''
    successMessage.value = ''
  }

  const setWorker = (worker: Worker | null): void => {
    printPreviewWorker.value = worker
  }

  const setProcessing = (processing: boolean): void => {
    isWorkerProcessing.value = processing
  }

  const setProgress = (percentage: number): void => {
    progressPercentage.value = Math.max(0, Math.min(100, percentage))
  }

  const setError = (error: string): void => {
    isWorkerError.value = true
    isWorkerProcessing.value = false
    errorMessage.value = error
    successMessage.value = ''
  }

  const setSuccess = (message: string): void => {
    successMessage.value = message
    errorMessage.value = ''
  }

  const setWorkerDone = (done: boolean): void => {
    isWorkerDone.value = done
    if (done) {
      isWorkerProcessing.value = false
    }
  }

  const setPdfBlobUrl = (url: string): void => {
    pdfBlobUrl.value = url
  }

  const setExcelBlob = (blob: Blob | null): void => {
    excelBlob.value = blob
  }

  const setReportPrintDate = (date: Date): void => {
    reportPrintDate.value = date
  }

  const setIsLandscape = (landscape: boolean): void => {
    isLandscapePrintContent.value = landscape
  }

  const setPrintDataOption = (option: PrintDataOption): void => {
    printDataOption.value = option
  }

  const initializePrintData = (printContentRef: string): void => {
    resetState()
    setReportPrintDate(new Date())
    
    // Determine landscape based on content width
    if (typeof window !== 'undefined') {
      const printContentElement = document.querySelector(`[ref="${printContentRef}"]`) as HTMLElement
      if (printContentElement) {
        const contentWidth = printContentElement.scrollWidth || printContentElement.offsetWidth
        setIsLandscape(contentWidth > 794) // A4 width in pixels
      }
    }
  }

  const handleWorkerMessage = (event: MessageEvent): void => {
    const { data } = event
    
    if (!data) {
      setError(ERROR_MESSAGES.WORKER_ERROR)
      return
    }

    const {
      isDone,
      errors,
      isError,
      excelBlob,
      pdfBlobUrl: workerPdfBlobUrl,
      progressPercentage: workerProgress,
      status,
    } = data

    // Handle authentication errors
    if (status === 401) {
      setError(ERROR_MESSAGES.UNAUTHORIZED)
      return
    }

    if (status === 403) {
      setError(ERROR_MESSAGES.FORBIDDEN)
      return
    }

    setWorkerDone(isDone)
    setError(isError ? (errors?.join(', ') || ERROR_MESSAGES.WORKER_ERROR) : '')

    if (isDone || isError) {
      setProcessing(false)
    }

    if (!isDone && !isError) {
      setProgress(workerProgress || 0)
    }

    if (isDone && !isError) {
      setExcelBlob(excelBlob)
      setPdfBlobUrl(workerPdfBlobUrl)
      setSuccess(SUCCESS_MESSAGES.PRINT_PREVIEW_READY)
    }
  }

  const handleWorkerError = (error: ErrorEvent): void => {
    setError(ERROR_MESSAGES.WORKER_ERROR)
    console.error('Worker error:', error)
  }

  const terminateWorker = (): void => {
    if (printPreviewWorker.value) {
      printPreviewWorker.value.terminate()
      printPreviewWorker.value = null
    }
  }

  const clearMessages = (): void => {
    errorMessage.value = ''
    successMessage.value = ''
  }

  const clearError = (): void => {
    isWorkerError.value = false
    errorMessage.value = ''
  }

  const clearSuccess = (): void => {
    successMessage.value = ''
  }

  return {
    // State
    pdfBlobUrl,
    excelBlob,
    isWorkerDone,
    isWorkerError,
    isWorkerProcessing,
    progressPercentage,
    printPreviewWorker,
    reportPrintDate,
    isLandscapePrintContent,
    printDataOption,
    errorMessage,
    successMessage,

    // Computed
    state,
    isReady,
    hasError,
    canDownload,
    printDate,

    // Actions
    resetState,
    setWorker,
    setProcessing,
    setProgress,
    setError,
    setSuccess,
    setWorkerDone,
    setPdfBlobUrl,
    setExcelBlob,
    setReportPrintDate,
    setIsLandscape,
    setPrintDataOption,
    initializePrintData,
    handleWorkerMessage,
    handleWorkerError,
    terminateWorker,
    clearMessages,
    clearError,
    clearSuccess,
  }
}) 