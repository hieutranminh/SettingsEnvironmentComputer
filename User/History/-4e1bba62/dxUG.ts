// workers/print-preview.worker.ts
import type { PrintPreviewOptions } from '@/types/print-preview.types'
import { PrepaidCardsByClientsHandler } from '@/workers/worker-handlers/prepaid-cards-by-clients.handler'

const handlerMap = new Map([
  ['PREPAID_CARDS_BY_CLIENTS', PrepaidCardsByClientsHandler],
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
