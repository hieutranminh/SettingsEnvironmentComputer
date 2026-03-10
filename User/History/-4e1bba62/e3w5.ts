import { PRINT_PREVIEW_WORKER_ACTIONS } from '@/constants/print-preview.constants'
import type { PrintPreviewOptions } from '@/types/print-preview.types'
import type { ProcessHandler } from '@/workers/worker-handlers/base-handler'

// Import functional handlers
import { processBranchSales } from './worker-handlers/branch-sales.handler'

// Handler registry
const handlerMap = new Map<string, ProcessHandler>([[PRINT_PREVIEW_WORKER_ACTIONS.BRANCH_SALES, processBranchSales]])

// Worker message handler
self.onmessage = async (event: MessageEvent<PrintPreviewOptions>) => {
  try {
    console.log('%cWorker received message:', 'color: yellow', event.data)
    const options = event.data
    const handlerFunction = handlerMap.get(options.workerType)

    if (!handlerFunction) {
      throw new Error(`Unknown worker type: ${options.workerType}`)
    }

    // Progress callback
    const onProgress = (progress: number) => {
      console.log('%cWorker onProgress:', 'color: green', progress)
      self.postMessage({
        isDone: false,
        progress,
        type: 'progress',
      })
    }

    // Execute handler function
    const result: { pdfBlob: Blob; excelBlob: Blob } = await handlerFunction(options, onProgress)

    console.log('Worker result:', result)
    // Send success result
    self.postMessage({
      isDone: true,
      progress: 100,
      type: 'success',
      pdfBlob: result.pdfBlob,
      excelBlob: result.excelBlob,
    })
  } catch (error) {
    // Send error result
    self.postMessage({
      isDone: true,
      progress: 0,
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    })
  }
}
