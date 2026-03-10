import { saveAs } from 'file-saver'
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAuth } from '@/composables/useAuth'
import { useMessageDialog } from '@/composables/useMessageDialog'
import { useServices } from '@/composables/useServices'

import { FILE_EXTENSIONS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/print-preview.constants'
import { usePrintPreviewStore } from '../stores/print-preview.store'
import type {
  WorkerType,
  TableHeader,
  ReportHeader,
  PrintDataOption,
  WorkerMessage,
} from '../types/print-preview.types'
import { generateFileName } from '../utils/format-helpers'

export const usePrintPreview = () => {
  const { t } = useI18n()
  const printPreviewStore = usePrintPreviewStore()
  const { getHeaders } = useServices()
  const { refreshToken, redirectToLogin } = useAuth()
  const { showDialogAlert } = useMessageDialog()

  const printContentRef = ref<string>('')
  const isModalVisible = ref<boolean>(false)

  // Computed
  const isWorkerSupported = computed(() => typeof Worker !== 'undefined')

  const canStartPrint = computed(() => isWorkerSupported.value && !printPreviewStore.isWorkerProcessing.value)

  const fileName = computed(() => {
    if (!printPreviewStore.reportPrintDate.value) return ''
    return generateFileName('Report', printPreviewStore.reportPrintDate.value)
  })

  // Methods
  const createWorker = (): Worker | null => {
    if (!isWorkerSupported.value) {
      printPreviewStore.setError(ERROR_MESSAGES.WORKER_NOT_SUPPORTED)
      return null
    }

    try {
      const worker = new Worker(new URL('../workers/print-preview.worker.ts', import.meta.url), { type: 'module' })

      worker.onmessage = printPreviewStore.handleWorkerMessage
      worker.onerror = printPreviewStore.handleWorkerError

      return worker
    } catch (error) {
      printPreviewStore.setError(ERROR_MESSAGES.WORKER_INIT_FAILED)
      console.error('Failed to create worker:', error)
      return null
    }
  }

  const initializeWorker = (): void => {
    const worker = createWorker()
    if (worker) {
      printPreviewStore.setWorker(worker)
    }
  }

  const postMessageToWorker = (message: WorkerMessage): void => {
    const worker = printPreviewStore.printPreviewWorker.value

    if (!worker) {
      initializeWorker()
      const newWorker = printPreviewStore.printPreviewWorker.value
      if (!newWorker) {
        printPreviewStore.setError(ERROR_MESSAGES.WORKER_INIT_FAILED)
        return
      }
    }

    nextTick(() => {
      printPreviewStore.setProcessing(true)
      printPreviewStore.printPreviewWorker.value?.postMessage(message)
    })
  }

  const startPrintPreview = async (
    workerType: WorkerType,
    tableHeaders: TableHeader[],
    reportHeaders: ReportHeader[],
    requestPayload: Record<string, any> = {},
    additionalOptions: Record<string, any> = {},
  ): Promise<void> => {
    if (!canStartPrint.value) {
      return
    }

    try {
      // Initialize print data
      printPreviewStore.initializePrintData(printContentRef.value)

      // Create print data option
      const printDataOption: PrintDataOption = {
        workerType,
        tableHeaders,
        reportHeaders,
        additionalOptions,
        requestPayload,
      }

      printPreviewStore.setPrintDataOption(printDataOption)

      // Initialize worker if needed
      if (!printPreviewStore.printPreviewWorker.value) {
        initializeWorker()
      }

      // Prepare worker message
      const workerMessage: WorkerMessage = {
        workerType,
        tableHeaders,
        reportHeaders,
        requestPayload,
        additionalOptions,
        locale: t('locale'),
        printDate: printPreviewStore.printDate.value,
        requestHeaders: getHeaders(),
        isLandscapePrintContent: printPreviewStore.isLandscapePrintContent.value,
      }

      // Post message to worker
      postMessageToWorker(workerMessage)
    } catch (error) {
      printPreviewStore.setError(ERROR_MESSAGES.WORKER_ERROR)
      console.error('Error starting print preview:', error)
    }
  }

  const handleSaveAsPdf = (reportName: string): void => {
    if (!printPreviewStore.pdfBlobUrl.value) {
      printPreviewStore.setError(ERROR_MESSAGES.PDF_GENERATION_FAILED)
      return
    }

    try {
      const fileName = generateFileName(reportName, printPreviewStore.reportPrintDate.value, FILE_EXTENSIONS.PDF)
      saveAs(printPreviewStore.pdfBlobUrl.value, fileName)
      printPreviewStore.setSuccess(SUCCESS_MESSAGES.PDF_GENERATED)
    } catch (error) {
      printPreviewStore.setError(ERROR_MESSAGES.PDF_GENERATION_FAILED)
      console.error('Error saving PDF:', error)
    }
  }

  const handleSaveAsExcel = (reportName: string): void => {
    if (!printPreviewStore.excelBlob.value) {
      printPreviewStore.setError(ERROR_MESSAGES.EXCEL_GENERATION_FAILED)
      return
    }

    try {
      const fileName = generateFileName(reportName, printPreviewStore.reportPrintDate.value, FILE_EXTENSIONS.EXCEL)
      saveAs(printPreviewStore.excelBlob.value, fileName)
      printPreviewStore.setSuccess(SUCCESS_MESSAGES.EXCEL_GENERATED)
    } catch (error) {
      printPreviewStore.setError(ERROR_MESSAGES.EXCEL_GENERATION_FAILED)
      console.error('Error saving Excel:', error)
    }
  }

  const handleRefreshToken = async (): Promise<void> => {
    try {
      const result = await refreshToken()

      if (!result.success) {
        redirectToLogin()
        return
      }

      // Retry the print operation with refreshed token
      if (printPreviewStore.printDataOption.value) {
        const { workerType, tableHeaders, reportHeaders, additionalOptions, requestPayload } =
          printPreviewStore.printDataOption.value

        await startPrintPreview(workerType, tableHeaders, reportHeaders, requestPayload, additionalOptions)
      }
    } catch (error) {
      console.error('Error refreshing token:', error)
      redirectToLogin()
    }
  }

  const handleWorkerMessage = (event: MessageEvent): void => {
    const { data } = event

    if (data?.status === 401) {
      handleRefreshToken()
      return
    }

    printPreviewStore.handleWorkerMessage(event)
  }

  const showPrintPreviewModal = (): void => {
    isModalVisible.value = true
  }

  const hidePrintPreviewModal = (): void => {
    isModalVisible.value = false

    // Terminate worker if still processing
    if (printPreviewStore.isWorkerProcessing.value) {
      printPreviewStore.terminateWorker()
    }
  }

  const handlePrintButtonClick = async (
    workerType: WorkerType,
    tableHeaders: TableHeader[],
    reportHeaders: ReportHeader[],
    requestPayload: Record<string, any> = {},
    additionalOptions: Record<string, any> = {},
  ): Promise<void> => {
    await startPrintPreview(workerType, tableHeaders, reportHeaders, requestPayload, additionalOptions)
    showPrintPreviewModal()
  }

  const handleError = (error: string): void => {
    printPreviewStore.setError(error)
    showDialogAlert(error)
  }

  const resetPrintPreview = (): void => {
    printPreviewStore.resetState()
    hidePrintPreviewModal()
  }

  // Cleanup on unmount
  onUnmounted(() => {
    printPreviewStore.terminateWorker()
  })

  return {
    // State
    printContentRef,
    isModalVisible,

    // Computed
    isWorkerSupported,
    canStartPrint,
    fileName,

    // Store state
    state: printPreviewStore.state,
    isReady: printPreviewStore.isReady,
    hasError: printPreviewStore.hasError,
    canDownload: printPreviewStore.canDownload,
    printDate: printPreviewStore.printDate,
    isWorkerProcessing: printPreviewStore.isWorkerProcessing,
    progressPercentage: printPreviewStore.progressPercentage,
    errorMessage: printPreviewStore.errorMessage,
    successMessage: printPreviewStore.successMessage,

    // Methods
    startPrintPreview,
    handleSaveAsPdf,
    handleSaveAsExcel,
    handleRefreshToken,
    handleWorkerMessage,
    showPrintPreviewModal,
    hidePrintPreviewModal,
    handlePrintButtonClick,
    handleError,
    resetPrintPreview,
    clearMessages: printPreviewStore.clearMessages,
    clearError: printPreviewStore.clearError,
    clearSuccess: printPreviewStore.clearSuccess,
  }
}
