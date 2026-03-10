import type { PrintPreviewOptions } from '@/types/print-preview.types'
import type { ProcessResult, ProcessHandler } from '@/workers/worker-handlers/base-handler'

// Import functional handlers
import { processSalesHistory } from './worker-handlers/sales-history.handler'

// Handler registry
const handlerMap = new Map<string, ProcessHandler>([['SALES_HISTORY', processSalesHistory]])

// Worker message handler
self.onmessage = async (event: MessageEvent<PrintPreviewOptions>) => {
  try {
    const options = event.data
    const handlerFunction = handlerMap.get(options.workerType)

    if (!handlerFunction) {
      throw new Error(`Unknown worker type: ${options.workerType}`)
    }

    // Progress callback
    const onProgress = (progress: number) => {
      self.postMessage({
        isDone: false,
        progress,
        type: 'progress',
      })
    }

    // Execute handler function
    const result: ProcessResult = await handlerFunction(options, onProgress)

    // Send success result
    self.postMessage({
      isDone: true,
      progress: 100,
      type: 'success',
      pdfBlobUrl: result.pdfBlobUrl,
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
