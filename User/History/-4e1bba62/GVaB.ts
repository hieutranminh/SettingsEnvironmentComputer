// workers/print-preview.worker.ts
import type { PrintPreviewOptions } from '../types/print-preview.types'

import { SalesHistoryHandler } from '@/modules/print-preview/workers/worker-handlers/sales-history.handler'
// ... import other handlers

const handlerMap = new Map([
  ['SALES_HISTORY', SalesHistoryHandler],
  // ... register other handlers
])

self.onmessage = async (event: MessageEvent<PrintPreviewOptions>) => {
  try {
    const options = event.data
    const HandlerClass = handlerMap.get(options.workerType)

    if (!HandlerClass) {
      throw new Error(`Unknown worker type: ${options.workerType}`)
    }

    const handler = new HandlerClass()
    await handler.process(options, (progress) => {
      self.postMessage({ isDone: false, progress })
    })

    const { pdfBlobUrl, excelBlob } = handler.getResults()

    self.postMessage({
      isDone: true,
      progress: 100,
      pdfBlobUrl,
      excelBlob,
    })
  } catch (error) {
    self.postMessage({
      isDone: true,
      error: error.message,
    })
  }
}
